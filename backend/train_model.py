#!/usr/bin/env python3
"""
Simple script to train the ML model with synthetic data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ml.data_generator import generate_training_data
from app.ml.feature_engineering import CBSEFeatureEngineer
from app.ml.models import ModelEnsemble
import numpy as np
import pandas as pd
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Main training function"""
    logger.info("Starting ML model training...")
    
    # Generate synthetic training data
    logger.info("Generating synthetic training data...")
    training_data = generate_training_data(num_students=500, years_of_data=2)
    
    if not training_data:
        logger.error("No training data generated!")
        return
    
    logger.info(f"Generated data for {len(training_data)} students")
    
    # Initialize feature engineer
    feature_engineer = CBSEFeatureEngineer()
    
    # Prepare features and targets
    X_list = []
    y_dict = {}
    
    for student_profile, academic_records, board_scores in training_data:
        if not board_scores:  # Skip students without board scores
            continue
            
        try:
            # Extract features
            features = feature_engineer.extract_features(student_profile, academic_records)
            X_list.append(features)
            
            # Collect target scores for each subject
            for subject, score in board_scores.items():
                if subject not in y_dict:
                    y_dict[subject] = []
                y_dict[subject].append(score)
        
        except Exception as e:
            logger.warning(f"Error processing student data: {str(e)}")
            continue
    
    if not X_list:
        logger.error("No valid training samples!")
        return
    
    # Convert to numpy arrays
    X = np.array(X_list)
    
    # Ensure all subjects have the same number of samples
    min_samples = min(len(scores) for scores in y_dict.values())
    X = X[:min_samples]
    
    for subject in y_dict:
        y_dict[subject] = np.array(y_dict[subject][:min_samples])
    
    logger.info(f"Training data shape: {X.shape}")
    logger.info(f"Subjects: {list(y_dict.keys())}")
    
    # Transform features
    X_transformed = feature_engineer.transform_features(X)
    
    # Initialize and train model ensemble
    logger.info("Training model ensemble...")
    model_ensemble = ModelEnsemble()
    
    # Train models
    results = model_ensemble.train(X_transformed, y_dict, optimize_hyperparameters=False)
    
    # Print results
    logger.info("Training Results:")
    for subject, metrics in results.items():
        logger.info(f"{subject}: MAE={metrics['mae']:.2f}, RMSE={metrics['rmse']:.2f}, R²={metrics['r2']:.3f}")
    
    # Save models
    os.makedirs("models", exist_ok=True)
    model_path = "models/cbse_predictor.joblib"
    
    try:
        model_ensemble.save_model(model_path)
        logger.info(f"Model saved to {model_path}")
        
        # Save feature engineer
        feature_engineer.save_scaler("models/feature_scaler.joblib")
        logger.info("Feature scaler saved")
        
    except Exception as e:
        logger.error(f"Error saving model: {str(e)}")
    
    # Test prediction
    logger.info("Testing prediction...")
    try:
        test_features = X_transformed[0:1]  # Use first sample for testing
        predictions = model_ensemble.predict(test_features[0], list(y_dict.keys()))
        
        logger.info("Sample Predictions:")
        for subject, (score, confidence) in predictions.items():
            logger.info(f"{subject}: {score:.1f} (confidence: {confidence:.3f})")
            
    except Exception as e:
        logger.error(f"Error during prediction test: {str(e)}")
    
    logger.info("Training completed successfully!")

if __name__ == "__main__":
    main()