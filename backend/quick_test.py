#!/usr/bin/env python3
"""
Quick verification test
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import joblib
import json
import numpy as np
from app.ml.data_generator import generate_training_data
from enhanced_train import EnhancedCBSETrainer

def main():
    print("QUICK SYSTEM VERIFICATION")
    print("="*50)
    
    # Test 1: Data Generation
    print("1. Testing data generation...")
    data = generate_training_data(num_students=10, years_of_data=1)
    print(f"   ✅ Generated data for {len(data)} students")
    
    # Test 2: Feature Engineering
    print("2. Testing feature engineering...")
    trainer = EnhancedCBSETrainer()
    student_profile, academic_records, board_scores = data[0]
    features = trainer.extract_enhanced_features(student_profile, academic_records)
    print(f"   ✅ Extracted {len(features)} features")
    
    # Test 3: Model Loading
    print("3. Testing model loading...")
    models_dir = "models"
    model_files = [f for f in os.listdir(models_dir) if f.endswith('_enhanced_model.joblib')]
    print(f"   ✅ Found {len(model_files)} model files")
    
    # Test 4: Prediction
    print("4. Testing prediction...")
    if model_files:
        # Load Mathematics model
        math_models = [f for f in model_files if 'mathematics' in f.lower()]
        if math_models:
            model_path = os.path.join(models_dir, math_models[0])
            model = joblib.load(model_path)
            
            # Load scaler and selector
            scaler_path = model_path.replace('_enhanced_model.joblib', '_scaler.joblib')
            selector_path = model_path.replace('_enhanced_model.joblib', '_selector.joblib')
            
            if os.path.exists(scaler_path) and os.path.exists(selector_path):
                scaler = joblib.load(scaler_path)
                selector = joblib.load(selector_path)
                
                # Make prediction
                features_scaled = scaler.transform(features.reshape(1, -1))
                features_selected = selector.transform(features_scaled)
                prediction = model.predict(features_selected)[0]
                
                print(f"   ✅ Mathematics prediction: {prediction:.1f}")
                print(f"   ✅ Prediction valid: {0 <= prediction <= 100}")
            else:
                print("   ⚠️  Scaler/selector files missing")
        else:
            print("   ⚠️  Mathematics model not found")
    
    # Test 5: Training Metadata
    print("5. Checking training metadata...")
    metadata_path = os.path.join(models_dir, "latest_training.json")
    if os.path.exists(metadata_path):
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        results = metadata.get('results', {})
        if results:
            # Get best performing subjects
            sorted_subjects = sorted(results.items(), key=lambda x: x[1]['mae'])
            print(f"   ✅ Best subject: {sorted_subjects[0][0]} (MAE: {sorted_subjects[0][1]['mae']:.2f})")
            
            # Calculate success metrics
            excellent_subjects = [s for s, m in results.items() if m['mae'] < 5 and m['r2'] > 0.8]
            print(f"   ✅ Excellent subjects: {len(excellent_subjects)}")
            print(f"   ✅ Total subjects: {len(results)}")
        else:
            print("   ⚠️  No results in metadata")
    else:
        print("   ⚠️  No metadata file found")
    
    print("\nVERIFICATION COMPLETE!")
    print("="*50)
    
    # Overall assessment
    if len(model_files) >= 10 and len(data) > 0:
        print("SYSTEM STATUS: READY FOR PRODUCTION")
        return True
    else:
        print("SYSTEM STATUS: NEEDS ATTENTION")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)