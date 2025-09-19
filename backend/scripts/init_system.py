#!/usr/bin/env python3
"""
Initialize the StudyAI system with sample data and initial ML model training.
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import get_db, engine, Base
from app.models import Student, AcademicRecord
from app.ml.data_generator import generate_sample_data_for_testing, generate_historical_data
from app.ml.training_pipeline import run_training_job
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_tables():
    """Create database tables"""
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")

def create_sample_student():
    """Create a sample student for testing"""
    logger.info("Creating sample student...")
    
    db = next(get_db())
    
    try:
        # Check if sample student already exists
        existing_student = db.query(Student).filter(Student.email == "test@example.com").first()
        if existing_student:
            logger.info("Sample student already exists")
            return existing_student.id
        
        # Create sample student
        student = Student(
            email="test@example.com",
            password_hash="hashed_password",
            name="Test Student",
            cbse_board_code="CBSE123",
            current_class=12,
            school_name="Test School",
            school_code="TS001",
            academic_year="2024-25",
            date_of_birth="2006-01-01",
            gender="other"
        )
        
        db.add(student)
        db.commit()
        db.refresh(student)
        
        logger.info(f"Sample student created with ID: {student.id}")
        return student.id
        
    except Exception as e:
        logger.error(f"Error creating sample student: {str(e)}")
        db.rollback()
        return None
    finally:
        db.close()

def create_sample_academic_records(student_id: int):
    """Create sample academic records for the test student"""
    logger.info("Creating sample academic records...")
    
    db = next(get_db())
    
    try:
        # Check if records already exist
        existing_records = db.query(AcademicRecord).filter(
            AcademicRecord.student_id == student_id
        ).count()
        
        if existing_records > 0:
            logger.info("Sample academic records already exist")
            return
        
        # Generate sample data
        sample_data = generate_sample_data_for_testing()
        
        # Create academic records from sample data
        for record_data in sample_data["academic_records"]:
            record = AcademicRecord(
                student_id=student_id,
                exam_type=record_data["exam_type"],
                subject=record_data["subject"],
                score=record_data["score"],
                max_score=record_data["max_score"],
                exam_date=record_data["exam_date"],
                academic_year="2024-25",
                term=record_data["term"]
            )
            db.add(record)
        
        db.commit()
        logger.info(f"Created {len(sample_data['academic_records'])} sample academic records")
        
    except Exception as e:
        logger.error(f"Error creating sample academic records: {str(e)}")
        db.rollback()
    finally:
        db.close()

def run_initial_training():
    """Run initial ML model training"""
    logger.info("Starting initial ML model training...")
    
    try:
        result = run_training_job()
        
        if result["status"] == "success":
            logger.info("Initial training completed successfully")
            logger.info(f"Training result: {result}")
        else:
            logger.error(f"Initial training failed: {result}")
            
    except Exception as e:
        logger.error(f"Error during initial training: {str(e)}")

def main():
    """Main initialization function"""
    logger.info("Starting StudyAI system initialization...")
    
    # Create database tables
    create_tables()
    
    # Create sample student
    student_id = create_sample_student()
    
    if student_id:
        # Create sample academic records
        create_sample_academic_records(student_id)
    
    # Run initial training
    run_initial_training()
    
    logger.info("StudyAI system initialization completed!")

if __name__ == "__main__":
    main()