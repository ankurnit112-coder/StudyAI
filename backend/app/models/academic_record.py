from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Enum, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class ExamTypeEnum(str, enum.Enum):
    UNIT_TEST = "unit_test"
    MID_TERM = "mid_term"
    FINAL = "final"
    BOARD = "board"
    PRE_BOARD = "pre_board"
    PRACTICE_TEST = "practice_test"

class TermEnum(str, enum.Enum):
    FIRST_TERM = "first_term"
    SECOND_TERM = "second_term"

class AcademicRecord(Base):
    __tablename__ = "academic_records"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    exam_type = Column(Enum(ExamTypeEnum), nullable=False)
    subject = Column(String(100), nullable=False)
    score = Column(Float, nullable=False)
    max_score = Column(Float, nullable=False, default=100.0)
    exam_date = Column(Date, nullable=False)
    academic_year = Column(String(10), nullable=False)
    term = Column(Enum(TermEnum), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Constraints
    __table_args__ = (
        CheckConstraint('score >= 0', name='score_non_negative'),
        CheckConstraint('score <= max_score', name='score_within_max'),
        CheckConstraint('max_score > 0', name='max_score_positive'),
    )
    
    # Relationships
    student = relationship("Student", back_populates="academic_records")
    
    @property
    def percentage(self) -> float:
        """Calculate percentage score"""
        return (self.score / self.max_score) * 100 if self.max_score > 0 else 0