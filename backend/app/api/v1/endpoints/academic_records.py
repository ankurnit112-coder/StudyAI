from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models import AcademicRecord, Student
from pydantic import BaseModel
from datetime import date

router = APIRouter()

class AcademicRecordCreate(BaseModel):
    student_id: int
    exam_type: str  # unit_test, mid_term, final, board, pre_board, practice_test
    subject: str
    score: float
    max_score: float = 100.0
    exam_date: date
    academic_year: str
    term: str  # first_term, second_term

class AcademicRecordResponse(BaseModel):
    id: int
    student_id: int
    exam_type: str
    subject: str
    score: float
    max_score: float
    exam_date: date
    academic_year: str
    term: str
    percentage: float

    class Config:
        from_attributes = True

@router.post("/", response_model=AcademicRecordResponse)
async def create_academic_record(
    record: AcademicRecordCreate,
    db: Session = Depends(get_db)
):
    """Create a new academic record"""
    # Verify student exists
    student = db.query(Student).filter(Student.id == record.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Validate score
    if record.score < 0 or record.score > record.max_score:
        raise HTTPException(status_code=400, detail="Invalid score range")
    
    # Create record
    db_record = AcademicRecord(
        student_id=record.student_id,
        exam_type=record.exam_type,
        subject=record.subject,
        score=record.score,
        max_score=record.max_score,
        exam_date=record.exam_date,
        academic_year=record.academic_year,
        term=record.term
    )
    
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    return db_record

@router.get("/student/{student_id}", response_model=List[AcademicRecordResponse])
async def get_student_records(
    student_id: int,
    subject: Optional[str] = None,
    exam_type: Optional[str] = None,
    academic_year: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get academic records for a student with optional filtering"""
    # Verify student exists
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    query = db.query(AcademicRecord).filter(AcademicRecord.student_id == student_id)
    
    if subject:
        query = query.filter(AcademicRecord.subject == subject)
    
    if exam_type:
        query = query.filter(AcademicRecord.exam_type == exam_type)
    
    if academic_year:
        query = query.filter(AcademicRecord.academic_year == academic_year)
    
    records = query.order_by(AcademicRecord.exam_date.desc()).limit(limit).all()
    
    return records

@router.get("/{record_id}", response_model=AcademicRecordResponse)
async def get_academic_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific academic record"""
    record = db.query(AcademicRecord).filter(AcademicRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Academic record not found")
    
    return record

@router.put("/{record_id}", response_model=AcademicRecordResponse)
async def update_academic_record(
    record_id: int,
    record_update: AcademicRecordCreate,
    db: Session = Depends(get_db)
):
    """Update an academic record"""
    record = db.query(AcademicRecord).filter(AcademicRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Academic record not found")
    
    # Validate score
    if record_update.score < 0 or record_update.score > record_update.max_score:
        raise HTTPException(status_code=400, detail="Invalid score range")
    
    # Update fields
    for field, value in record_update.dict(exclude_unset=True).items():
        setattr(record, field, value)
    
    db.commit()
    db.refresh(record)
    
    return record

@router.delete("/{record_id}")
async def delete_academic_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    """Delete an academic record"""
    record = db.query(AcademicRecord).filter(AcademicRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Academic record not found")
    
    db.delete(record)
    db.commit()
    
    return {"message": "Academic record deleted successfully"}

@router.get("/analytics/subject/{subject}")
async def get_subject_analytics(
    subject: str,
    current_class: Optional[int] = None,
    academic_year: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get analytics for a specific subject across all students"""
    from sqlalchemy import func
    
    query = db.query(AcademicRecord).filter(AcademicRecord.subject == subject)
    
    if current_class:
        query = query.join(Student).filter(Student.current_class == current_class)
    
    if academic_year:
        query = query.filter(AcademicRecord.academic_year == academic_year)
    
    records = query.all()
    
    if not records:
        raise HTTPException(status_code=404, detail="No records found for this subject")
    
    # Calculate analytics
    scores = [record.percentage for record in records]
    
    analytics = {
        "subject": subject,
        "total_records": len(records),
        "average_score": round(sum(scores) / len(scores), 2),
        "highest_score": round(max(scores), 2),
        "lowest_score": round(min(scores), 2),
        "median_score": round(sorted(scores)[len(scores)//2], 2),
        "students_above_75": len([s for s in scores if s >= 75]),
        "students_below_40": len([s for s in scores if s < 40]),
        "grade_distribution": {
            "A1 (91-100)": len([s for s in scores if s >= 91]),
            "A2 (81-90)": len([s for s in scores if 81 <= s < 91]),
            "B1 (71-80)": len([s for s in scores if 71 <= s < 81]),
            "B2 (61-70)": len([s for s in scores if 61 <= s < 71]),
            "C1 (51-60)": len([s for s in scores if 51 <= s < 61]),
            "C2 (41-50)": len([s for s in scores if 41 <= s < 51]),
            "D (33-40)": len([s for s in scores if 33 <= s < 41]),
            "E (0-32)": len([s for s in scores if s < 33])
        }
    }
    
    return analytics

@router.post("/bulk")
async def create_bulk_records(
    records: List[AcademicRecordCreate],
    db: Session = Depends(get_db)
):
    """Create multiple academic records in bulk"""
    created_records = []
    
    for record_data in records:
        # Verify student exists
        student = db.query(Student).filter(Student.id == record_data.student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail=f"Student {record_data.student_id} not found")
        
        # Validate score
        if record_data.score < 0 or record_data.score > record_data.max_score:
            raise HTTPException(status_code=400, detail=f"Invalid score range for student {record_data.student_id}")
        
        # Create record
        db_record = AcademicRecord(
            student_id=record_data.student_id,
            exam_type=record_data.exam_type,
            subject=record_data.subject,
            score=record_data.score,
            max_score=record_data.max_score,
            exam_date=record_data.exam_date,
            academic_year=record_data.academic_year,
            term=record_data.term
        )
        
        db.add(db_record)
        created_records.append(db_record)
    
    db.commit()
    
    # Refresh all records
    for record in created_records:
        db.refresh(record)
    
    return {
        "message": f"Successfully created {len(created_records)} academic records",
        "records": created_records
    }