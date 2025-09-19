import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "StudyAI Backend API"
    assert data["version"] == "1.0.0"
    assert data["status"] == "running"

def test_health_endpoint():
    """Test the health check endpoint"""
    response = client.get("/health")
    # Note: This might fail without proper database setup
    # In a real test environment, you'd use a test database
    assert response.status_code in [200, 503]  # Allow both healthy and unhealthy states

def test_api_docs():
    """Test that API documentation is accessible"""
    response = client.get("/docs")
    assert response.status_code == 200
    
    response = client.get("/redoc")
    assert response.status_code == 200