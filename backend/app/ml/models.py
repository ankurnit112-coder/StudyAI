import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.svm import SVR
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import cross_val_score, GridSearchCV
# import xgboost as xgb  # Commented out for compatibility
import optuna
import joblib
import os
from datetime import datetime
from app.core.config import settings

class CBSEPerformancePredictor:
    """Multi-target regression model for CBSE board exam prediction"""
    
    def __init__(self, model_type: str = "random_forest"):
        self.model_type = model_type
        self.models = {}  # One model per subject
        self.feature_importance = {}
        self.model_version = f"v{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.is_trained = False
        
    def _create_model(self, subject: str) -> Any:
        """Create a model instance for a specific subject"""
        if self.model_type == "xgboost":
            # XGBoost not available, using Random Forest instead
            return RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42
            )
        elif self.model_type == "random_forest":
            return RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42
            )
        elif self.model_type == "gradient_boosting":
            return GradientBoostingRegressor(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                subsample=0.8,
                random_state=42
            )
        else:
            return Ridge(alpha=1.0, random_state=42)
    
    def train(self, X: np.ndarray, y_dict: Dict[str, np.ndarray], 
              optimize_hyperparameters: bool = True) -> Dict[str, float]:
        """Train models for each subject"""
        results = {}
        
        for subject, y in y_dict.items():
            print(f"Training model for {subject}...")
            
            # Create model
            if optimize_hyperparameters and self.model_type in ["random_forest", "gradient_boosting"]:
                model = self._optimize_hyperparameters(X, y, subject)
            else:
                model = self._create_model(subject)
            
            # Train model
            model.fit(X, y)
            self.models[subject] = model
            
            # Calculate metrics
            y_pred = model.predict(X)
            metrics = self._calculate_metrics(y, y_pred)
            results[subject] = metrics
            
            # Store feature importance
            if hasattr(model, 'feature_importances_'):
                self.feature_importance[subject] = model.feature_importances_
            elif hasattr(model, 'coef_'):
                self.feature_importance[subject] = np.abs(model.coef_)
        
        self.is_trained = True
        return results
    
    def _optimize_hyperparameters(self, X: np.ndarray, y: np.ndarray, subject: str) -> Any:
        """Optimize hyperparameters using Optuna"""
        
        def objective(trial):
            params = {
                'n_estimators': trial.suggest_int('n_estimators', 50, 200),
                'max_depth': trial.suggest_int('max_depth', 3, 10),
                'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
                'subsample': trial.suggest_float('subsample', 0.6, 1.0),
                'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
                'reg_alpha': trial.suggest_float('reg_alpha', 0, 10),
                'reg_lambda': trial.suggest_float('reg_lambda', 0, 10),
                'random_state': 42
            }
            
            model = xgb.XGBRegressor(**params)
            scores = cross_val_score(model, X, y, cv=5, scoring='neg_mean_absolute_error')
            return scores.mean()
        
        study = optuna.create_study(direction='maximize')
        study.optimize(objective, n_trials=50, show_progress_bar=False)
        
        best_params = study.best_params
        best_params['random_state'] = 42
        
        return xgb.XGBRegressor(**best_params)
    
    def predict(self, X: np.ndarray, subjects: Optional[List[str]] = None) -> Dict[str, Tuple[float, float]]:
        """Predict scores for given features"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        if subjects is None:
            subjects = list(self.models.keys())
        
        predictions = {}
        for subject in subjects:
            if subject in self.models:
                pred = self.models[subject].predict(X.reshape(1, -1))[0]
                
                # Calculate confidence based on model performance and feature similarity
                confidence = self._calculate_confidence(X, subject)
                
                # Ensure prediction is within valid range (0-100)
                pred = np.clip(pred, 0, 100)
                
                predictions[subject] = (pred, confidence)
        
        return predictions
    
    def _calculate_confidence(self, X: np.ndarray, subject: str) -> float:
        """Calculate prediction confidence"""
        # Simple confidence calculation based on model type
        if self.model_type == "random_forest" and hasattr(self.models[subject], 'estimators_'):
            # For Random Forest, use prediction variance
            predictions = np.array([tree.predict(X.reshape(1, -1))[0] 
                                  for tree in self.models[subject].estimators_])
            variance = np.var(predictions)
            confidence = 1.0 / (1.0 + variance / 100)  # Normalize variance
        else:
            # Default confidence based on training performance
            confidence = 0.85  # Base confidence
        
        return min(max(confidence, 0.5), 0.99)  # Clamp between 0.5 and 0.99
    
    def _calculate_metrics(self, y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
        """Calculate model performance metrics"""
        return {
            'mae': mean_absolute_error(y_true, y_pred),
            'rmse': np.sqrt(mean_squared_error(y_true, y_pred)),
            'r2': r2_score(y_true, y_pred),
            'accuracy': 1.0 - (mean_absolute_error(y_true, y_pred) / 100.0)  # Percentage accuracy
        }
    
    def evaluate(self, X_test: np.ndarray, y_test_dict: Dict[str, np.ndarray]) -> Dict[str, Dict[str, float]]:
        """Evaluate model performance on test data"""
        if not self.is_trained:
            raise ValueError("Model must be trained before evaluation")
        
        results = {}
        for subject, y_test in y_test_dict.items():
            if subject in self.models:
                y_pred = self.models[subject].predict(X_test)
                results[subject] = self._calculate_metrics(y_test, y_pred)
        
        return results
    
    def get_feature_importance(self, subject: str, feature_names: List[str]) -> Dict[str, float]:
        """Get feature importance for a specific subject"""
        if subject not in self.feature_importance:
            return {}
        
        importance_dict = {}
        importances = self.feature_importance[subject]
        
        for i, importance in enumerate(importances):
            if i < len(feature_names):
                importance_dict[feature_names[i]] = float(importance)
        
        # Sort by importance
        return dict(sorted(importance_dict.items(), key=lambda x: x[1], reverse=True))
    
    def save_model(self, filepath: str):
        """Save trained model to disk"""
        if not self.is_trained:
            raise ValueError("Model must be trained before saving")
        
        model_data = {
            'models': self.models,
            'feature_importance': self.feature_importance,
            'model_type': self.model_type,
            'model_version': self.model_version,
            'is_trained': self.is_trained
        }
        
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump(model_data, filepath)
    
    def load_model(self, filepath: str):
        """Load trained model from disk"""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found: {filepath}")
        
        model_data = joblib.load(filepath)
        
        self.models = model_data['models']
        self.feature_importance = model_data['feature_importance']
        self.model_type = model_data['model_type']
        self.model_version = model_data['model_version']
        self.is_trained = model_data['is_trained']
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get model information"""
        return {
            'model_type': self.model_type,
            'model_version': self.model_version,
            'is_trained': self.is_trained,
            'subjects': list(self.models.keys()) if self.is_trained else [],
            'total_models': len(self.models)
        }

class ModelEnsemble:
    """Ensemble of multiple models for improved predictions"""
    
    def __init__(self, model_types: List[str] = ["random_forest", "gradient_boosting", "ridge"]):
        self.model_types = model_types
        self.models = {}
        self.weights = {}
        self.is_trained = False
    
    def train(self, X: np.ndarray, y_dict: Dict[str, np.ndarray]) -> Dict[str, Dict[str, float]]:
        """Train ensemble of models"""
        results = {}
        
        # Train individual models
        for model_type in self.model_types:
            print(f"Training {model_type} models...")
            model = CBSEPerformancePredictor(model_type=model_type)
            model_results = model.train(X, y_dict, optimize_hyperparameters=False)
            
            self.models[model_type] = model
            results[model_type] = model_results
        
        # Calculate ensemble weights based on performance
        self._calculate_ensemble_weights(results)
        self.is_trained = True
        
        return results
    
    def _calculate_ensemble_weights(self, results: Dict[str, Dict[str, float]]):
        """Calculate weights for ensemble based on model performance"""
        for subject in settings.CBSE_SUBJECTS:
            subject_weights = {}
            total_accuracy = 0
            
            for model_type in self.model_types:
                if subject in results[model_type]:
                    accuracy = results[model_type][subject]['accuracy']
                    subject_weights[model_type] = accuracy
                    total_accuracy += accuracy
                else:
                    subject_weights[model_type] = 0
            
            # Normalize weights
            if total_accuracy > 0:
                for model_type in subject_weights:
                    subject_weights[model_type] /= total_accuracy
            else:
                # Equal weights if no performance data
                for model_type in subject_weights:
                    subject_weights[model_type] = 1.0 / len(self.model_types)
            
            self.weights[subject] = subject_weights
    
    def predict(self, X: np.ndarray, subjects: Optional[List[str]] = None) -> Dict[str, Tuple[float, float]]:
        """Make ensemble predictions"""
        if not self.is_trained:
            raise ValueError("Ensemble must be trained before making predictions")
        
        if subjects is None:
            subjects = list(self.weights.keys())
        
        ensemble_predictions = {}
        
        for subject in subjects:
            if subject in self.weights:
                weighted_pred = 0
                weighted_conf = 0
                total_weight = 0
                
                for model_type, weight in self.weights[subject].items():
                    if model_type in self.models and weight > 0:
                        pred_dict = self.models[model_type].predict(X, [subject])
                        if subject in pred_dict:
                            pred, conf = pred_dict[subject]
                            weighted_pred += pred * weight
                            weighted_conf += conf * weight
                            total_weight += weight
                
                if total_weight > 0:
                    ensemble_predictions[subject] = (
                        weighted_pred / total_weight,
                        weighted_conf / total_weight
                    )
        
        return ensemble_predictions