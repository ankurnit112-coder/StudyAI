from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.ml.prediction_service import PredictionService
from pydantic import BaseModel

router = APIRouter()

class PredictionRequest(BaseModel):
    student_id: int
    subjects: Optional[List[str]] = None

class PredictionResponse(BaseModel):
    student_id: int
    predictions: dict
    generated_at: str
    model_version: str

@router.post("/generate", response_model=dict)
async def generate_predictions(
    request: PredictionRequest,
    db: Session = Depends(get_db)
):
    """Generate AI predictions for a student's board exam performance"""
    service = PredictionService(db)
    result = service.generate_predictions(request.student_id, request.subjects)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.get("/student/{student_id}")
async def get_student_predictions(
    student_id: int,
    subject: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get prediction history for a student"""
    service = PredictionService(db)
    history = service.get_prediction_history(student_id, subject)
    
    return {
        "student_id": student_id,
        "subject": subject,
        "predictions": history
    }

@router.get("/insights/{student_id}/{subject}")
async def get_subject_insights(
    student_id: int,
    subject: str,
    db: Session = Depends(get_db)
):
    """Get detailed insights for a specific subject"""
    service = PredictionService(db)
    insights = service.get_subject_insights(student_id, subject)
    
    if "error" in insights:
        raise HTTPException(status_code=404, detail=insights["error"])
    
    return insights

@router.put("/accuracy/{prediction_id}")
async def update_prediction_accuracy(
    prediction_id: int,
    actual_score: float,
    db: Session = Depends(get_db)
):
    """Update prediction with actual score for accuracy tracking"""
    service = PredictionService(db)
    success = service.update_prediction_accuracy(prediction_id, actual_score)
    
    if not success:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    return {"message": "Prediction accuracy updated successfully"}

@router.get("/performance")
async def get_model_performance(
    subject: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get model performance metrics"""
    service = PredictionService(db)
    performance = service.get_model_performance(subject)
    
    if "error" in performance:
        raise HTTPException(status_code=404, detail=performance["error"])
    
    return performance