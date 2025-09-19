from app.core.database import Base
from .student import Student
from .academic_record import AcademicRecord
from .prediction import Prediction
from .study_session import StudySession
from .study_recommendation import StudyRecommendation
from .model_performance import ModelPerformance

__all__ = [
    "Base",
    "Student", 
    "AcademicRecord", 
    "Prediction", 
    "StudySession", 
    "StudyRecommendation",
    "ModelPerformance"
]