from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class ModelPerformance(Base):
    __tablename__ = "model_performance"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)
    model_version = Column(String(50), nullable=False)
    subject = Column(String(100), nullable=False)
    accuracy = Column(Float, nullable=False)
    precision = Column(Float)
    recall = Column(Float)
    f1_score = Column(Float)
    mae = Column(Float)  # Mean Absolute Error
    rmse = Column(Float)  # Root Mean Square Error
    training_samples = Column(Integer, nullable=False)
    validation_samples = Column(Integer, nullable=False)
    hyperparameters = Column(JSON)
    feature_importance = Column(JSON)
    training_date = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    
    @property
    def performance_score(self) -> float:
        """Calculate overall performance score"""
        weights = {
            'accuracy': 0.4,
            'precision': 0.2,
            'recall': 0.2,
            'f1_score': 0.2
        }
        
        score = 0.0
        total_weight = 0.0
        
        for metric, weight in weights.items():
            value = getattr(self, metric)
            if value is not None:
                score += value * weight
                total_weight += weight
        
        return score / total_weight if total_weight > 0 else 0.0