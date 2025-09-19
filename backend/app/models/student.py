from sqlalchemy import Column, Integer, String, Date, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class GenderEnum(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    cbse_board_code = Column(String(10), nullable=False)
    current_class = Column(Integer, nullable=False)  # 9, 10, 11, 12
    school_name = Column(String, nullable=False)
    school_code = Column(String(20))
    academic_year = Column(String(10), nullable=False)  # e.g., "2024-25"
    date_of_birth = Column(Date, nullable=False)
    gender = Column(Enum(GenderEnum))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    academic_records = relationship("AcademicRecord", back_populates="student")
    predictions = relationship("Prediction", back_populates="student")
    study_sessions = relationship("StudySession", back_populates="student")
    study_recommendations = relationship("StudyRecommendation", back_populates="student")