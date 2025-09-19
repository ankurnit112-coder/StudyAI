# StudyAI Backend - CBSE Board Exam Prediction System

AI-powered backend system for predicting CBSE board exam performance and providing personalized study recommendations.

## Features

- **ML-Powered Predictions**: Multi-target regression models for subject-wise board exam score prediction
- **Historical Data Training**: Trains on both real and synthetic CBSE academic data
- **Automated Retraining**: Scheduled model retraining based on performance metrics
- **CBSE-Specific Features**: Tailored for Indian CBSE curriculum and marking schemes
- **Real-time API**: FastAPI-based REST API for predictions and data management

## Technology Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Caching**: Redis
- **ML Libraries**: scikit-learn, XGBoost, Optuna
- **Data Processing**: Pandas, NumPy

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database and Redis configurations
```

5. **Initialize database**
```bash
alembic upgrade head
```

## Configuration

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/studyai_db

# Redis
REDIS_URL=redis://localhost:6379

# ML Settings
ML_MODEL_PATH=./models
TRAINING_DATA_PATH=./data

# API Settings
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CBSE Configuration
CBSE_SUBJECTS=Mathematics,Physics,Chemistry,Biology,English,Hindi,Computer Science,Physical Education,Economics,Business Studies,Accountancy,Political Science,History,Geography
CBSE_CLASSES=9,10,11,12
```

## Running the Application

1. **Start the development server**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. **Access the API documentation**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Students
- `POST /api/v1/students/` - Create a new student
- `GET /api/v1/students/{student_id}` - Get student details
- `GET /api/v1/students/` - List students
- `PUT /api/v1/students/{student_id}` - Update student
- `DELETE /api/v1/students/{student_id}` - Delete student

### Academic Records
- `POST /api/v1/academic-records/` - Add academic record
- `GET /api/v1/academic-records/student/{student_id}` - Get student records
- `GET /api/v1/academic-records/{record_id}` - Get specific record
- `PUT /api/v1/academic-records/{record_id}` - Update record
- `DELETE /api/v1/academic-records/{record_id}` - Delete record

### Predictions
- `POST /api/v1/predictions/generate` - Generate AI predictions
- `GET /api/v1/predictions/student/{student_id}` - Get prediction history
- `POST /api/v1/predictions/feedback` - Submit prediction feedback
- `GET /api/v1/predictions/accuracy-stats` - Get accuracy statistics

### Training
- `POST /api/v1/training/start` - Start model training
- `GET /api/v1/training/status` - Get training status
- `GET /api/v1/training/models` - Get model performance metrics
- `GET /api/v1/training/history` - Get training history
- `POST /api/v1/training/validate` - Validate training data

## ML Pipeline

### 1. Data Generation
The system can generate synthetic CBSE academic data for training:

```python
from app.ml.data_generator import generate_historical_data

# Generate 1000 student records with 3 years of data
training_data = generate_historical_data(num_students=1000, years_of_data=3)
```

### 2. Feature Engineering
Extracts meaningful features from academic records:

- Subject-wise performance trends
- Exam type performance patterns
- Term-wise improvements
- Cross-subject correlations
- Temporal features

### 3. Model Training
Uses ensemble methods for robust predictions:

- XGBoost Regressor
- Random Forest Regressor
- Gradient Boosting Regressor
- Hyperparameter optimization with Optuna

### 4. Automated Retraining
- Daily performance checks
- Weekly full retraining
- Performance-based triggers
- Model versioning and rollback

## Database Schema

### Students
- Personal information
- CBSE board details
- Academic year and class

### Academic Records
- Exam scores and types
- Subject-wise performance
- Temporal tracking

### Predictions
- AI-generated predictions
- Confidence scores
- Feedback and accuracy tracking

### Model Performance
- Training metrics
- Model versions
- Performance tracking

## Development

### Running Tests
```bash
pytest tests/ -v
```

### Code Quality
```bash
# Format code
black app/

# Lint code
flake8 app/

# Type checking
mypy app/
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

## Deployment

### Docker
```bash
# Build image
docker build -t studyai-backend .

# Run container
docker run -p 8000:8000 studyai-backend
```

### Production Considerations
- Use PostgreSQL for production database
- Set up Redis for caching
- Configure proper logging
- Set up monitoring and alerting
- Use environment-specific configurations

## Monitoring

The system provides comprehensive monitoring:

- Model performance metrics
- Prediction accuracy tracking
- Training job status
- API performance metrics
- Database health checks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.