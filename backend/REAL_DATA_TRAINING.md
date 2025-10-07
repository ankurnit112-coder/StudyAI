# Training with Real CBSE Data

## Prerequisites

- Python 3.8 or higher
- Required packages: scikit-learn, pandas, numpy
- Real student data in CSV or Excel format

## Data Format

Your data file should contain the following columns:

- `student_id`: Unique identifier for each student
- `current_class`: Student's current class (9-12)
- `gender`: male/female/other
- `subject`: One of the supported CBSE subjects
- `score`: Score obtained (0-100)
- `max_score`: Maximum possible score (usually 100)
- `exam_type`: Type of exam (unit_test/mid_term/pre_board/final/board)
- `exam_date`: Date of exam (YYYY-MM-DD)
- `term`: Academic term (first_term/second_term)
- `board_score`: Actual board exam score if available

A template is provided in `data/real_data_template.csv`.

## Training Process

1. Data Setup and Validation:
```bash
python scripts/setup_real_data.py input_data.csv processed_data.csv
```

2. Run Enhanced Training:
```bash
python scripts/train_with_real_data.py processed_data.csv --output-dir training_output
```

Optional: Skip hyperparameter optimization for faster training:
```bash
python scripts/train_with_real_data.py processed_data.csv --no-optimization
```

## Training Output

The training process will create a timestamped directory containing:
- Trained models for each subject
- Training metadata and configuration
- Performance evaluation report
- Feature importance analysis

## Performance Metrics

The system tracks:
- Mean Absolute Error (MAE)
- Root Mean Square Error (RMSE)
- R² Score
- Feature importance rankings
- Cross-validation scores

## Model Selection

The system automatically selects the best performing model for each subject from:
- Random Forest Regressor
- Gradient Boosting Regressor
- Elastic Net Regression

## Tips for Best Results

1. Provide diverse student data across multiple years
2. Include a good mix of exam types and terms
3. Ensure consistent scoring scales across records
4. Include both strong and average performers
5. Provide as many records as possible per student

## Error Handling

Common data validation errors:
- Invalid subject names
- Scores outside 0-100 range
- Invalid dates
- Missing required fields

Check the error messages for specific issues in your data.

## Support

For issues or questions:
1. Check the error messages and logs
2. Verify data format against template
3. Ensure all prerequisites are installed
4. Contact support with training output logs