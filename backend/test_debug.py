#!/usr/bin/env python3
"""
Debug script to isolate the percentage column issue
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ml.data_generator import generate_historical_data
from app.ml.feature_engineering import CBSEFeatureEngineer
import pandas as pd

def test_data_generation():
    print("Testing data generation...")
    
    # Generate a small dataset
    data = generate_historical_data(num_students=10, years_of_data=1)
    
    if not data:
        print("No data generated!")
        return
    
    print(f"Generated {len(data)} student records")
    
    # Test feature engineering on first student
    student_data, academic_records, target_scores = data[0]
    
    print(f"Student data: {student_data}")
    print(f"Number of academic records: {len(academic_records)}")
    print(f"Sample academic record: {academic_records[0] if academic_records else 'None'}")
    print(f"Target scores: {target_scores}")
    
    # Test feature engineering
    feature_engineer = CBSEFeatureEngineer()
    
    try:
        features = feature_engineer.extract_features(student_data, academic_records)
        print(f"Features extracted successfully: {len(features)} features")
        if hasattr(features, 'keys'):
            print(f"Sample features: {list(features.keys())[:10]}")
        else:
            print(f"Features shape: {features.shape if hasattr(features, 'shape') else 'unknown'}")
            print(f"Sample feature values: {features[:10] if len(features) > 10 else features}")
    except Exception as e:
        print(f"Error in feature extraction: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_data_generation()