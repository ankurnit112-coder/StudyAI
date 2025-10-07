#!/usr/bin/env python3
"""
Generate more realistic CBSE student data for enhanced training
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_student_data(n_students=100):
    """Generate realistic CBSE student data"""
    subjects = [
        'Mathematics', 'Physics', 'Chemistry', 'Biology',
        'Computer Science', 'English', 'Hindi'
    ]
    
    exam_types = ['unit_test', 'mid_term', 'pre_board', 'final']
    terms = ['first_term', 'second_term']
    classes = [11, 12]
    genders = ['male', 'female']
    
    # Base dates for academic year
    base_dates = {
        'unit_test': '2024-06-10',
        'mid_term': '2024-07-15',
        'pre_board': '2024-08-20',
        'final': '2024-09-15'
    }
    
    data = []
    
    for i in range(n_students):
        student_id = f'STU{str(i+1).zfill(3)}'
        current_class = random.choice(classes)
        gender = random.choice(genders)
        
        # Each student takes 3-5 subjects
        student_subjects = random.sample(subjects, random.randint(3, 5))
        
        for subject in student_subjects:
            # Generate progression of scores
            base_score = random.randint(65, 95)  # Initial capability
            improvement = random.randint(0, 10)  # Potential improvement
            
            for exam_type in exam_types:
                for term in terms:
                    # Add some random variation to scores
                    score_variation = random.randint(-5, 5)
                    score = min(100, max(0, base_score + score_variation))
                    
                    # Improve scores over time
                    if exam_type in ['pre_board', 'final']:
                        score = min(100, score + improvement)
                    
                    data.append({
                        'student_id': student_id,
                        'current_class': current_class,
                        'gender': gender,
                        'subject': subject,
                        'score': score,
                        'max_score': 100,
                        'exam_type': exam_type,
                        'exam_date': base_dates[exam_type],
                        'term': term,
                        'board_score': min(100, score + random.randint(0, 5))
                    })
    
    df = pd.DataFrame(data)
    return df

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Generate realistic CBSE student data')
    parser.add_argument('--students', type=int, default=100, help='Number of students to generate')
    parser.add_argument('--output', default='expanded_student_records.csv', help='Output CSV file')
    
    args = parser.parse_args()
    
    df = generate_student_data(args.students)
    df.to_csv(args.output, index=False)
    print(f"Generated data for {args.students} students and saved to {args.output}")