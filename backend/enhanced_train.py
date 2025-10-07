#!/usr/bin/env python3
"""
Enhanced training script with real data support and hyperparameter optimization
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ml.data_generator import generate_training_data
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge, ElasticNet
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.feature_selection import SelectKBest, f_regression
import joblib
import logging
import json
from datetime import datetime, timedelta
import argparse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EnhancedCBSETrainer:
    """Enhanced trainer with real data support and hyperparameter optimization"""
    
    def __init__(self, use_real_data=False, real_data_path=None, optimize_hyperparams=True):
        self.use_real_data = use_real_data
        self.real_data_path = real_data_path
        self.optimize_hyperparams = optimize_hyperparams
        self.models = {}
        self.scalers = {}
        self.feature_selectors = {}
        self.training_history = []
        self.test_data = {}
        self.hyperparameter_configs = {
            'random_forest': {
                'n_estimators': [100, 200],
                'max_depth': [10, 20, None],
                'min_samples_split': [2, 5]
            },
            'gradient_boosting': {
                'n_estimators': [100, 200],
                'learning_rate': [0.01, 0.1],
                'max_depth': [3, 5]
            },
            'ridge': {
                'alpha': [0.1, 1.0, 10.0]
            }
        }
        
    def load_real_data(self, data_path):
        """Load real student data from CSV or database"""
        logger.info(f"Loading real data from {data_path}")
        
        if data_path.endswith('.csv'):
            df = pd.read_csv(data_path)
            return self._process_csv_data(df)
        elif data_path.endswith('.json'):
            with open(data_path, 'r') as f:
                data = json.load(f)
            return self._process_json_data(data)
        else:
            raise ValueError("Unsupported data format. Use CSV or JSON.")
    
    def _process_csv_data(self, df):
        """Process CSV data into training format"""
        logger.info("Processing CSV data...")
        
        # Expected CSV format:
        # student_id, current_class, gender, subject, score, max_score, exam_type, exam_date, term, board_score
        
        training_data = []
        student_groups = df.groupby('student_id')
        
        for student_id, student_df in student_groups:
            # Extract student profile
            first_row = student_df.iloc[0]
            student_profile = {
                'id': student_id,
                'current_class': first_row.get('current_class', 12),
                'gender': first_row.get('gender', 'other'),
                'school_code': first_row.get('school_code', 'UNKNOWN'),
                'academic_year': first_row.get('academic_year', '2024-25')
            }
            
            # Extract academic records
            academic_records = []
            for _, row in student_df.iterrows():
                if pd.notna(row.get('score')):
                    record = {
                        'subject': row['subject'],
                        'score': float(row['score']),
                        'max_score': float(row.get('max_score', 100)),
                        'exam_type': row.get('exam_type', 'final'),
                        'exam_date': row.get('exam_date', '2024-01-01'),
                        'term': row.get('term', 'second_term')
                    }
                    academic_records.append(record)
            
            # Extract board scores (targets)
            board_scores = {}
            for _, row in student_df.iterrows():
                if pd.notna(row.get('board_score')):
                    board_scores[row['subject']] = float(row['board_score'])
            
            if academic_records and board_scores:
                training_data.append((student_profile, academic_records, board_scores))
        
        logger.info(f"Processed {len(training_data)} students from CSV")
        return training_data
        
    def _prepare_data(self, data):
        """Prepare data for training"""
        # Organize data by subject
        subjects = {}
        for student, records, board_scores in data:
            for subject, board_score in board_scores.items():
                if subject not in subjects:
                    subjects[subject] = {'features': [], 'targets': []}
                
                # Extract subject-specific records
                subject_records = [r for r in records if r['subject'] == subject]
                
                if not subject_records:
                    continue
                
                # Calculate features
                features = self._extract_features(student, subject_records, records)
                
                subjects[subject]['features'].append(features)
                subjects[subject]['targets'].append(board_score)
        
        # Split into train/test sets
        X_train = {}
        X_test = {}
        y_train = {}
        y_test = {}
        
        for subject, data in subjects.items():
            if len(data['targets']) < 10:  # Skip subjects with too few samples
                logger.warning(f"Skipping {subject}: insufficient data ({len(data['targets'])} samples)")
                continue
                
            X = np.array(data['features'])
            y = np.array(data['targets'])
            
            # Split data
            X_train[subject], X_test[subject], y_train[subject], y_test[subject] = \
                train_test_split(X, y, test_size=0.2, random_state=42)
        
        return X_train, X_test, y_train, y_test
        
    def _extract_features(self, student, subject_records, all_records):
        """Extract features from student records"""
        features = []
        
        # Basic statistics for the subject
        scores = [r['score'] / r['max_score'] * 100 for r in subject_records]
        features.extend([
            np.mean(scores) if scores else 0,  # Average score
            np.std(scores) if len(scores) > 1 else 0,  # Score consistency
            max(scores) if scores else 0,  # Best performance
            min(scores) if scores else 0   # Worst performance
        ])
        
        # Performance trend
        if len(scores) >= 2:
            trend = np.polyfit(range(len(scores)), scores, 1)[0]
        else:
            trend = 0
        features.append(trend)
        
        # Exam type performance
        exam_types = ['unit_test', 'mid_term', 'pre_board', 'final']
        for exam_type in exam_types:
            type_scores = [r['score'] / r['max_score'] * 100 
                        for r in subject_records if r['exam_type'] == exam_type]
            features.append(np.mean(type_scores) if type_scores else 0)
        
        # Term performance
        terms = ['first_term', 'second_term']
        term_scores = []
        for term in terms:
            term_records = [r['score'] / r['max_score'] * 100 
                        for r in subject_records if r['term'] == term]
            term_scores.append(np.mean(term_records) if term_records else 0)
        features.extend(term_scores)
        
        # Performance in other subjects
        other_subjects = set(r['subject'] for r in all_records) - {subject_records[0]['subject']}
        for other_subject in sorted(other_subjects):
            other_scores = [r['score'] / r['max_score'] * 100 
                        for r in all_records if r['subject'] == other_subject]
            features.append(np.mean(other_scores) if other_scores else 0)
        
        # Student profile features
        features.append(float(student['current_class']))
        
        # Convert gender to one-hot encoding
        gender_map = {'male': [1,0,0], 'female': [0,1,0], 'other': [0,0,1]}
        features.extend(gender_map.get(student['gender'].lower(), [0,0,1]))
        
        return features
    
    def _process_json_data(self, data):
        """Process JSON data into training format"""
        logger.info("Processing JSON data...")
        training_data = []
        for student in data:
            if 'profile' in student and 'records' in student and 'board_scores' in student:
                training_data.append((
                    student['profile'],
                    student['records'],
                    student['board_scores']
                ))
        return training_data
        
    def train(self):
        """Train models using real or synthetic data"""
        if self.use_real_data:
            logger.info("Loading real training data...")
            training_data = self.load_real_data(self.real_data_path)
        else:
            logger.info("Generating synthetic training data...")
            from app.ml.data_generator import generate_training_data
            training_data = generate_training_data(n_samples=1500)
            
        # Process and prepare data
        X_train, X_test, y_train, y_test = self._prepare_data(training_data)
        self.training_metadata = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'real_data': self.use_real_data,
            'data_path': self.real_data_path if self.use_real_data else None,
            'n_samples': len(training_data),
        }
        
        # Train models for each subject
        for subject in X_train.keys():
            logger.info(f"Training model for {subject}...")
            
            # Scale features
            scaler = RobustScaler()
            X_train_scaled = scaler.fit_transform(X_train[subject])
            X_test_scaled = scaler.transform(X_test[subject])
            self.scalers[subject] = scaler
            
            # Feature selection
            selector = SelectKBest(f_regression, k=25)
            X_train_selected = selector.fit_transform(X_train_scaled, y_train[subject])
            X_test_selected = selector.transform(X_test_scaled)
            self.feature_selectors[subject] = selector
            
            # Initialize models
            models = {
                'random_forest': RandomForestRegressor(),
                'gradient_boosting': GradientBoostingRegressor(),
                'ridge': Ridge()
            }
            
            # Train and evaluate each model
            best_score = float('-inf')
            best_model = None
            
            for model_name, model in models.items():
                if self.optimize_hyperparams:
                    logger.info(f"Optimizing {model_name} hyperparameters...")
                    cv = GridSearchCV(model, self.hyperparameter_configs[model_name], cv=3)
                    cv.fit(X_train_selected, y_train[subject])
                    model = cv.best_estimator_
                else:
                    model.fit(X_train_selected, y_train[subject])
                
                # Evaluate model
                cv_scores = cross_val_score(model, X_train_selected, y_train[subject], cv=3)
                avg_score = cv_scores.mean()
                
                if avg_score > best_score:
                    best_score = avg_score
                    best_model = model
            
            self.models[subject] = best_model
            
            # Save validation data
            self.test_data[subject] = {
                'X': X_test_selected,
                'y': y_test[subject]
            }
        logger.info("Processing JSON data...")
        
        # Expected JSON format: list of student objects
        training_data = []
        
        for student_data in data:
            student_profile = student_data.get('profile', {})
            academic_records = student_data.get('academic_records', [])
            board_scores = student_data.get('board_scores', {})
            
            if academic_records and board_scores:
                training_data.append((student_profile, academic_records, board_scores))
        
        logger.info(f"Processed {len(training_data)} students from JSON")
        return training_data
    
    def extract_enhanced_features(self, student_profile, academic_records):
        """Extract enhanced features with more sophisticated engineering"""
        features = []
        
        # Basic student features
        features.append(student_profile.get("current_class", 12))
        features.append(1 if student_profile.get("gender") == "male" else 0)
        
        if not academic_records:
            features.extend([0] * 35)  # 35 enhanced features
            return np.array(features)
        
        # Calculate comprehensive statistics
        subject_scores = {}
        exam_type_scores = {}
        term_scores = {}
        temporal_scores = []
        
        for record in academic_records:
            subject = record["subject"]
            exam_type = record["exam_type"]
            term = record.get("term", "second_term")
            percentage = (record["score"] / record["max_score"]) * 100
            
            # Group by subject
            if subject not in subject_scores:
                subject_scores[subject] = []
            subject_scores[subject].append(percentage)
            
            # Group by exam type
            if exam_type not in exam_type_scores:
                exam_type_scores[exam_type] = []
            exam_type_scores[exam_type].append(percentage)
            
            # Group by term
            if term not in term_scores:
                term_scores[term] = []
            term_scores[term].append(percentage)
            
            # Temporal progression
            temporal_scores.append((record.get("exam_date", "2024-01-01"), percentage))
        
        # Subject-wise features (top 8 subjects)
        main_subjects = ["Mathematics", "Physics", "Chemistry", "Biology", 
                        "English", "Hindi", "Computer Science", "Economics"]
        
        for subject in main_subjects:
            if subject in subject_scores:
                scores = subject_scores[subject]
                features.append(np.mean(scores))  # Average
                features.append(np.std(scores) if len(scores) > 1 else 0)  # Consistency
            else:
                features.extend([0, 0])
        
        # Exam type features
        exam_types = ["unit_test", "mid_term", "final", "pre_board", "board"]
        for exam_type in exam_types:
            if exam_type in exam_type_scores:
                features.append(np.mean(exam_type_scores[exam_type]))
            else:
                features.append(0)
        
        # Term comparison
        first_term_avg = np.mean(term_scores.get("first_term", [0]))
        second_term_avg = np.mean(term_scores.get("second_term", [0]))
        features.append(first_term_avg)
        features.append(second_term_avg)
        features.append(second_term_avg - first_term_avg)  # Term improvement
        
        # Overall performance metrics
        all_scores = [r["score"] / r["max_score"] * 100 for r in academic_records]
        features.append(np.mean(all_scores))  # Overall average
        features.append(np.median(all_scores))  # Median score
        features.append(np.std(all_scores))   # Score consistency
        features.append(np.min(all_scores))   # Worst performance
        features.append(np.max(all_scores))   # Best performance
        features.append(len(academic_records))  # Number of exams
        
        # Performance trends
        if len(all_scores) >= 6:
            # Split into thirds for trend analysis
            third = len(all_scores) // 3
            early_avg = np.mean(all_scores[:third])
            middle_avg = np.mean(all_scores[third:2*third])
            late_avg = np.mean(all_scores[2*third:])
            
            features.append(early_avg)
            features.append(middle_avg)
            features.append(late_avg)
            features.append(late_avg - early_avg)  # Overall improvement
        else:
            features.extend([0, 0, 0, 0])
        
        # Subject diversity and specialization
        features.append(len(subject_scores))  # Number of subjects
        
        # Calculate subject strength (best 3 subjects average)
        if subject_scores:
            subject_averages = [np.mean(scores) for scores in subject_scores.values()]
            subject_averages.sort(reverse=True)
            top_3_avg = np.mean(subject_averages[:3]) if len(subject_averages) >= 3 else np.mean(subject_averages)
            features.append(top_3_avg)
        else:
            features.append(0)
        
        return np.array(features)
    
    def optimize_hyperparameters(self, X_train, y_train, model_type='random_forest'):
        """Optimize hyperparameters using GridSearchCV"""
        logger.info(f"Optimizing hyperparameters for {model_type}...")
        
        if model_type == 'random_forest':
            model = RandomForestRegressor(random_state=42)
            param_grid = {
                'n_estimators': [50, 100, 200],
                'max_depth': [5, 10, 15, None],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4]
            }
        elif model_type == 'gradient_boosting':
            model = GradientBoostingRegressor(random_state=42)
            param_grid = {
                'n_estimators': [50, 100, 200],
                'max_depth': [3, 5, 7],
                'learning_rate': [0.01, 0.1, 0.2],
                'subsample': [0.8, 0.9, 1.0]
            }
        elif model_type == 'ridge':
            model = Ridge(random_state=42)
            param_grid = {
                'alpha': [0.1, 1.0, 10.0, 100.0]
            }
        else:
            # Default to Random Forest
            model = RandomForestRegressor(random_state=42)
            param_grid = {
                'n_estimators': [100],
                'max_depth': [10],
                'min_samples_split': [5]
            }
        
        # Use 3-fold CV for speed
        grid_search = GridSearchCV(
            model, param_grid, cv=3, scoring='neg_mean_absolute_error',
            n_jobs=-1, verbose=0
        )
        
        grid_search.fit(X_train, y_train)
        
        logger.info(f"Best parameters for {model_type}: {grid_search.best_params_}")
        logger.info(f"Best CV score: {-grid_search.best_score_:.3f}")
        
        return grid_search.best_estimator_
    
    def train_models(self):
        """Train models with enhanced features and optimization"""
        logger.info("Starting enhanced model training...")
        
        # Load data
        if self.use_real_data and self.real_data_path:
            training_data = self.load_real_data(self.real_data_path)
        else:
            logger.info("Using synthetic data...")
            training_data = generate_training_data(num_students=1500, years_of_data=3)
        
        if not training_data:
            logger.error("No training data available!")
            return
        
        logger.info(f"Processing data for {len(training_data)} students")
        
        # Extract features and targets
        X_list = []
        y_dict = {}
        
        for student_profile, academic_records, board_scores in training_data:
            if not board_scores:
                continue
                
            try:
                features = self.extract_enhanced_features(student_profile, academic_records)
                X_list.append(features)
                
                for subject, score in board_scores.items():
                    if subject not in y_dict:
                        y_dict[subject] = []
                    y_dict[subject].append(score)
            
            except Exception as e:
                logger.warning(f"Error processing student: {str(e)}")
                continue
        
        if not X_list:
            logger.error("No valid training samples!")
            return
        
        # Convert to arrays
        X = np.array(X_list)
        min_samples = min(len(scores) for scores in y_dict.values())
        X = X[:min_samples]
        
        for subject in y_dict:
            y_dict[subject] = np.array(y_dict[subject][:min_samples])
        
        logger.info(f"Training data shape: {X.shape}")
        logger.info(f"Subjects: {list(y_dict.keys())}")
        
        # Train models for each subject
        results = {}
        
        for subject, y in y_dict.items():
            logger.info(f"\n=== Training {subject} ===")
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Feature scaling
            scaler = RobustScaler()  # More robust to outliers
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Feature selection
            selector = SelectKBest(f_regression, k=min(25, X_train_scaled.shape[1]))
            X_train_selected = selector.fit_transform(X_train_scaled, y_train)
            X_test_selected = selector.transform(X_test_scaled)
            
            # Model training with optimization
            if self.optimize_hyperparams:
                # Try multiple model types and select the best
                model_types = ['random_forest', 'gradient_boosting', 'ridge']
                best_model = None
                best_score = float('inf')
                best_type = None
                
                for model_type in model_types:
                    try:
                        model = self.optimize_hyperparameters(X_train_selected, y_train, model_type)
                        
                        # Evaluate with cross-validation
                        cv_scores = cross_val_score(
                            model, X_train_selected, y_train, 
                            cv=3, scoring='neg_mean_absolute_error'
                        )
                        avg_score = -cv_scores.mean()
                        
                        logger.info(f"{model_type} CV MAE: {avg_score:.3f}")
                        
                        if avg_score < best_score:
                            best_score = avg_score
                            best_model = model
                            best_type = model_type
                    
                    except Exception as e:
                        logger.warning(f"Error training {model_type}: {str(e)}")
                        continue
                
                if best_model is None:
                    logger.warning(f"All models failed for {subject}, using default")
                    best_model = RandomForestRegressor(n_estimators=100, random_state=42)
                    best_model.fit(X_train_selected, y_train)
                    best_type = "random_forest_default"
                
                logger.info(f"Best model for {subject}: {best_type}")
                
            else:
                # Use default Random Forest
                best_model = RandomForestRegressor(
                    n_estimators=100, max_depth=10, min_samples_split=5,
                    min_samples_leaf=2, random_state=42
                )
                best_model.fit(X_train_selected, y_train)
                best_type = "random_forest_default"
            
            # Final evaluation
            y_pred = best_model.predict(X_test_selected)
            
            mae = mean_absolute_error(y_test, y_pred)
            rmse = np.sqrt(mean_squared_error(y_test, y_pred))
            r2 = r2_score(y_test, y_pred)
            
            # Store results
            self.models[subject] = best_model
            self.scalers[subject] = scaler
            self.feature_selectors[subject] = selector
            
            results[subject] = {
                'mae': mae,
                'rmse': rmse,
                'r2': r2,
                'model_type': best_type,
                'n_features': X_train_selected.shape[1],
                'n_samples': len(y_train)
            }
            
            logger.info(f"{subject}: MAE={mae:.2f}, RMSE={rmse:.2f}, R²={r2:.3f}")
        
        # Save models and results
        self.save_models(results)
        
        # Print summary
        self.print_training_summary(results)
        
        return results
    
    def save_models(self, results):
        """Save all models and metadata"""
        os.makedirs("models", exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save individual models
        for subject in self.models:
            subject_clean = subject.lower().replace(' ', '_')
            
            # Save model
            model_path = f"models/{subject_clean}_enhanced_model.joblib"
            joblib.dump(self.models[subject], model_path)
            
            # Save scaler
            scaler_path = f"models/{subject_clean}_scaler.joblib"
            joblib.dump(self.scalers[subject], scaler_path)
            
            # Save feature selector
            selector_path = f"models/{subject_clean}_selector.joblib"
            joblib.dump(self.feature_selectors[subject], selector_path)
        
        # Save training metadata
        metadata = {
            'timestamp': timestamp,
            'use_real_data': self.use_real_data,
            'optimize_hyperparams': self.optimize_hyperparams,
            'results': results,
            'feature_names': self.get_feature_names(),
            'subjects': list(self.models.keys())
        }
        
        metadata_path = f"models/training_metadata_{timestamp}.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2, default=str)
        
        # Save latest metadata
        with open("models/latest_training.json", 'w') as f:
            json.dump(metadata, f, indent=2, default=str)
        
        logger.info(f"Models saved with timestamp: {timestamp}")
    
    def get_feature_names(self):
        """Get feature names for reference"""
        return [
            "current_class", "gender_male",
            # Subject averages and consistency (8 subjects × 2)
            "math_avg", "math_std", "physics_avg", "physics_std",
            "chemistry_avg", "chemistry_std", "biology_avg", "biology_std",
            "english_avg", "english_std", "hindi_avg", "hindi_std",
            "cs_avg", "cs_std", "economics_avg", "economics_std",
            # Exam type averages (5 types)
            "unit_test_avg", "mid_term_avg", "final_avg", "pre_board_avg", "board_avg",
            # Term comparison (3 features)
            "first_term_avg", "second_term_avg", "term_improvement",
            # Overall performance (6 features)
            "overall_avg", "overall_median", "overall_std", "min_score", "max_score", "num_exams",
            # Trend analysis (4 features)
            "early_avg", "middle_avg", "late_avg", "overall_improvement",
            # Specialization (2 features)
            "num_subjects", "top_3_avg"
        ]
    
    def print_training_summary(self, results):
        """Print comprehensive training summary"""
        logger.info("\n" + "="*60)
        logger.info("ENHANCED TRAINING SUMMARY")
        logger.info("="*60)
        
        # Overall statistics
        avg_mae = np.mean([r['mae'] for r in results.values()])
        avg_rmse = np.mean([r['rmse'] for r in results.values()])
        avg_r2 = np.mean([r['r2'] for r in results.values()])
        
        logger.info(f"Overall Performance:")
        logger.info(f"  Average MAE: {avg_mae:.2f}")
        logger.info(f"  Average RMSE: {avg_rmse:.2f}")
        logger.info(f"  Average R²: {avg_r2:.3f}")
        logger.info(f"  Models trained: {len(results)}")
        
        # Best and worst performing subjects
        sorted_subjects = sorted(results.items(), key=lambda x: x[1]['mae'])
        
        logger.info(f"\nBest Performing Subjects (by MAE):")
        for subject, metrics in sorted_subjects[:3]:
            logger.info(f"  {subject}: MAE={metrics['mae']:.2f}, R²={metrics['r2']:.3f}")
        
        logger.info(f"\nSubjects Needing Improvement:")
        for subject, metrics in sorted_subjects[-3:]:
            logger.info(f"  {subject}: MAE={metrics['mae']:.2f}, R²={metrics['r2']:.3f}")
        
        logger.info("\n" + "="*60)

def main():
    """Main function with command line arguments"""
    parser = argparse.ArgumentParser(description='Enhanced CBSE Model Training')
    parser.add_argument('--real-data', type=str, help='Path to real data file (CSV or JSON)')
    parser.add_argument('--no-optimization', action='store_true', help='Skip hyperparameter optimization')
    parser.add_argument('--samples', type=int, default=1500, help='Number of synthetic samples to generate')
    
    args = parser.parse_args()
    
    # Initialize trainer
    trainer = EnhancedCBSETrainer(
        use_real_data=bool(args.real_data),
        real_data_path=args.real_data,
        optimize_hyperparams=not args.no_optimization
    )
    
    # Train models
    results = trainer.train_models()
    
    if results:
        logger.info("Enhanced training completed successfully!")
    else:
        logger.error("Training failed!")

if __name__ == "__main__":
    main()