from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models import Student
from pydantic import BaseModel
from datetime import date

router = APIRouter()

class StudentCreate(BaseModel):
    email: str
    password: str
    name: str
    cbse_board_code: str
    current_class: int
    school_name: str
    school_code: Optional[str] = None
    academic_year: str
    date_of_birth: date
    gender: Optional[str] = None

class StudentResponse(BaseModel):
    id: int
    email: str
    name: str
    cbse_board_code: str
    current_class: int
    school_name: str
    school_code: Optional[str]
    academic_year: str
    date_of_birth: date
    gender: Optional[str]

    class Config:
        from_attributes = True

@router.post("/", response_model=StudentResponse)
async def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):
    """Create a new student profile"""
    # Check if email already exists
    existing_student = db.query(Student).filter(Student.email == student.email).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password (in production, use proper password hashing)
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_password = pwd_context.hash(student.password)
    
    # Create student
    db_student = Student(
        email=student.email,
        password_hash=hashed_password,
        name=student.name,
        cbse_board_code=student.cbse_board_code,
        current_class=student.current_class,
        school_name=student.school_name,
        school_code=student.school_code,
        academic_year=student.academic_year,
        date_of_birth=student.date_of_birth,
        gender=student.gender
    )
    
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    
    return db_student

@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    """Get student profile by ID"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return student

@router.get("/", response_model=List[StudentResponse])
async def list_students(
    skip: int = 0,
    limit: int = 100,
    current_class: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """List students with optional filtering"""
    query = db.query(Student)
    
    if current_class:
        query = query.filter(Student.current_class == current_class)
    
    students = query.offset(skip).limit(limit).all()
    return students

@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: int,
    student_update: StudentCreate,
    db: Session = Depends(get_db)
):
    """Update student profile"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Update fields
    for field, value in student_update.dict(exclude_unset=True).items():
        if field != "password":  # Handle password separately
            setattr(student, field, value)
    
    # Handle password update if provided
    if student_update.password:
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        student.password_hash = pwd_context.hash(student_update.password)
    
    db.commit()
    db.refresh(student)
    
    return student

@router.delete("/{student_id}")
async def delete_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    """Delete student profile"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(student)
    db.commit()
    
    return {"message": "Student deleted successfully"}

@router.get("/{student_id}/dashboard")
async def get_student_dashboard(
    student_id: int,
    db: Session = Depends(get_db)
):
    """Get comprehensive dashboard data for a student"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get recent academic records
    from app.models import AcademicRecord, Prediction
    from sqlalchemy import func, desc
    
    recent_records = db.query(AcademicRecord).filter(
        AcademicRecord.student_id == student_id
    ).order_by(desc(AcademicRecord.exam_date)).limit(10).all()
    
    # Get latest predictions
    latest_predictions = db.query(Prediction).filter(
        Prediction.student_id == student_id
    ).order_by(desc(Prediction.prediction_date)).limit(5).all()
    
    # Calculate performance metrics
    if recent_records:
        avg_score = db.query(func.avg(AcademicRecord.score)).filter(
            AcademicRecord.student_id == student_id
        ).scalar()
        
        subject_performance = db.query(
            AcademicRecord.subject,
            func.avg(AcademicRecord.score).label('avg_score'),
            func.count(AcademicRecord.id).label('count')
        ).filter(
            AcademicRecord.student_id == student_id
        ).group_by(AcademicRecord.subject).all()
    else:
        avg_score = 0
        subject_performance = []
    
    dashboard_data = {
        "student": {
            "id": student.id,
            "name": student.name,
            "current_class": student.current_class,
            "academic_year": student.academic_year
        },
        "performance_summary": {
            "overall_average": round(float(avg_score), 2) if avg_score else 0,
            "total_exams": len(recent_records),
            "subjects_count": len(subject_performance)
        },
        "recent_exams": [
            {
                "subject": record.subject,
                "score": record.score,
                "max_score": record.max_score,
                "percentage": round((record.score / record.max_score) * 100, 2),
                "exam_type": record.exam_type.value,
                "exam_date": record.exam_date.isoformat()
            }
            for record in recent_records
        ],
        "subject_performance": [
            {
                "subject": perf.subject,
                "average_score": round(float(perf.avg_score), 2),
                "exam_count": perf.count
            }
            for perf in subject_performance
        ],
        "latest_predictions": [
            {
                "subject": pred.subject,
                "predicted_score": pred.predicted_score,
                "confidence": pred.confidence_score,
                "prediction_date": pred.prediction_date.isoformat()
            }
            for pred in latest_predictions
        ]
    }
    
    return dashboard_data