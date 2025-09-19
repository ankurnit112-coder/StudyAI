from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class RecommendationTypeEnum(str, enum.Enum):
    STUDY_FOCUS = "study_focus"
    TIME_MANAGEMENT = "time_management"
    PRACTICE_PROBLEMS = "practice_problems"
    REVISION = "revision"
    EXAM_STRATEGY = "exam_strategy"

class StudyRecommendation(Base):
    __tablename__ = "study_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    recommendation_type = Column(Enum(RecommendationTypeEnum), nullable=False)
    subject = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    priority = Column(Integer, nullable=False)  # 1-5 scale (5 = highest)
    estimated_impact = Column(Float)  # Expected score improvement
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    implemented = Column(Boolean, default=False)
    feedback_rating = Column(Integer)  # 1-5 scale for user feedback
    
    # Relationships
    student = relationship("Student", back_populates="study_recommendations")