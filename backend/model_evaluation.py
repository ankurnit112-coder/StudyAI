#!/usr/bin/env python3
"""
Model evaluation and comparison script
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import joblib
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import learning_curve
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelEvaluator:
    """Comprehensive model evaluation and comparison"""
    
    def __init__(self, models_dir="models"):
        self.models_dir = models_dir
        self.models = {}
        self.scalers = {}
        self.selectors = {}
        self.metadata = None
        
    def load_models(self):
        """Load all trained models"""
        logger.info("Loading trained models...")
        
        # Load metadata
        metadata_path = os.path.join(self.models_dir, "latest_training.json")
        if os.path.exists(metadata_path):
            with open(metadata_path, 'r') as f:
                self.metadata = json.load(f)
        else:
            logger.warning("No training metadata found")
            return False
        
        self.training_metadata = {}
        
        # Load models for each subject
        for subject in self.metadata.get('subjects', []):
            subject_clean = subject.lower().replace(' ', '_')
            
            try:
                # Load model
                model_path = os.path.join(self.models_dir, f"{subject_clean}_enhanced_model.joblib")
                if os.path.exists(model_path):
                    self.models[subject] = joblib.load(model_path)
                
                # Load scaler
                scaler_path = os.path.join(self.models_dir, f"{subject_clean}_scaler.joblib")
                if os.path.exists(scaler_path):
                    self.scalers[subject] = joblib.load(scaler_path)
                
                # Load selector
                selector_path = os.path.join(self.models_dir, f"{subject_clean}_selector.joblib")
                if os.path.exists(selector_path):
                    self.selectors[subject] = joblib.load(selector_path)
                
                logger.info(f"Loaded {subject} model")
                
            except Exception as e:
                logger.error(f"Error loading {subject} model: {str(e)}")
        
        logger.info(f"Loaded {len(self.models)} models")
        return len(self.models) > 0
    
    def evaluate_model_performance(self):
        """Evaluate and compare model performance"""
        if not self.metadata:
            logger.error("No metadata available")
            return None
            
        results = {}
        results['subject_performance'] = {}
        overall_metrics = []
        
        results = self.metadata.get('results', {})
        
        # Create performance comparison
        performance_data = []
        for subject, metrics in results.items():
            performance_data.append({
                'Subject': subject,
                'MAE': metrics['mae'],
                'RMSE': metrics['rmse'],
                'R²': metrics['r2'],
                'Model Type': metrics.get('model_type', 'unknown'),
                'Features': metrics.get('n_features', 0),
                'Samples': metrics.get('n_samples', 0)
            })
        
        df = pd.DataFrame(performance_data)
        
        # Print performance summary
        logger.info("\n" + "="*80)
        logger.info("MODEL PERFORMANCE EVALUATION")
        logger.info("="*80)
        
        # Overall statistics
        logger.info(f"Average MAE: {df['MAE'].mean():.2f} ± {df['MAE'].std():.2f}")
        logger.info(f"Average RMSE: {df['RMSE'].mean():.2f} ± {df['RMSE'].std():.2f}")
        logger.info(f"Average R²: {df['R²'].mean():.3f} ± {df['R²'].std():.3f}")
        
        # Best performers
        logger.info(f"\nTop 5 Subjects by MAE:")
        top_mae = df.nsmallest(5, 'MAE')[['Subject', 'MAE', 'R²']]
        for _, row in top_mae.iterrows():
            logger.info(f"  {row['Subject']}: MAE={row['MAE']:.2f}, R²={row['R²']:.3f}")
        
        # Model type distribution
        logger.info(f"\nModel Type Distribution:")
        model_counts = df['Model Type'].value_counts()
        for model_type, count in model_counts.items():
            logger.info(f"  {model_type}: {count} subjects")
        
        # Performance by model type
        logger.info(f"\nPerformance by Model Type:")
        for model_type in df['Model Type'].unique():
            subset = df[df['Model Type'] == model_type]
            logger.info(f"  {model_type}:")
            logger.info(f"    Average MAE: {subset['MAE'].mean():.2f}")
            logger.info(f"    Average R²: {subset['R²'].mean():.3f}")
            logger.info(f"    Subjects: {len(subset)}")
        
        return df
    
    def analyze_feature_importance(self):
        """Analyze feature importance across models"""
        logger.info("\nAnalyzing feature importance...")
        
        feature_names = self.metadata.get('feature_names', [])
        if not feature_names:
            logger.warning("No feature names available")
            return
        
        # Collect feature importance from all models
        importance_data = {}
        
        for subject, model in self.models.items():
            if hasattr(model, 'feature_importances_'):
                # Get selected features
                if subject in self.selectors:
                    selector = self.selectors[subject]
                    selected_indices = selector.get_support(indices=True)
                    selected_features = [feature_names[i] for i in selected_indices if i < len(feature_names)]
                    importances = model.feature_importances_
                    
                    for i, importance in enumerate(importances):
                        if i < len(selected_features):
                            feature = selected_features[i]
                            if feature not in importance_data:
                                importance_data[feature] = []
                            importance_data[feature].append(importance)
        
        # Calculate average importance
        avg_importance = {}
        for feature, importances in importance_data.items():
            avg_importance[feature] = np.mean(importances)
        
        # Sort by importance
        sorted_features = sorted(avg_importance.items(), key=lambda x: x[1], reverse=True)
        
        logger.info(f"\nTop 10 Most Important Features:")
        for i, (feature, importance) in enumerate(sorted_features[:10]):
            logger.info(f"  {i+1:2d}. {feature}: {importance:.4f}")
        
        return sorted_features
    
    def predict_sample(self, student_data):
        """Make predictions for a sample student"""
        logger.info("Making sample predictions...")
        
        # This would need the same feature extraction logic as training
        # For now, just demonstrate the prediction interface
        predictions = {}
        
        for subject in self.models:
            try:
                # In a real implementation, you'd extract features from student_data
                # For demo, using random features
                sample_features = np.random.randn(1, 35)  # 35 features
                
                if subject in self.scalers:
                    sample_features = self.scalers[subject].transform(sample_features)
                
                if subject in self.selectors:
                    sample_features = self.selectors[subject].transform(sample_features)
                
                prediction = self.models[subject].predict(sample_features)[0]
                predictions[subject] = max(0, min(100, prediction))  # Clamp to 0-100
                
            except Exception as e:
                logger.warning(f"Error predicting {subject}: {str(e)}")
                predictions[subject] = 0
        
        return predictions
    
    def generate_performance_report(self, output_file="model_performance_report.html"):
        """Generate comprehensive HTML performance report"""
        logger.info(f"Generating performance report: {output_file}")
        
        if not self.metadata:
            logger.error("No metadata available for report")
            return
        
        results = self.metadata.get('results', {})
        
        # Create HTML report
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>CBSE Model Performance Report</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                .header {{ background-color: #f0f0f0; padding: 20px; border-radius: 5px; }}
                .metric {{ display: inline-block; margin: 10px; padding: 15px; background-color: #e8f4f8; border-radius: 5px; }}
                .subject-table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                .subject-table th, .subject-table td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                .subject-table th {{ background-color: #f2f2f2; }}
                .good {{ color: green; font-weight: bold; }}
                .average {{ color: orange; font-weight: bold; }}
                .poor {{ color: red; font-weight: bold; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>CBSE Board Exam Prediction Model Performance Report</h1>
                <p>Generated on: {self.metadata.get('timestamp', 'Unknown')}</p>
                <p>Training Type: {'Real Data' if self.metadata.get('use_real_data') else 'Synthetic Data'}</p>
                <p>Hyperparameter Optimization: {'Enabled' if self.metadata.get('optimize_hyperparams') else 'Disabled'}</p>
            </div>
            
            <h2>Overall Performance Metrics</h2>
        """
        
        # Calculate overall metrics
        all_mae = [r['mae'] for r in results.values()]
        all_rmse = [r['rmse'] for r in results.values()]
        all_r2 = [r['r2'] for r in results.values()]
        
        html_content += f"""
            <div class="metric">
                <h3>Average MAE</h3>
                <p>{np.mean(all_mae):.2f} ± {np.std(all_mae):.2f}</p>
            </div>
            <div class="metric">
                <h3>Average RMSE</h3>
                <p>{np.mean(all_rmse):.2f} ± {np.std(all_rmse):.2f}</p>
            </div>
            <div class="metric">
                <h3>Average R²</h3>
                <p>{np.mean(all_r2):.3f} ± {np.std(all_r2):.3f}</p>
            </div>
            <div class="metric">
                <h3>Models Trained</h3>
                <p>{len(results)}</p>
            </div>
            
            <h2>Subject-wise Performance</h2>
            <table class="subject-table">
                <tr>
                    <th>Subject</th>
                    <th>MAE</th>
                    <th>RMSE</th>
                    <th>R²</th>
                    <th>Model Type</th>
                    <th>Performance</th>
                </tr>
        """
        
        # Add subject rows
        for subject, metrics in sorted(results.items(), key=lambda x: x[1]['mae']):
            mae = metrics['mae']
            rmse = metrics['rmse']
            r2 = metrics['r2']
            model_type = metrics.get('model_type', 'unknown')
            
            # Classify performance
            if mae < 5 and r2 > 0.8:
                performance_class = "good"
                performance_text = "Excellent"
            elif mae < 10 and r2 > 0.5:
                performance_class = "average"
                performance_text = "Good"
            else:
                performance_class = "poor"
                performance_text = "Needs Improvement"
            
            html_content += f"""
                <tr>
                    <td>{subject}</td>
                    <td>{mae:.2f}</td>
                    <td>{rmse:.2f}</td>
                    <td>{r2:.3f}</td>
                    <td>{model_type}</td>
                    <td class="{performance_class}">{performance_text}</td>
                </tr>
            """
        
        html_content += """
            </table>
            
            <h2>Recommendations</h2>
            <ul>
        """
        
        # Add recommendations based on performance
        poor_subjects = [s for s, m in results.items() if m['mae'] > 10 or m['r2'] < 0.3]
        if poor_subjects:
            html_content += f"<li>Consider collecting more training data for: {', '.join(poor_subjects[:3])}</li>"
        
        if np.mean(all_r2) < 0.7:
            html_content += "<li>Overall model performance could be improved with feature engineering</li>"
        
        if self.metadata.get('use_real_data'):
            html_content += "<li>Real data training completed - monitor performance with new predictions</li>"
        else:
            html_content += "<li>Consider training with real student data when available</li>"
        
        html_content += """
            </ul>
        </body>
        </html>
        """
        
        # Save report
        with open(output_file, 'w') as f:
            f.write(html_content)
        
        logger.info(f"Performance report saved to {output_file}")

def main():
    """Main evaluation function"""
    evaluator = ModelEvaluator()
    
    if not evaluator.load_models():
        logger.error("Failed to load models. Run training first.")
        return
    
    # Evaluate performance
    performance_df = evaluator.evaluate_model_performance()
    
    # Analyze feature importance
    feature_importance = evaluator.analyze_feature_importance()
    
    # Generate report
    evaluator.generate_performance_report()
    
    # Sample prediction (demo)
    sample_predictions = evaluator.predict_sample({})
    logger.info(f"\nSample Predictions: {sample_predictions}")

if __name__ == "__main__":
    main()