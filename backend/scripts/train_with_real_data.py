#!/usr/bin/env python3
"""
Script to run enhanced training with real CBSE data
"""
import os
import sys
from datetime import datetime
import logging

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from enhanced_train import EnhancedCBSETrainer
from evaluation_utils import evaluate_models, generate_report

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def train_with_real_data(data_path, output_dir, optimize_hyperparams=True):
    """Run training with real CBSE data"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    run_dir = os.path.join(output_dir, f'training_run_{timestamp}')
    os.makedirs(run_dir, exist_ok=True)
    
    logger.info(f"Starting enhanced training with real data from {data_path}")
    logger.info(f"Output directory: {run_dir}")
    
    try:
        # Initialize trainer with real data
        trainer = EnhancedCBSETrainer(
            use_real_data=True,
            real_data_path=data_path,
            optimize_hyperparams=optimize_hyperparams
        )
        
        # Configure optimal hyperparameters for real data
        trainer.hyperparameter_configs = {
            'random_forest': {
                'n_estimators': [100, 200, 300],
                'max_depth': [10, 20, 30, None],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4]
            },
            'gradient_boosting': {
                'n_estimators': [100, 200, 300],
                'learning_rate': [0.01, 0.1],
                'max_depth': [3, 5, 7],
                'subsample': [0.8, 1.0]
            },
            'elastic_net': {
                'alpha': [0.1, 1.0, 10.0],
                'l1_ratio': [0.1, 0.5, 0.9]
            }
        }
        
        # Run training
        logger.info("Starting training process...")
        trainer.train()
        
        # Save models and metadata
        model_dir = os.path.join(run_dir, 'models')
        os.makedirs(model_dir, exist_ok=True)
        trainer.save_models(model_dir)
        
        # Evaluate and generate report
        logger.info("Evaluating models...")
        evaluation_results = evaluate_models(trainer)
        report_path = os.path.join(run_dir, 'training_report.html')
        generate_report(evaluation_results, report_path)
        
        logger.info("Training completed successfully!")
        return evaluation_results, run_dir
        
    except Exception as e:
        logger.error(f"Training failed: {str(e)}")
        raise
        
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Run enhanced training with real CBSE data')
    parser.add_argument('data_path', help='Path to processed real data CSV')
    parser.add_argument('--output-dir', default='training_output',
                       help='Directory to store training outputs')
    parser.add_argument('--no-optimization', action='store_true',
                       help='Skip hyperparameter optimization')
    
    args = parser.parse_args()
    results, run_dir = train_with_real_data(
        args.data_path,
        args.output_dir,
        optimize_hyperparams=not args.no_optimization
    )
    
    print(f"\nTraining completed!")
    print(f"Output directory: {run_dir}")
    print("\nModel Performance Summary:")
    for subject, metrics in results['subject_performance'].items():
        print(f"\n{subject}:")
        print(f"  MAE: {metrics['mae']:.2f}")
        print(f"  R²:  {metrics['r2']:.3f}")