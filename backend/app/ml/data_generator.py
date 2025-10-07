import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from app.core.config import settings

class CBSEDataGenerator:
    """Generate realistic CBSE academic data for training"""
    
    def __init__(self):
        self.subjects = settings.CBSE_SUBJECTS
        self.classes = settings.CBSE_CLASSES
        
        # CBSE-specific parameters
        self.subject_difficulty = {
            "Mathematics": 0.75,
            "Physics": 0.80,
            "Chemistry": 0.78,
            "Biology": 0.72,
            "English": 0.85,
            "Hindi": 0.88,
            "Computer Science": 0.82,
            "Physical Education": 0.95,
            "Economics": 0.80,
            "Business Studies": 0.83,
            "Accountancy": 0.77,
            "Political Science": 0.85,
            "History": 0.87,
            "Geography": 0.84
        }
        
        # Performance correlation between subjects
        self.subject_correlations = {
            ("Mathematics", "Physics"): 0.8,
            ("Physics", "Chemistry"): 0.7,
            ("Chemistry", "Biology"): 0.6,
            ("Mathematics", "Computer Science"): 0.75,
            ("English", "Hindi"): 0.4,
            ("Economics", "Business Studies"): 0.85,
            ("Business Studies", "Accountancy"): 0.9,
            ("History", "Political Science"): 0.7,
            ("Geography", "History"): 0.6
        }
    
    def generate_student_profile(self, student_id: int) -> Dict:
        """Generate a realistic student profile"""
        current_class = random.choice(self.classes)
        
        # Generate realistic academic year
        current_year = datetime.now().year
        if datetime.now().month >= 4:  # Academic year starts in April
            academic_year = f"{current_year}-{current_year + 1}"
        else:
            academic_year = f"{current_year - 1}-{current_year}"
        
        # Generate school code (realistic CBSE format)
        school_types = ["10", "20", "30"]  # Government, Private, International
        school_code = random.choice(school_types) + str(random.randint(1000, 9999))
        
        return {
            "id": student_id,
            "current_class": current_class,
            "gender": random.choice(["male", "female", "other"]),
            "school_code": school_code,
            "academic_year": academic_year,
            "cbse_board_code": f"CBSE{random.randint(100, 999)}",
            "school_name": f"Sample School {student_id}",
            "name": f"Student {student_id}"
        }
    
    def generate_academic_records(self, student_profile: Dict, years_of_data: int = 2) -> List[Dict]:
        """Generate realistic academic records for a student"""
        records = []
        current_class = student_profile["current_class"]
        
        # Determine student's base ability (affects all subjects)
        base_ability = np.random.normal(75, 15)  # Mean 75%, std 15%
        base_ability = np.clip(base_ability, 30, 95)
        
        # Generate subject-specific abilities
        subject_abilities = {}
        for subject in self.subjects:
            # Add some randomness to base ability for each subject
            subject_variation = np.random.normal(0, 8)
            difficulty_factor = self.subject_difficulty.get(subject, 0.8)
            
            subject_ability = base_ability + subject_variation
            subject_ability *= difficulty_factor  # Apply subject difficulty
            subject_ability = np.clip(subject_ability, 20, 98)
            
            subject_abilities[subject] = subject_ability
        
        # Apply subject correlations
        self._apply_subject_correlations(subject_abilities)
        
        # Generate records for each year
        for year_offset in range(years_of_data):
            class_for_year = max(9, current_class - (years_of_data - 1 - year_offset))
            
            # Skip if class is too low
            if class_for_year < 9:
                continue
            
            year_records = self._generate_year_records(
                student_profile, subject_abilities, class_for_year, year_offset
            )
            records.extend(year_records)
        
        return records
    
    def _apply_subject_correlations(self, subject_abilities: Dict[str, float]):
        """Apply correlations between subjects"""
        for (subject1, subject2), correlation in self.subject_correlations.items():
            if subject1 in subject_abilities and subject2 in subject_abilities:
                # Adjust subject2 based on subject1 with given correlation
                mean_ability = (subject_abilities[subject1] + subject_abilities[subject2]) / 2
                
                # Apply correlation
                adjustment = (subject_abilities[subject1] - mean_ability) * correlation
                subject_abilities[subject2] = mean_ability + adjustment
                subject_abilities[subject2] = np.clip(subject_abilities[subject2], 20, 98)
    
    def _generate_year_records(self, student_profile: Dict, subject_abilities: Dict, 
                              class_year: int, year_offset: int) -> List[Dict]:
        """Generate academic records for one academic year"""
        records = []
        
        # Determine subjects for this class
        class_subjects = self._get_subjects_for_class(class_year)
        
        # Generate exam schedule
        base_date = datetime.now() - timedelta(days=365 * year_offset)
        
        exam_schedule = [
            ("unit_test", base_date + timedelta(days=30), "first_term"),
            ("mid_term", base_date + timedelta(days=90), "first_term"),
            ("unit_test", base_date + timedelta(days=150), "second_term"),
            ("final", base_date + timedelta(days=210), "second_term"),
        ]
        
        # Add board exams for classes 10 and 12
        if class_year in [10, 12]:
            exam_schedule.append(("board", base_date + timedelta(days=270), "second_term"))
        
        # Generate records for each exam and subject
        for exam_type, exam_date, term in exam_schedule:
            for subject in class_subjects:
                if subject in subject_abilities:
                    score = self._generate_exam_score(
                        subject_abilities[subject], exam_type, class_year, term
                    )
                    
                    record = {
                        "subject": subject,
                        "score": score,
                        "max_score": 100.0,
                        "exam_type": exam_type,
                        "exam_date": exam_date.date().isoformat(),
                        "academic_year": student_profile["academic_year"],
                        "term": term
                    }
                    records.append(record)
        
        return records
    
    def _get_subjects_for_class(self, class_year: int) -> List[str]:
        """Get subjects typically taken in each class"""
        base_subjects = ["Mathematics", "English", "Hindi", "Physical Education"]
        
        if class_year in [9, 10]:
            # Classes 9-10: Basic subjects
            return base_subjects + ["Science", "Social Science"]
        
        elif class_year in [11, 12]:
            # Classes 11-12: Stream-based subjects
            stream = random.choice(["science", "commerce", "humanities"])
            
            if stream == "science":
                return base_subjects + ["Physics", "Chemistry", "Biology", "Computer Science"]
            elif stream == "commerce":
                return base_subjects + ["Economics", "Business Studies", "Accountancy"]
            else:  # humanities
                return base_subjects + ["History", "Political Science", "Geography", "Economics"]
        
        return base_subjects
    
    def _generate_exam_score(self, base_ability: float, exam_type: str, 
                           class_year: int, term: str) -> float:
        """Generate realistic exam score based on various factors"""
        
        # Base score from ability
        score = base_ability
        
        # Exam type difficulty adjustments
        exam_difficulty = {
            "unit_test": 1.05,      # Slightly easier
            "mid_term": 1.0,        # Standard
            "final": 0.95,          # Slightly harder
            "board": 0.90,          # Hardest
            "pre_board": 0.92       # Practice for board
        }
        
        score *= exam_difficulty.get(exam_type, 1.0)
        
        # Class difficulty (higher classes are harder)
        class_difficulty = {9: 1.1, 10: 1.0, 11: 0.95, 12: 0.9}
        score *= class_difficulty.get(class_year, 1.0)
        
        # Term effects (second term often harder due to cumulative content)
        if term == "second_term":
            score *= 0.98
        
        # Add some randomness for exam day performance
        performance_variation = np.random.normal(0, 5)  # ±5% variation
        score += performance_variation
        
        # Ensure realistic score bounds
        score = np.clip(score, 15, 98)
        
        return round(score, 1)
    
    def generate_board_exam_targets(self, academic_records: List[Dict], 
                                  student_profile: Dict) -> Dict[str, float]:
        """Generate realistic board exam target scores"""
        targets = {}
        
        # Get the student's historical performance
        subject_performance = {}
        for record in academic_records:
            subject = record["subject"]
            percentage = (record["score"] / record["max_score"]) * 100
            
            if subject not in subject_performance:
                subject_performance[subject] = []
            subject_performance[subject].append(percentage)
        
        # Calculate board exam predictions based on historical performance
        for subject, scores in subject_performance.items():
            if len(scores) >= 2:  # Need some history
                # Use weighted average (recent scores matter more)
                weights = np.linspace(0.5, 1.0, len(scores))
                weighted_avg = np.average(scores, weights=weights)
                
                # Board exams are typically slightly lower than internal exams
                board_score = weighted_avg * 0.95
                
                # Add some realistic variation
                variation = np.random.normal(0, 3)
                board_score += variation
                
                # Ensure realistic bounds
                board_score = np.clip(board_score, 25, 95)
                targets[subject] = round(board_score, 1)
        
        return targets

def generate_historical_data(num_students: int = 1000, years_of_data: int = 3, 
                           db_session=None) -> List[Tuple]:
    """Generate comprehensive historical academic data"""
    generator = CBSEDataGenerator()
    historical_data = []
    
    print(f"Generating data for {num_students} students over {years_of_data} years...")
    
    for student_id in range(1, num_students + 1):
        if student_id % 500 == 0:
            print(f"Generated data for {student_id} students...")
        
        # Generate student profile
        student_profile = generator.generate_student_profile(student_id)
        
        # Generate academic records
        academic_records = generator.generate_academic_records(
            student_profile, years_of_data
        )
        
        # Generate board exam targets
        board_targets = generator.generate_board_exam_targets(
            academic_records, student_profile
        )
        
        # Only include students with board exam targets
        if board_targets:
            historical_data.append((student_profile, academic_records, board_targets))
    
    print(f"Generated complete dataset: {len(historical_data)} students")
    return historical_data

def create_sample_dataset(output_file: str = "sample_cbse_data.csv"):
    """Create a sample dataset and save to CSV for inspection"""
    data = generate_historical_data(100, 2, None)
    
    # Convert to DataFrame for easy inspection
    rows = []
    for student_profile, academic_records, board_targets in data:
        for record in academic_records:
            row = {
                "student_id": student_profile["id"],
                "current_class": student_profile["current_class"],
                "gender": student_profile["gender"],
                "school_code": student_profile["school_code"],
                "subject": record["subject"],
                "score": record["score"],
                "exam_type": record["exam_type"],
                "exam_date": record["exam_date"],
                "term": record["term"],
                "board_target": board_targets.get(record["subject"], None)
            }
            rows.append(row)
    
    df = pd.DataFrame(rows)
    df.to_csv(output_file, index=False)
    print(f"Sample dataset saved to {output_file}")
    
    # Print some statistics
    print(f"\nDataset Statistics:")
    print(f"Total records: {len(df)}")
    print(f"Unique students: {df['student_id'].nunique()}")
    print(f"Subjects: {df['subject'].unique()}")
    print(f"Exam types: {df['exam_type'].unique()}")
    print(f"Average score: {df['score'].mean():.2f}")
    print(f"Score distribution:")
    print(df['score'].describe())

if __name__ == "__main__":
    # Generate sample dataset for inspection
    create_sample_dataset()
def generate_sample_data_for_testing() -> Dict:
    """Generate sample data for testing purposes"""
    generator = CBSEDataGenerator()
    
    # Generate a single student profile
    student_profile = generator.generate_student_profile(1)
    
    # Generate academic records for this student
    academic_records = generator.generate_academic_records(student_profile, years_of_data=1)
    
    return {
        "student_profile": student_profile,
        "academic_records": academic_records
    }

def generate_training_data(num_students: int = 1000, years_of_data: int = 3) -> List[Tuple]:
    """Generate historical academic data for training (simplified version)"""
    generator = CBSEDataGenerator()
    training_data = []
    
    print(f"Generating {num_students} student records with {years_of_data} years of data...")
    
    for i in range(num_students):
        if i % 100 == 0:
            print(f"Generated {i}/{num_students} students...")
        
        # Generate student profile
        student_profile = generator.generate_student_profile(i + 1)
        
        # Generate academic records
        academic_records = generator.generate_academic_records(student_profile, years_of_data)
        
        # Generate board exam scores (target)
        board_scores = generator.generate_board_exam_targets(academic_records, student_profile)
        
        # Only include students with board scores
        if board_scores:
            training_data.append((student_profile, academic_records, board_scores))
    
    print(f"Generated {len(training_data)} complete student records")
    return training_data