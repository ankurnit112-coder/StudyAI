from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.ml.training_scheduler import (
    get_scheduler_status, 
    trigger_manual_training,
    start_training_scheduler,
    stop_training_scheduler
)
from app.ml.training_pipeline import MLTrainingPipeline
from pydantic import BaseModel

router = APIRouter()

class TrainingRequest(BaseModel):
    use_synthetic_data: bool = True
    force_retrain: bool = False

@router.get("/status")
async def get_training_status():
    """Get the status of the training scheduler"""
    return get_scheduler_status()

@router.post("/trigger")
async def trigger_training():
    """Manually trigger a training job"""
    result = trigger_manual_training()
    
    if result["status"] == "failed":
        raise HTTPException(status_code=500, detail=result["reason"])
    
    return result

@router.post("/start-scheduler")
async def start_scheduler():
    """Start the training scheduler"""
    try:
        await start_training_scheduler()
        return {"message": "Training scheduler started successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stop-scheduler")
async def stop_scheduler():
    """Stop the training scheduler"""
    try:
        stop_training_scheduler()
        return {"message": "Training scheduler stopped successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pipeline")
async def run_training_pipeline(
    request: TrainingRequest,
    db: Session = Depends(get_db)
):
    """Run the complete training pipeline"""
    try:
        pipeline = MLTrainingPipeline(db)
        
        # Check if retraining is needed (unless forced)
        if not request.force_retrain and not pipeline.should_retrain():
            return {
                "status": "skipped",
                "message": "Model is up to date, no retraining needed"
            }
        
        result = pipeline.run_training_pipeline(request.use_synthetic_data)
        
        if result["status"] == "failed":
            raise HTTPException(status_code=500, detail=result["reason"])
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model-info")
async def get_model_info(db: Session = Depends(get_db)):
    """Get information about the current model"""
    from app.ml.prediction_service import PredictionService
    
    service = PredictionService(db)
    if service.model:
        return service.model.get_model_info()
    else:
        return {"error": "No model loaded"}

@router.get("/data-stats")
async def get_training_data_stats(db: Session = Depends(get_db)):
    """Get statistics about available training data"""
    from app.models import Student, AcademicRecord, Prediction
    
    stats = {
        "total_students": db.query(Student).count(),
        "total_academic_records": db.query(AcademicRecord).count(),
        "total_predictions": db.query(Prediction).count(),
        "students_with_board_exams": db.query(Student).join(AcademicRecord).filter(
            AcademicRecord.exam_type == "board"
        ).distinct().count()
    }
    
    # Subject-wise statistics
    from sqlalchemy import func
    subject_stats = db.query(
        AcademicRecord.subject,
        func.count(AcademicRecord.id).label('count'),
        func.avg(AcademicRecord.score).label('avg_score')
    ).group_by(AcademicRecord.subject).all()
    
    stats["subject_statistics"] = [
        {
            "subject": stat.subject,
            "record_count": stat.count,
            "average_score": round(float(stat.avg_score), 2) if stat.avg_score else 0
        }
        for stat in subject_stats
    ]
    
    return stats

@router.post("/generate-sample-data")
async def generate_sample_data(
    num_students: int = 100,
    years_of_data: int = 2,
    db: Session = Depends(get_db)
):
    """Generate sample training data for testing"""
    try:
        from app.ml.data_generator import generate_historical_data
        
        logger.info(f"Generating sample data for {num_students} students...")
        historical_data = generate_historical_data(num_students, years_of_data, db)
        
        return {
            "status": "success",
            "message": f"Generated sample data for {len(historical_data)} students",
            "students_generated": len(historical_data),
            "years_of_data": years_of_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))