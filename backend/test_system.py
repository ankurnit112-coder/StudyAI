#!/usr/bin/env python3
"""
Comprehensive test suite for the CBSE ML training system
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import numpy as np
import pandas as pd
import joblib
import json
import logging
from datetime import datetime
import traceback

# Import our modules
from app.ml.data_generator import generate_training_data, CBSEDataGenerator
from enhanced_train import EnhancedCBSETrainer
from model_evaluation import ModelEvaluator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SystemTester:
    """Comprehensive system testing"""
    
    def __init__(self):
        self.test_results = {}
        self.passed_tests = 0
        self.failed_tests = 0
        
    def run_test(self, test_name, test_function):
        """Run a single test and record results"""
        logger.info(f"\n{'='*60}")
        logger.info(f"TESTING: {test_name}")
        logger.info(f"{'='*60}")
        
        try:
            start_time = datetime.now()
            result = test_function()
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            if result:
                logger.info(f"✅ PASSED: {test_name} ({duration:.2f}s)")
                self.test_results[test_name] = {
                    'status': 'PASSED',
                    'duration': duration,
                    'details': result if isinstance(result, dict) else {}
                }
                self.passed_tests += 1
            else:
                logger.error(f"❌ FAILED: {test_name} ({duration:.2f}s)")
                self.test_results[test_name] = {
                    'status': 'FAILED',
                    'duration': duration,
                    'details': {}
                }
                self.failed_tests += 1
                
        except Exception as e:
            logger.error(f"❌ ERROR: {test_name} - {str(e)}")
            logger.error(traceback.format_exc())
            self.test_results[test_name] = {
                'status': 'ERROR',
                'duration': 0,
                'details': {'error': str(e)}
            }
            self.failed_tests += 1
    
    def test_data_generation(self):
        """Test synthetic data generation"""
        logger.info("Testing synthetic data generation...")
        
        # Test basic data generation
        training_data = generate_training_data(num_students=50, years_of_data=2)
        
        if not training_data:
            logger.error("No training data generated")
            return False
        
        logger.info(f"Generated data for {len(training_data)} students")
        
        # Validate data structure
        student_profile, academic_records, board_scores = training_data[0]
        
        # Check student profile
        required_profile_keys = ['id', 'current_class', 'gender', 'school_code', 'academic_year']
        for key in required_profile_keys:
            if key not in student_profile:
                logger.error(f"Missing key in student profile: {key}")
                return False
        
        # Check academic records
        if not academic_records:
            logger.error("No academic records generated")
            return False
        
        required_record_keys = ['subject', 'score', 'max_score', 'exam_type', 'exam_date', 'term']
        for key in required_record_keys:
            if key not in academic_records[0]:
                logger.error(f"Missing key in academic record: {key}")
                return False
        
        # Check board scores
        if not board_scores:
            logger.error("No board scores generated")
            return False
        
        logger.info(f"✓ Student profile keys: {list(student_profile.keys())}")
        logger.info(f"✓ Academic records: {len(academic_records)} records")
        logger.info(f"✓ Board scores: {len(board_scores)} subjects")
        
        return {
            'students_generated': len(training_data),
            'avg_records_per_student': np.mean([len(records) for _, records, _ in training_data]),
            'subjects_with_scores': len(board_scores),
            'sample_subjects': list(board_scores.keys())[:5]
        }
    
    def test_feature_engineering(self):
        """Test enhanced feature engineering"""
        logger.info("Testing enhanced feature engineering...")
        
        # Generate sample data
        training_data = generate_training_data(num_students=10, years_of_data=2)
        if not training_data:
            return False
        
        # Test feature extraction
        trainer = EnhancedCBSETrainer()
        student_profile, academic_records, board_scores = training_data[0]
        
        features = trainer.extract_enhanced_features(student_profile, academic_records)
        
        if features is None or len(features) == 0:
            logger.error("No features extracted")
            return False
        
        logger.info(f"✓ Extracted {len(features)} features")
        logger.info(f"✓ Feature range: {features.min():.2f} to {features.max():.2f}")
        logger.info(f"✓ Feature mean: {features.mean():.2f}")
        
        # Test feature consistency
        features2 = trainer.extract_enhanced_features(student_profile, academic_records)
        if not np.array_equal(features, features2):
            logger.error("Feature extraction not consistent")
            return False
        
        return {
            'num_features': len(features),
            'feature_range': [float(features.min()), float(features.max())],
            'feature_mean': float(features.mean()),
            'feature_std': float(features.std())
        }
    
    def test_model_training(self):
        """Test model training pipeline"""
        logger.info("Testing model training pipeline...")
        
        # Create trainer with fast settings
        trainer = EnhancedCBSETrainer(optimize_hyperparams=False)
        
        # Generate small dataset for quick testing
        logger.info("Generating test dataset...")
        training_data = generate_training_data(num_students=100, years_of_data=2)
        
        if not training_data:
            logger.error("No training data for model testing")
            return False
        
        # Extract features and targets
        X_list = []
        y_dict = {}
        
        for student_profile, academic_records, board_scores in training_data:
            if not board_scores:
                continue
                
            try:
                features = trainer.extract_enhanced_features(student_profile, academic_records)
                X_list.append(features)
                
                for subject, score in board_scores.items():
                    if subject not in y_dict:
                        y_dict[subject] = []
                    y_dict[subject].append(score)
            except:
                continue
        
        if not X_list:
            logger.error("No valid training samples")
            return False
        
        # Convert to arrays
        X = np.array(X_list)
        min_samples = min(len(scores) for scores in y_dict.values())
        X = X[:min_samples]
        
        for subject in y_dict:
            y_dict[subject] = np.array(y_dict[subject][:min_samples])
        
        logger.info(f"✓ Training data shape: {X.shape}")
        logger.info(f"✓ Subjects: {len(y_dict)}")
        
        # Test training for one subject (Mathematics)
        if 'Mathematics' not in y_dict:
            logger.error("Mathematics not in training data")
            return False
        
        from sklearn.ensemble import RandomForestRegressor
        from sklearn.model_selection import train_test_split
        from sklearn.preprocessing import RobustScaler
        from sklearn.metrics import mean_absolute_error, r2_score
        
        # Train a simple model
        y = y_dict['Mathematics']
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
        
        # Scale features
        scaler = RobustScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train model
        model = RandomForestRegressor(n_estimators=50, random_state=42)
        model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test_scaled)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        logger.info(f"✓ Mathematics model - MAE: {mae:.2f}, R²: {r2:.3f}")
        
        # Test prediction
        sample_pred = model.predict(X_test_scaled[:1])[0]
        logger.info(f"✓ Sample prediction: {sample_pred:.1f}")
        
        return {
            'training_samples': len(X),
            'num_subjects': len(y_dict),
            'mathematics_mae': float(mae),
            'mathematics_r2': float(r2),
            'sample_prediction': float(sample_pred)
        }
    
    def test_real_data_processing(self):
        """Test real data processing"""
        logger.info("Testing real data processing...")
        
        # Check if template file exists
        template_path = "data/real_data_template.csv"
        if not os.path.exists(template_path):
            logger.error(f"Template file not found: {template_path}")
            return False
        
        # Test CSV processing
        trainer = EnhancedCBSETrainer(use_real_data=True, real_data_path=template_path)
        
        try:
            real_data = trainer.load_real_data(template_path)
            
            if not real_data:
                logger.error("No real data loaded")
                return False
            
            logger.info(f"✓ Loaded {len(real_data)} students from CSV")
            
            # Validate structure
            student_profile, academic_records, board_scores = real_data[0]
            
            logger.info(f"✓ Sample student class: {student_profile.get('current_class')}")
            logger.info(f"✓ Sample records: {len(academic_records)}")
            logger.info(f"✓ Sample board scores: {len(board_scores)}")
            
            return {
                'students_loaded': len(real_data),
                'sample_class': student_profile.get('current_class'),
                'sample_records': len(academic_records),
                'sample_subjects': list(board_scores.keys())
            }
            
        except Exception as e:
            logger.error(f"Error processing real data: {str(e)}")
            return False
    
    def test_model_persistence(self):
        """Test model saving and loading"""
        logger.info("Testing model persistence...")
        
        # Check if models exist
        models_dir = "models"
        if not os.path.exists(models_dir):
            logger.error("Models directory not found")
            return False
        
        # Check for model files
        model_files = [f for f in os.listdir(models_dir) if f.endswith('_enhanced_model.joblib')]
        scaler_files = [f for f in os.listdir(models_dir) if f.endswith('_scaler.joblib')]
        
        if not model_files:
            logger.error("No model files found")
            return False
        
        logger.info(f"✓ Found {len(model_files)} model files")
        logger.info(f"✓ Found {len(scaler_files)} scaler files")
        
        # Test loading a model
        try:
            sample_model_path = os.path.join(models_dir, model_files[0])
            model = joblib.load(sample_model_path)
            
            logger.info(f"✓ Successfully loaded model: {model_files[0]}")
            logger.info(f"✓ Model type: {type(model).__name__}")
            
            # Check metadata
            metadata_path = os.path.join(models_dir, "latest_training.json")
            if os.path.exists(metadata_path):
                with open(metadata_path, 'r') as f:
                    metadata = json.load(f)
                
                logger.info(f"✓ Training timestamp: {metadata.get('timestamp')}")
                logger.info(f"✓ Subjects trained: {len(metadata.get('subjects', []))}")
                
                return {
                    'model_files_found': len(model_files),
                    'scaler_files_found': len(scaler_files),
                    'sample_model_type': type(model).__name__,
                    'training_timestamp': metadata.get('timestamp'),
                    'subjects_trained': len(metadata.get('subjects', []))
                }
            else:
                logger.warning("No training metadata found")
                return {
                    'model_files_found': len(model_files),
                    'scaler_files_found': len(scaler_files),
                    'sample_model_type': type(model).__name__
                }
                
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            return False
    
    def test_evaluation_system(self):
        """Test model evaluation system"""
        logger.info("Testing model evaluation system...")
        
        try:
            evaluator = ModelEvaluator()
            
            # Test model loading
            if not evaluator.load_models():
                logger.error("Failed to load models for evaluation")
                return False
            
            logger.info(f"✓ Loaded {len(evaluator.models)} models for evaluation")
            
            # Test performance evaluation
            if evaluator.metadata:
                results = evaluator.metadata.get('results', {})
                
                if results:
                    avg_mae = np.mean([r['mae'] for r in results.values()])
                    avg_r2 = np.mean([r['r2'] for r in results.values()])
                    
                    logger.info(f"✓ Average MAE: {avg_mae:.2f}")
                    logger.info(f"✓ Average R²: {avg_r2:.3f}")
                    
                    # Test feature importance
                    feature_importance = evaluator.analyze_feature_importance()
                    
                    if feature_importance:
                        logger.info(f"✓ Feature importance analysis completed")
                        logger.info(f"✓ Top feature: {feature_importance[0][0]}")
                    
                    return {
                        'models_evaluated': len(evaluator.models),
                        'average_mae': float(avg_mae),
                        'average_r2': float(avg_r2),
                        'top_feature': feature_importance[0][0] if feature_importance else None
                    }
                else:
                    logger.error("No results in metadata")
                    return False
            else:
                logger.error("No metadata available")
                return False
                
        except Exception as e:
            logger.error(f"Error in evaluation system: {str(e)}")
            return False
    
    def test_prediction_pipeline(self):
        """Test end-to-end prediction pipeline"""
        logger.info("Testing prediction pipeline...")
        
        try:
            # Generate sample student data
            generator = CBSEDataGenerator()
            student_profile = generator.generate_student_profile(9999)
            academic_records = generator.generate_academic_records(student_profile, 2)
            
            logger.info(f"✓ Generated test student data")
            logger.info(f"✓ Student class: {student_profile['current_class']}")
            logger.info(f"✓ Academic records: {len(academic_records)}")
            
            # Extract features
            trainer = EnhancedCBSETrainer()
            features = trainer.extract_enhanced_features(student_profile, academic_records)
            
            logger.info(f"✓ Extracted {len(features)} features")
            
            # Load a model and make prediction
            models_dir = "models"
            model_files = [f for f in os.listdir(models_dir) if f.endswith('_enhanced_model.joblib')]
            
            if not model_files:
                logger.error("No models available for prediction")
                return False
            
            # Test with Mathematics model
            math_model_path = None
            for f in model_files:
                if 'mathematics' in f.lower():
                    math_model_path = os.path.join(models_dir, f)
                    break
            
            if not math_model_path:
                logger.error("Mathematics model not found")
                return False
            
            # Load model components
            model = joblib.load(math_model_path)
            
            scaler_path = math_model_path.replace('_enhanced_model.joblib', '_scaler.joblib')
            selector_path = math_model_path.replace('_enhanced_model.joblib', '_selector.joblib')
            
            if os.path.exists(scaler_path) and os.path.exists(selector_path):
                scaler = joblib.load(scaler_path)
                selector = joblib.load(selector_path)
                
                # Process features
                features_scaled = scaler.transform(features.reshape(1, -1))
                features_selected = selector.transform(features_scaled)
                
                # Make prediction
                prediction = model.predict(features_selected)[0]
                
                logger.info(f"✓ Mathematics prediction: {prediction:.1f}")
                
                # Validate prediction range
                if 0 <= prediction <= 100:
                    logger.info(f"✓ Prediction in valid range")
                else:
                    logger.warning(f"Prediction outside valid range: {prediction}")
                
                return {
                    'test_student_class': student_profile['current_class'],
                    'academic_records_count': len(academic_records),
                    'features_extracted': len(features),
                    'mathematics_prediction': float(prediction),
                    'prediction_valid': 0 <= prediction <= 100
                }
            else:
                logger.error("Scaler or selector not found")
                return False
                
        except Exception as e:
            logger.error(f"Error in prediction pipeline: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all system tests"""
        logger.info("\n" + "="*80)
        logger.info("CBSE ML SYSTEM - COMPREHENSIVE TEST SUITE")
        logger.info("="*80)
        
        # Define all tests
        tests = [
            ("Data Generation", self.test_data_generation),
            ("Feature Engineering", self.test_feature_engineering),
            ("Model Training", self.test_model_training),
            ("Real Data Processing", self.test_real_data_processing),
            ("Model Persistence", self.test_model_persistence),
            ("Evaluation System", self.test_evaluation_system),
            ("Prediction Pipeline", self.test_prediction_pipeline)
        ]
        
        # Run each test
        for test_name, test_function in tests:
            self.run_test(test_name, test_function)
        
        # Print final summary
        return self.print_test_summary()
    
    def print_test_summary(self):
        """Print comprehensive test summary"""
        logger.info("\n" + "="*80)
        logger.info("TEST SUMMARY")
        logger.info("="*80)
        
        total_tests = self.passed_tests + self.failed_tests
        success_rate = (self.passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        logger.info(f"Total Tests: {total_tests}")
        logger.info(f"Passed: {self.passed_tests}")
        logger.info(f"Failed: {self.failed_tests}")
        logger.info(f"Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 85:
            logger.info("🎉 SYSTEM STATUS: EXCELLENT")
        elif success_rate >= 70:
            logger.info("✅ SYSTEM STATUS: GOOD")
        elif success_rate >= 50:
            logger.info("⚠️  SYSTEM STATUS: NEEDS ATTENTION")
        else:
            logger.info("❌ SYSTEM STATUS: CRITICAL ISSUES")
        
        # Detailed results
        logger.info("\nDetailed Results:")
        for test_name, result in self.test_results.items():
            status_emoji = "✅" if result['status'] == 'PASSED' else "❌"
            logger.info(f"{status_emoji} {test_name}: {result['status']} ({result['duration']:.2f}s)")
            
            if result['details']:
                for key, value in result['details'].items():
                    logger.info(f"    {key}: {value}")
        
        # Save results to file
        results_file = f"test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(results_file, 'w') as f:
            json.dump(self.test_results, f, indent=2, default=str)
        
        logger.info(f"\nTest results saved to: {results_file}")
        
        return success_rate >= 70  # Return True if tests mostly passed

def main():
    """Main test function"""
    tester = SystemTester()
    success = tester.run_all_tests()
    
    if success:
        logger.info("\n🎉 SYSTEM READY FOR PRODUCTION!")
        return 0
    else:
        logger.error("\n❌ SYSTEM NEEDS FIXES BEFORE PRODUCTION")
        return 1

if __name__ == "__main__":
    exit(main())