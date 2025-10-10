#!/usr/bin/env python3
"""
Backend health test script
"""

import sys
import traceback
from datetime import datetime

def test_imports():
    """Test all critical imports"""
    print("Testing imports...")
    
    try:
        # Core imports
        from app.main import app
        from app.core.config import settings
        from app.core.database import engine, Base, get_db
        print("✓ Core modules imported successfully")
        
        # API imports
        from app.api.v1.api import api_router
        from app.api.health import router as health_router
        print("✓ API modules imported successfully")
        
        # ML imports
        from app.ml.models import CBSEPerformancePredictor, ModelEnsemble
        from app.ml.feature_engineering import CBSEFeatureEngineer
        from app.ml.prediction_service import PredictionService
        from app.ml.training_pipeline import MLTrainingPipeline
        from app.ml.training_scheduler import start_training_scheduler
        print("✓ ML modules imported successfully")
        
        # Database models
        from app.models import Student, AcademicRecord, Prediction, ModelPerformance
        print("✓ Database models imported successfully")
        
        return True
    except Exception as e:
        print(f"✗ Import failed: {str(e)}")
        traceback.print_exc()
        return False

def test_database():
    """Test database connection and table creation"""
    print("\nTesting database...")
    
    try:
        from app.core.database import engine, Base
        from sqlalchemy import text
        
        # Create tables
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables created successfully")
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✓ Database connection successful")
        
        return True
    except Exception as e:
        print(f"✗ Database test failed: {str(e)}")
        traceback.print_exc()
        return False

def test_ml_components():
    """Test ML components"""
    print("\nTesting ML components...")
    
    try:
        from app.ml.feature_engineering import CBSEFeatureEngineer
        from app.ml.models import CBSEPerformancePredictor
        
        # Test feature engineer
        fe = CBSEFeatureEngineer()
        print("✓ Feature engineer created successfully")
        
        # Test model
        model = CBSEPerformancePredictor()
        print("✓ ML model created successfully")
        
        return True
    except Exception as e:
        print(f"✗ ML components test failed: {str(e)}")
        traceback.print_exc()
        return False

def test_api_creation():
    """Test FastAPI app creation"""
    print("\nTesting API creation...")
    
    try:
        from app.main import app
        
        # Check if app is created
        if app is None:
            raise Exception("FastAPI app is None")
        
        print("✓ FastAPI app created successfully")
        print(f"✓ App title: {app.title}")
        print(f"✓ App version: {app.version}")
        
        return True
    except Exception as e:
        print(f"✗ API creation test failed: {str(e)}")
        traceback.print_exc()
        return False

def test_configuration():
    """Test configuration loading"""
    print("\nTesting configuration...")
    
    try:
        from app.core.config import settings
        
        print(f"✓ Database URL: {settings.DATABASE_URL}")
        print(f"✓ ML Model Path: {settings.ML_MODEL_PATH}")
        print(f"✓ Debug Mode: {settings.DEBUG}")
        print(f"✓ CBSE Subjects: {len(settings.CBSE_SUBJECTS)} subjects")
        print(f"✓ CBSE Classes: {settings.CBSE_CLASSES}")
        
        return True
    except Exception as e:
        print(f"✗ Configuration test failed: {str(e)}")
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("=" * 50)
    print("StudyAI Backend Health Check")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("=" * 50)
    
    tests = [
        ("Imports", test_imports),
        ("Database", test_database),
        ("ML Components", test_ml_components),
        ("API Creation", test_api_creation),
        ("Configuration", test_configuration),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n[{test_name}]")
        success = test_func()
        results.append((test_name, success))
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    
    passed = 0
    for test_name, success in results:
        status = "PASS" if success else "FAIL"
        print(f"{test_name:20} {status}")
        if success:
            passed += 1
    
    print(f"\nPassed: {passed}/{len(tests)}")
    
    if passed == len(tests):
        print("🎉 All tests passed! Backend is ready.")
        return 0
    else:
        print("❌ Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())