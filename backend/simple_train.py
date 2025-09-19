#!/usr/bin/env python3
"""
Simplified training script that works with the generated data format
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ml.data_generator import generate_training_data
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_features_simple(student_profile, academic_records):
    """Extract features from student data in a simple way"""
    features = []
    
    # Student profile features
    features.append(student_profile["current_class"])
    features.append(1 if student_profile["gender"] == "male" else 0)  # Gender encoding
    
    # Academic performance features
    if not academic_records:
        # If no records, use defaults
        features.extend([0] * 20)  # 20 default features
        return np.array(features)
    
    # Calculate subject-wise averages
    subject_scores = {}
    exam_type_scores = {}
    
    for record in academic_records:
        subject = record["subject"]
        exam_type = record["exam_type"]
        percentage = (record["score"] / record["max_score"]) * 100
        
        if subject not in subject_scores:
            subject_scores[subject] = []
        subject_scores[subject].append(percentage)
        
        if exam_type not in exam_type_scores:
            exam_type_scores[exam_type] = []
        exam_type_scores[exam_type].append(percentage)
    
    # Subject averages (top 5 subjects)
    main_subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English"]
    for subject in main_subjects:
        if subject in subject_scores:
            features.append(np.mean(subject_scores[subject]))
        else:
            features.append(0)
    
    # Exam type averages
    exam_types = ["unit_test", "mid_term", "final", "pre_board", "board"]
    for exam_type in exam_types:
        if exam_type in exam_type_scores:
            features.append(np.mean(exam_type_scores[exam_type]))
        else:
            features.append(0)
    
    # Overall statistics
    all_scores = [r["score"] / r["max_score"] * 100 for r in academic_records]
    features.append(np.mean(all_scores))  # Overall average
    features.append(np.std(all_scores))   # Score consistency
    features.append(len(academic_records))  # Number of exams
    
    # Recent performance (last 3 exams)
    recent_scores = sorted(academic_records, key=lambda x: x["exam_date"])[-3:]
    if recent_scores:
        recent_avg = np.mean([r["score"] / r["max_score"] * 100 for r in recent_scores])
        features.append(recent_avg)
    else:
        features.append(0)
    
    # Improvement trend (compare first half vs second half)
    if len(all_scores) >= 4:
        mid_point = len(all_scores) // 2
        first_half_avg = np.mean(all_scores[:mid_point])
        second_half_avg = np.mean(all_scores[mid_point:])
        features.append(second_half_avg - first_half_avg)  # Improvement
    else:
        features.append(0)
    
    # Subject diversity (number of different subjects)
    features.append(len(subject_scores))
    
    return np.array(features)

def main():
    """Main training function"""
    logger.info("Starting simplified ML model training...")
    
    # Generate synthetic training data
    logger.info("Generating synthetic training data...")
    training_data = generate_training_data(num_students=1000, years_of_data=2)
    
    if not training_data:
        logger.error("No training data generated!")
        return
    
    logger.info(f"Generated data for {len(training_data)} students")
    
    # Prepare features and targets
    X_list = []
    y_dict = {}
    
    for student_profile, academic_records, board_scores in training_data:
        if not board_scores:  # Skip students without board scores
            continue
            
        try:
            # Extract features
            features = extract_features_simple(student_profile, academic_records)
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
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train models for each subject
    models = {}
    results = {}
    
    for subject, y in y_dict.items():
        logger.info(f"Training model for {subject}...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42
        )
        
        # Train Random Forest model
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42
        )
        
        model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test)
        
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        
        models[subject] = model
        results[subject] = {
            'mae': mae,
            'rmse': rmse,
            'r2': r2
        }
        
        logger.info(f"{subject}: MAE={mae:.2f}, RMSE={rmse:.2f}, R²={r2:.3f}")
    
    # Save models
    os.makedirs("models", exist_ok=True)
    
    # Save individual models
    for subject, model in models.items():
        model_path = f"models/{subject.lower().replace(' ', '_')}_model.joblib"
        joblib.dump(model, model_path)
        logger.info(f"Saved {subject} model to {model_path}")
    
    # Save scaler
    scaler_path = "models/feature_scaler.joblib"
    joblib.dump(scaler, scaler_path)
    logger.info(f"Saved feature scaler to {scaler_path}")
    
    # Save feature names for reference
    feature_names = [
        "current_class", "gender_male",
        "math_avg", "physics_avg", "chemistry_avg", "biology_avg", "english_avg",
        "unit_test_avg", "mid_term_avg", "final_avg", "pre_board_avg", "board_avg",
        "overall_avg", "score_std", "num_exams", "recent_avg", "improvement", "subject_diversity"
    ]
    
    feature_info = {
        "feature_names": feature_names,
        "num_features": len(feature_names),
        "subjects": list(y_dict.keys())
    }
    
    joblib.dump(feature_info, "models/feature_info.joblib")
    logger.info("Saved feature information")
    
    # Test prediction
    logger.info("Testing prediction...")
    try:
        test_features = X_scaled[0:1]  # Use first sample for testing
        
        logger.info("Sample Predictions:")
        for subject, model in models.items():
            pred_score = model.predict(test_features)[0]
            logger.info(f"{subject}: {pred_score:.1f}")
            
    except Exception as e:
        logger.error(f"Error during prediction test: {str(e)}")
    
    # Print overall results
    logger.info("\n=== Training Summary ===")
    avg_mae = np.mean([r['mae'] for r in results.values()])
    avg_rmse = np.mean([r['rmse'] for r in results.values()])
    avg_r2 = np.mean([r['r2'] for r in results.values()])
    
    logger.info(f"Average MAE: {avg_mae:.2f}")
    logger.info(f"Average RMSE: {avg_rmse:.2f}")
    logger.info(f"Average R²: {avg_r2:.3f}")
    logger.info(f"Models trained for {len(models)} subjects")
    
    logger.info("Training completed successfully!")

if __name__ == "__main__":
    main()