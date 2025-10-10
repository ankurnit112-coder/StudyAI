import numpy as np
import logging
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

logger = logging.getLogger(__name__)

def evaluate_models(trainer):
    """Evaluate trained models and generate performance metrics"""
    results = {
        'subject_performance': {},
        'overall_metrics': {},
        'feature_importance': {},
        'training_metadata': trainer.training_metadata
    }
    
    for subject, model in trainer.models.items():
        # Get test data
        X_test = trainer.test_data.get(subject, {}).get('X')
        y_test = trainer.test_data.get(subject, {}).get('y')
        
        if X_test is None or y_test is None:
            logger.warning(f"No test data available for {subject}")
            continue
            
        # Make predictions
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        
        results['subject_performance'][subject] = {
            'mae': mae,
            'rmse': rmse,
            'r2': r2,
            'model_type': type(model).__name__,
            'n_samples': len(y_test)
        }
        
        # Feature importance if available
        if hasattr(model, 'feature_importances_'):
            results['feature_importance'][subject] = {
                'features': trainer.feature_names,
                'importance': model.feature_importances_.tolist()
            }
    
    # Calculate overall metrics
    maes = [m['mae'] for m in results['subject_performance'].values()]
    r2s = [m['r2'] for m in results['subject_performance'].values()]
    
    results['overall_metrics'] = {
        'avg_mae': np.mean(maes),
        'std_mae': np.std(maes),
        'avg_r2': np.mean(r2s),
        'std_r2': np.std(r2s)
    }
    
    return results

def generate_report(results, output_path):
    """Generate HTML report from evaluation results"""
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots
    
    # Create subplot figure
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=(
            'Mean Absolute Error by Subject',
            'R² Score by Subject',
            'Model Type Distribution',
            'Feature Importance'
        )
    )
    
    # MAE Plot
    subjects = list(results['subject_performance'].keys())
    maes = [perf['mae'] for perf in results['subject_performance'].values()]
    
    fig.add_trace(
        go.Bar(name='MAE', x=subjects, y=maes),
        row=1, col=1
    )
    
    # R² Plot
    r2s = [perf['r2'] for perf in results['subject_performance'].values()]
    fig.add_trace(
        go.Bar(name='R²', x=subjects, y=r2s),
        row=1, col=2
    )
    
    # Model Distribution
    model_types = [perf['model_type'] for perf in results['subject_performance'].values()]
    unique_models = list(set(model_types))
    model_counts = [model_types.count(m) for m in unique_models]
    
    fig.add_trace(
        go.Pie(labels=unique_models, values=model_counts),
        row=2, col=1
    )
    
    # Feature Importance (average across models)
    if results.get('feature_importance'):
        first_subject = list(results['feature_importance'].keys())[0]
        features = results['feature_importance'][first_subject]['features']
        importances = np.zeros(len(features))
        
        for subject_imp in results['feature_importance'].values():
            importances += np.array(subject_imp['importance'])
        importances /= len(results['feature_importance'])
        
        fig.add_trace(
            go.Bar(name='Importance', x=features, y=importances),
            row=2, col=2
        )
    
    # Update layout
    fig.update_layout(
        title_text='Model Evaluation Report',
        showlegend=False,
        height=1000
    )
    
    # Generate HTML
    with open(output_path, 'w') as f:
        f.write('<html><head><title>Model Evaluation Report</title></head><body>')
        f.write('<h1>Model Evaluation Report</h1>')
        
        # Overall Metrics
        f.write('<h2>Overall Performance</h2>')
        f.write('<ul>')
        f.write(f'<li>Average MAE: {results["overall_metrics"]["avg_mae"]:.2f} ± {results["overall_metrics"]["std_mae"]:.2f}</li>')
        f.write(f'<li>Average R²: {results["overall_metrics"]["avg_r2"]:.3f} ± {results["overall_metrics"]["std_r2"]:.3f}</li>')
        f.write('</ul>')
        
        # Subject Performance Table
        f.write('<h2>Subject Performance</h2>')
        f.write('<table border="1"><tr><th>Subject</th><th>MAE</th><th>R²</th><th>Model Type</th></tr>')
        for subject, perf in results['subject_performance'].items():
            f.write(f'<tr><td>{subject}</td><td>{perf["mae"]:.2f}</td><td>{perf["r2"]:.3f}</td><td>{perf["model_type"]}</td></tr>')
        f.write('</table>')
        
        # Add plots
        f.write(fig.to_html(full_html=False))
        
        f.write('</body></html>')
    
    logger.info(f'Report generated at {output_path}')