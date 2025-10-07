#!/usr/bin/env python3
"""
Script to set up and validate real CBSE data for training
"""

import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

REQUIRED_COLUMNS = [
    'student_id', 'current_class', 'gender', 'subject', 
    'score', 'max_score', 'exam_type', 'exam_date', 
    'term', 'board_score'
]

SUBJECTS = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'English', 'Hindi', 'Computer Science', 'Physical Education',
    'Economics', 'Business Studies', 'Accountancy',
    'Political Science', 'History', 'Geography'
]

EXAM_TYPES = [
    'unit_test', 'mid_term', 'pre_board', 'final', 'board'
]

def validate_data(df):
    """Validate the input data format and content"""
    logger.info("Validating data format...")
    
    # Check required columns
    missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing required columns: {missing_cols}")
    
    # Validate data types
    validation_rules = {
        'student_id': {'type': 'str_or_int', 'required': True},
        'current_class': {'type': 'int', 'min': 9, 'max': 12},
        'gender': {'type': 'category', 'values': ['male', 'female', 'other']},
        'subject': {'type': 'category', 'values': SUBJECTS},
        'score': {'type': 'float', 'min': 0, 'max': 100},
        'max_score': {'type': 'float', 'min': 0, 'max': 100},
        'exam_type': {'type': 'category', 'values': EXAM_TYPES},
        'exam_date': {'type': 'date'},
        'term': {'type': 'category', 'values': ['first_term', 'second_term']},
        'board_score': {'type': 'float', 'min': 0, 'max': 100, 'allow_null': True}
    }
    
    errors = []
    for col, rules in validation_rules.items():
        # Check required fields
        if rules.get('required', False):
            if df[col].isnull().any():
                errors.append(f"Column {col} contains null values")
        
        # Type validation
        if rules['type'] == 'int':
            if not pd.to_numeric(df[col], errors='coerce').dtype.kind in ['i', 'u']:
                errors.append(f"Column {col} must contain integers")
            if 'min' in rules and df[col].min() < rules['min']:
                errors.append(f"Column {col} contains values below {rules['min']}")
            if 'max' in rules and df[col].max() > rules['max']:
                errors.append(f"Column {col} contains values above {rules['max']}")
        
        elif rules['type'] == 'float':
            if not pd.to_numeric(df[col], errors='coerce').dtype.kind == 'f':
                errors.append(f"Column {col} must contain numeric values")
            if not rules.get('allow_null', False):
                if df[col].isnull().any():
                    errors.append(f"Column {col} contains null values")
            if 'min' in rules and df[col].min() < rules['min']:
                errors.append(f"Column {col} contains values below {rules['min']}")
            if 'max' in rules and df[col].max() > rules['max']:
                errors.append(f"Column {col} contains values above {rules['max']}")
        
        elif rules['type'] == 'category':
            invalid_values = df[col][~df[col].isin(rules['values'])].unique()
            if len(invalid_values) > 0:
                errors.append(f"Column {col} contains invalid values: {invalid_values}")
        
        elif rules['type'] == 'date':
            try:
                pd.to_datetime(df[col])
            except:
                errors.append(f"Column {col} contains invalid dates")
    
    if errors:
        raise ValueError("Data validation failed:\n" + "\n".join(errors))
    
    logger.info("Data validation successful!")
    return True

def process_real_data(input_file, output_file):
    """Process and validate real CBSE data"""
    logger.info(f"Processing data from {input_file}")
    
    # Load data
    if input_file.endswith('.csv'):
        df = pd.read_csv(input_file)
    elif input_file.endswith('.xlsx'):
        df = pd.read_excel(input_file)
    else:
        raise ValueError("Unsupported file format. Use CSV or Excel.")
    
    # Clean column names
    df.columns = df.columns.str.strip().str.lower()
    
    # Basic data cleaning
    df = df.dropna(subset=['student_id', 'subject', 'score'])
    df['score'] = pd.to_numeric(df['score'], errors='coerce')
    df['max_score'] = pd.to_numeric(df['max_score'], errors='coerce')
    df['board_score'] = pd.to_numeric(df['board_score'], errors='coerce')
    
    # Validate data
    validate_data(df)
    
    # Save processed data
    df.to_csv(output_file, index=False)
    logger.info(f"Processed data saved to {output_file}")
    
    # Generate summary
    summary = {
        'total_records': len(df),
        'unique_students': df['student_id'].nunique(),
        'subjects_covered': df['subject'].unique().tolist(),
        'exam_types': df['exam_type'].unique().tolist(),
        'date_range': [df['exam_date'].min(), df['exam_date'].max()],
        'average_scores': df.groupby('subject')['score'].mean().to_dict(),
        'processed_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    summary_file = output_file.replace('.csv', '_summary.json')
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2)
    
    return summary

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Process and validate real CBSE data')
    parser.add_argument('input_file', help='Path to input CSV/Excel file')
    parser.add_argument('output_file', help='Path to output CSV file')
    
    args = parser.parse_args()
    summary = process_real_data(args.input_file, args.output_file)
    print("\nData Processing Summary:")
    print(json.dumps(summary, indent=2))