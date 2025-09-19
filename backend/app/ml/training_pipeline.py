import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Student, AcademicRecord, Prediction, ModelPerformance
from app.ml.feature_engineering import CBSEFeatureEngineer
from app.ml.models import CBSEPerformancePredictor, ModelEnsemble
from app.ml.data_generator import generate_historical_data
from app.core.config import settings
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MLTrainingPipeline:
    """Complete ML training pipeline for CBSE performance prediction"""
    
    def __init__(self, db: Session):
        self.db = db
        self.feature_engineer = CBSEFeatureEngineer()
        self.model = None
        self.model_path = os.path.join(settings.ML_MODEL_PATH, "cbse_predictor.joblib")
        
    def run_training_pipeline(self, use_synthetic_data: bool = True) -> Dict:
        """Run the complete training pipeline"""
        logger.info("Starting ML training pipeline...")
        
        try:
            # Step 1: Prepare training data
            X, y_dict, metadata = self.prepare_training_data(use_synthetic_data)
            
            if X is None or len(X) < settings.MIN_TRAINING_SAMPLES:
                logger.warning(f"Insufficient training data: {len(X) if X is not None else 0} samples")
                return {"status": "failed", "reason": "insufficient_data"}
            
            # Step 2: Train model
            training_results = self.train_model(X, y_dict)
            
            # Step 3: Evaluate model
            evaluation_results = self.evaluate_model(X, y_dict)
            
            # Step 4: Save model and results
            self.save_model_and_results(training_results, evaluation_results, metadata)
            
            logger.info("Training pipeline completed successfully")
            return {
                "status": "success",
                "training_samples": len(X),
                "subjects_trained": list(y_dict.keys()),
                "model_version": self.model.model_version,
                "results": evaluation_results
            }
            
        except Exception as e:
            logger.error(f"Training pipeline failed: {str(e)}")
            return {"status": "failed", "reason": str(e)}
    
    def prepare_training_data(self, use_synthetic_data: bool = True) -> Tuple[np.ndarray, Dict, Dict]:
        """Prepare training data from database and synthetic sources"""
        logger.info("Preparing training data...")
        
        # Get real data from database
        real_data = self._load_real_data()
        
        # Generate synthetic data if needed
        if use_synthetic_data or len(real_data) < settings.MIN_TRAINING_SAMPLES:
            logger.info("Generating synthetic historical data...")
            synthetic_data = generate_historical_data(
                num_students=5000,
                years_of_data=3,
                db_session=self.db
            )
            
            # Combine real and synthetic data
            all_data = real_data + synthetic_data
        else:
            all_data = real_data
        
        if not all_data:
            logger.warning("No training data available")
            return None, {}, {}
        
        # Extract features and targets
        X_list = []
        y_dict = {subject: [] for subject in settings.CBSE_SUBJECTS}
        
        for student_data, academic_records, target_scores in all_data:
            # Extract features
            features = self.feature_engineer.extract_features(student_data, academic_records)
            X_list.append(features)
            
            # Extract targets (board exam scores)
            for subject in settings.CBSE_SUBJECTS:
                score = target_scores.get(subject, 0)
                y_dict[subject].append(score)
        
        # Convert to numpy arrays
        X = np.array(X_list)
        for subject in y_dict:
            y_dict[subject] = np.array(y_dict[subject])
        
        # Fit feature scalers
        self.feature_engineer.fit_scalers(X)
        X = self.feature_engineer.transform_features(X)
        
        # Remove subjects with insufficient data
        min_samples = 100
        subjects_to_remove = []
        for subject, y in y_dict.items():
            non_zero_count = np.count_nonzero(y)
            if non_zero_count < min_samples:
                subjects_to_remove.append(subject)
        
        for subject in subjects_to_remove:
            del y_dict[subject]
            logger.info(f"Removed {subject} due to insufficient data")
        
        metadata = {
            "total_samples": len(X),
            "feature_count": X.shape[1],
            "subjects_count": len(y_dict),
            "feature_names": self.feature_engineer.get_feature_names()
        }
        
        logger.info(f"Prepared {len(X)} training samples with {len(y_dict)} subjects")
        return X, y_dict, metadata
    
    def _load_real_data(self) -> List[Tuple]:
        """Load real data from database"""
        students = self.db.query(Student).all()
        data = []
        
        for student in students:
            # Get student data
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
            
            # Get target scores (board exam results)
            target_scores = {}
            board_records = [r for r in academic_records if r["exam_type"] == "board"]
            for record in board_records:
                subject = record["subject"]
                percentage = (record["score"] / record["max_score"]) * 100
                target_scores[subject] = percentage
            
            # Only include students with some target scores
            if target_scores:
                data.append((student_data, academic_records, target_scores))
        
        return data
    
    def train_model(self, X: np.ndarray, y_dict: Dict[str, np.ndarray]) -> Dict:
        """Train the ML model"""
        logger.info("Training ML model...")
        
        # Use ensemble for better performance
        self.model = ModelEnsemble()
        training_results = self.model.train(X, y_dict)
        
        return training_results
    
    def evaluate_model(self, X: np.ndarray, y_dict: Dict[str, np.ndarray]) -> Dict:
        """Evaluate model performance"""
        logger.info("Evaluating model performance...")
        
        # For now, evaluate on training data (in production, use separate test set)
        evaluation_results = {}
        
        for subject in y_dict.keys():
            # Make predictions
            predictions = self.model.predict(X, [subject])
            
            if subject in predictions:
                y_pred = []
                confidences = []
                
                for i in range(len(X)):
                    pred_dict = self.model.predict(X[i], [subject])
                    if subject in pred_dict:
                        pred, conf = pred_dict[subject]
                        y_pred.append(pred)
                        confidences.append(conf)
                
                if y_pred:
                    y_true = y_dict[subject][:len(y_pred)]
                    y_pred = np.array(y_pred)
                    
                    # Calculate metrics
                    mae = np.mean(np.abs(y_true - y_pred))
                    rmse = np.sqrt(np.mean((y_true - y_pred) ** 2))
                    accuracy = 1.0 - (mae / 100.0)
                    avg_confidence = np.mean(confidences)
                    
                    evaluation_results[subject] = {
                        "mae": mae,
                        "rmse": rmse,
                        "accuracy": accuracy,
                        "avg_confidence": avg_confidence,
                        "samples": len(y_true)
                    }
        
        return evaluation_results
    
    def save_model_and_results(self, training_results: Dict, evaluation_results: Dict, metadata: Dict):
        """Save model and store results in database"""
        logger.info("Saving model and results...")
        
        # Save model to disk
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        self.model.save_model(self.model_path)
        
        # Store results in database
        for subject, metrics in evaluation_results.items():
            model_performance = ModelPerformance(
                model_name="CBSEEnsemble",
                model_version=self.model.models[list(self.model.models.keys())[0]].model_version,
                subject=subject,
                accuracy=metrics["accuracy"],
                mae=metrics["mae"],
                rmse=metrics["rmse"],
                training_samples=metadata["total_samples"],
                validation_samples=metrics["samples"],
                hyperparameters={"ensemble_weights": self.model.weights.get(subject, {})},
                feature_importance=self._get_feature_importance(subject),
                is_active=True
            )
            
            # Deactivate old models for this subject
            self.db.query(ModelPerformance).filter(
                ModelPerformance.subject == subject,
                ModelPerformance.is_active == True
            ).update({"is_active": False})
            
            self.db.add(model_performance)
        
        self.db.commit()
        logger.info("Model and results saved successfully")
    
    def _get_feature_importance(self, subject: str) -> Dict:
        """Get feature importance for a subject"""
        feature_names = self.feature_engineer.get_feature_names()
        importance_dict = {}
        
        # Get importance from the best performing model in ensemble
        best_model_type = None
        best_weight = 0
        
        if subject in self.model.weights:
            for model_type, weight in self.model.weights[subject].items():
                if weight > best_weight:
                    best_weight = weight
                    best_model_type = model_type
        
        if best_model_type and best_model_type in self.model.models:
            importance_dict = self.model.models[best_model_type].get_feature_importance(
                subject, feature_names
            )
        
        return importance_dict
    
    def should_retrain(self) -> bool:
        """Check if model should be retrained based on performance"""
        # Get latest model performance
        latest_performance = self.db.query(ModelPerformance).filter(
            ModelPerformance.is_active == True
        ).order_by(ModelPerformance.training_date.desc()).first()
        
        if not latest_performance:
            return True  # No model exists
        
        # Check if performance is below threshold
        if latest_performance.accuracy < settings.MODEL_RETRAIN_THRESHOLD:
            return True
        
        # Check if model is too old (older than 30 days)
        days_since_training = (datetime.now() - latest_performance.training_date).days
        if days_since_training > 30:
            return True
        
        return False

def run_training_job():
    """Standalone function to run training job"""
    db = next(get_db())
    try:
        pipeline = MLTrainingPipeline(db)
        result = pipeline.run_training_pipeline()
        logger.info(f"Training job completed: {result}")
        return result
    finally:
        db.close()