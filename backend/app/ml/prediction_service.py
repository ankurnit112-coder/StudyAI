import numpy as np
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session
from app.models import Student, AcademicRecord, Prediction
from app.ml.feature_engineering import CBSEFeatureEngineer
from app.ml.models import ModelEnsemble
from app.core.config import settings
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PredictionService:
    """Service for making academic performance predictions"""
    
    def __init__(self, db: Session):
        self.db = db
        self.feature_engineer = CBSEFeatureEngineer()
        self.model = None
        self.model_path = os.path.join(settings.ML_MODEL_PATH, "cbse_predictor.joblib")
        self._load_model()
    
    def _load_model(self):
        """Load the trained model"""
        try:
            if os.path.exists(self.model_path):
                self.model = ModelEnsemble()
                self.model.load_model(self.model_path)
                logger.info("Model loaded successfully")
            else:
                logger.warning(f"Model file not found: {self.model_path}")
                self.model = None
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            self.model = None
    
    def generate_predictions(self, student_id: int, subjects: Optional[List[str]] = None) -> Dict:
        """Generate predictions for a student"""
        if not self.model:
            return {"error": "Model not available", "predictions": {}}
        
        try:
            # Get student data
            student = self.db.query(Student).filter(Student.id == student_id).first()
            if not student:
                return {"error": "Student not found", "predictions": {}}
            
            # Prepare student data
            student_data = {
                "current_class": student.current_class,
                "gender": student.gender.value if student.gender else "other",
                "school_code": student.school_code,
                "academic_year": student.academic_year
            }
            
            # Get academic records
            academic_records = []
            for record in student.academic_records:
                academic_records.append({
                    "subject": record.subject,
                    "score": record.score,
                    "max_score": record.max_score,
                    "exam_type": record.exam_type.value,
                    "exam_date": record.exam_date.isoformat(),
                    "term": record.term.value
                })
            
            # Extract features
            features = self.feature_engineer.extract_features(student_data, academic_records)
            
            # Make predictions
            if subjects is None:
                subjects = settings.CBSE_SUBJECTS
            
            predictions = self.model.predict(features, subjects)
            
            # Store predictions in database
            self._store_predictions(student_id, predictions)
            
            # Format response
            formatted_predictions = {}
            for subject, (score, confidence) in predictions.items():
                formatted_predictions[subject] = {
                    "predicted_score": round(score, 2),
                    "confidence": round(confidence, 3),
                    "grade": self._score_to_grade(score),
                    "improvement_needed": max(0, 75 - score)  # Points needed to reach 75%
                }
            
            return {
                "student_id": student_id,
                "predictions": formatted_predictions,
                "generated_at": datetime.now().isoformat(),
                "model_version": self.model.models[list(self.model.models.keys())[0]].model_version if self.model.models else "unknown"
            }
            
        except Exception as e:
            logger.error(f"Prediction generation failed for student {student_id}: {str(e)}")
            return {"error": str(e), "predictions": {}}
    
    def _store_predictions(self, student_id: int, predictions: Dict[str, Tuple[float, float]]):
        """Store predictions in database"""
        try:
            model_version = self.model.models[list(self.model.models.keys())[0]].model_version if self.model.models else "unknown"
            
            for subject, (score, confidence) in predictions.items():
                prediction = Prediction(
                    student_id=student_id,
                    subject=subject,
                    predicted_score=score,
                    confidence_score=confidence,
                    model_version=model_version,
                    features_used={}  # Could store feature vector here if needed
                )
                self.db.add(prediction)
            
            self.db.commit()
            
        except Exception as e:
            logger.error(f"Failed to store predictions: {str(e)}")
            self.db.rollback()
    
    def _score_to_grade(self, score: float) -> str:
        """Convert numerical score to CBSE grade"""
        if score >= 91:
            return "A1"
        elif score >= 81:
            return "A2"
        elif score >= 71:
            return "B1"
        elif score >= 61:
            return "B2"
        elif score >= 51:
            return "C1"
        elif score >= 41:
            return "C2"
        elif score >= 33:
            return "D"
        else:
            return "E"
    
    def get_prediction_history(self, student_id: int, subject: Optional[str] = None) -> List[Dict]:
        """Get prediction history for a student"""
        query = self.db.query(Prediction).filter(Prediction.student_id == student_id)
        
        if subject:
            query = query.filter(Prediction.subject == subject)
        
        predictions = query.order_by(Prediction.prediction_date.desc()).limit(50).all()
        
        history = []
        for pred in predictions:
            history.append({
                "id": pred.id,
                "subject": pred.subject,
                "predicted_score": pred.predicted_score,
                "confidence_score": pred.confidence_score,
                "prediction_date": pred.prediction_date.isoformat(),
                "model_version": pred.model_version,
                "actual_score": pred.actual_score,
                "accuracy": pred.accuracy if pred.actual_score else None
            })
        
        return history
    
    def update_prediction_accuracy(self, prediction_id: int, actual_score: float) -> bool:
        """Update prediction with actual score for accuracy calculation"""
        try:
            prediction = self.db.query(Prediction).filter(Prediction.id == prediction_id).first()
            if prediction:
                prediction.actual_score = actual_score
                prediction.accuracy_calculated = True
                self.db.commit()
                return True
            return False
        except Exception as e:
            logger.error(f"Failed to update prediction accuracy: {str(e)}")
            self.db.rollback()
            return False
    
    def get_model_performance(self, subject: Optional[str] = None) -> Dict:
        """Get model performance metrics"""
        from app.models import ModelPerformance
        
        query = self.db.query(ModelPerformance).filter(ModelPerformance.is_active == True)
        
        if subject:
            query = query.filter(ModelPerformance.subject == subject)
        
        performances = query.all()
        
        if not performances:
            return {"error": "No performance data available"}
        
        performance_data = {}
        for perf in performances:
            performance_data[perf.subject] = {
                "accuracy": perf.accuracy,
                "mae": perf.mae,
                "rmse": perf.rmse,
                "training_samples": perf.training_samples,
                "model_version": perf.model_version,
                "training_date": perf.training_date.isoformat(),
                "feature_importance": perf.feature_importance
            }
        
        return performance_data
    
    def get_subject_insights(self, student_id: int, subject: str) -> Dict:
        """Get detailed insights for a specific subject"""
        try:
            # Get student's academic records for the subject
            records = self.db.query(AcademicRecord).filter(
                AcademicRecord.student_id == student_id,
                AcademicRecord.subject == subject
            ).order_by(AcademicRecord.exam_date.desc()).all()
            
            if not records:
                return {"error": "No academic records found for this subject"}
            
            # Calculate performance metrics
            scores = [(r.score / r.max_score) * 100 for r in records]
            
            insights = {
                "subject": subject,
                "current_average": round(np.mean(scores), 2),
                "best_score": round(max(scores), 2),
                "worst_score": round(min(scores), 2),
                "consistency": round(1 / (1 + np.std(scores)), 3),  # Higher is more consistent
                "trend": self._calculate_trend(scores),
                "recent_performance": scores[:5] if len(scores) >= 5 else scores,
                "exam_type_performance": self._analyze_exam_type_performance(records),
                "recommendations": self._generate_subject_recommendations(scores, records)
            }
            
            return insights
            
        except Exception as e:
            logger.error(f"Failed to generate subject insights: {str(e)}")
            return {"error": str(e)}
    
    def _calculate_trend(self, scores: List[float]) -> str:
        """Calculate performance trend"""
        if len(scores) < 3:
            return "insufficient_data"
        
        # Use linear regression to find trend
        x = np.arange(len(scores))
        slope = np.polyfit(x, scores, 1)[0]
        
        if slope > 2:
            return "improving"
        elif slope < -2:
            return "declining"
        else:
            return "stable"
    
    def _analyze_exam_type_performance(self, records: List[AcademicRecord]) -> Dict:
        """Analyze performance by exam type"""
        exam_performance = {}
        
        for record in records:
            exam_type = record.exam_type.value
            percentage = (record.score / record.max_score) * 100
            
            if exam_type not in exam_performance:
                exam_performance[exam_type] = []
            exam_performance[exam_type].append(percentage)
        
        # Calculate averages
        for exam_type, scores in exam_performance.items():
            exam_performance[exam_type] = {
                "average": round(np.mean(scores), 2),
                "count": len(scores),
                "best": round(max(scores), 2),
                "latest": round(scores[0], 2) if scores else 0
            }
        
        return exam_performance
    
    def _generate_subject_recommendations(self, scores: List[float], 
                                        records: List[AcademicRecord]) -> List[str]:
        """Generate recommendations based on performance"""
        recommendations = []
        
        avg_score = np.mean(scores)
        consistency = 1 / (1 + np.std(scores))
        
        if avg_score < 60:
            recommendations.append("Focus on building fundamental concepts in this subject")
            recommendations.append("Consider additional practice sessions")
        
        if consistency < 0.7:
            recommendations.append("Work on maintaining consistent performance")
            recommendations.append("Review study methods for better retention")
        
        # Analyze recent trend
        if len(scores) >= 3:
            recent_trend = self._calculate_trend(scores[:3])
            if recent_trend == "declining":
                recommendations.append("Recent performance shows decline - review recent topics")
        
        # Exam type specific recommendations
        exam_performance = self._analyze_exam_type_performance(records)
        if "board" in exam_performance and "unit_test" in exam_performance:
            board_avg = exam_performance["board"]["average"]
            unit_avg = exam_performance["unit_test"]["average"]
            
            if board_avg < unit_avg - 10:
                recommendations.append("Focus on exam strategy and time management for board exams")
        
        return recommendations[:5]  # Limit to top 5 recommendations