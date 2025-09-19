from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject = Column(String(100), nullable=False)
    predicted_score = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)  # 0.0 to 1.0
    prediction_date = Column(DateTime(timezone=True), server_default=func.now())
    model_version = Column(String(50), nullable=False)
    features_used = Column(JSON)  # Store feature vector used for prediction
    actual_score = Column(Float)  # Filled when actual result is available
    accuracy_calculated = Column(Boolean, default=False)
    
    # Relationships
    student = relationship("Student", back_populates="predictions")
    
    @property
    def accuracy(self) -> float:
        """Calculate prediction accuracy if actual score is available"""
        if self.actual_score is None:
            return None
        return 1.0 - abs(self.predicted_score - self.actual_score) / 100.0