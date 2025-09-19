#!/usr/bin/env python3
"""
Script to initialize the StudyAI system with historical academic data
This script generates synthetic CBSE data and trains the initial ML models
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine
from app.models import Base
from app.ml.training_pipeline import MLTrainingPipeline
from app.ml.data_generator import generate_historical_data, create_sample_dataset
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def initialize_database():
    """Initialize database tables"""
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")

def generate_training_data(num_students: int = 5000, years_of_data: int = 3):
    """Generate synthetic training data"""
    logger.info(f"Generating training data for {num_students} students...")
    
    db = SessionLocal()
    try:
        # Generate historical data
        historical_data = generate_historical_data(num_students, years_of_data, db)
        
        logger.info(f"Generated data for {len(historical_data)} students")
        return historical_data
        
    except Exception as e:
        logger.error(f"Failed to generate training data: {str(e)}")
        return []
    finally:
        db.close()

def train_initial_models():
    """Train initial ML models"""
    logger.info("Training initial ML models...")
    
    db = SessionLocal()
    try:
        pipeline = MLTrainingPipeline(db)
        result = pipeline.run_training_pipeline(use_synthetic_data=True)
        
        if result["status"] == "success":
            logger.info("Initial model training completed successfully")
            logger.info(f"Training results: {result}")
        else:
            logger.error(f"Model training failed: {result}")
        
        return result
        
    except Exception as e:
        logger.error(f"Failed to train models: {str(e)}")
        return {"status": "failed", "reason": str(e)}
    finally:
        db.close()

def create_sample_data_file():
    """Create a sample CSV file for data inspection"""
    logger.info("Creating sample data file...")
    create_sample_dataset("sample_cbse_data.csv")
    logger.info("Sample data file created: sample_cbse_data.csv")

def main():
    """Main initialization function"""
    print("=" * 60)
    print("StudyAI - CBSE Academic Performance Prediction System")
    print("Initializing with Historical Academic Data")
    print("=" * 60)
    
    try:
        # Step 1: Initialize database
        print("\n1. Initializing database...")
        initialize_database()
        
        # Step 2: Create sample data file for inspection
        print("\n2. Creating sample data file...")
        create_sample_data_file()
        
        # Step 3: Generate training data
        print("\n3. Generating synthetic training data...")
        training_data = generate_training_data(num_students=5000, years_of_data=3)
        
        if not training_data:
            print("❌ Failed to generate training data")
            return
        
        print(f"✅ Generated training data for {len(training_data)} students")
        
        # Step 4: Train initial models
        print("\n4. Training initial ML models...")
        training_result = train_initial_models()
        
        if training_result["status"] == "success":
            print("✅ Initial model training completed successfully")
            print(f"   - Training samples: {training_result.get('training_samples', 'N/A')}")
            print(f"   - Subjects trained: {len(training_result.get('subjects_trained', []))}")
            print(f"   - Model version: {training_result.get('model_version', 'N/A')}")
        else:
            print(f"❌ Model training failed: {training_result.get('reason', 'Unknown error')}")
            return
        
        print("\n" + "=" * 60)
        print("🎉 StudyAI initialization completed successfully!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Start the FastAPI server: uvicorn app.main:app --reload")
        print("2. Access the API documentation: http://localhost:8000/docs")
        print("3. Test predictions via API endpoints")
        print("4. The training scheduler will automatically retrain models as needed")
        
    except Exception as e:
        print(f"\n❌ Initialization failed: {str(e)}")
        logger.error(f"Initialization failed: {str(e)}")

if __name__ == "__main__":
    main()