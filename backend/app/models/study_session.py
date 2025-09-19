from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class StudySession(Base):
    __tablename__ = "study_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject = Column(String(100), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    study_method = Column(String(100))  # e.g., "reading", "practice_problems", "video_lecture"
    effectiveness_rating = Column(Integer)  # 1-5 scale
    session_date = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text)
    
    # Relationships
    student = relationship("Student", back_populates="study_sessions")