from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/studyai_db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # ML Settings
    ML_MODEL_PATH: str = "models/"
    TRAINING_DATA_PATH: str = "data/"
    MIN_TRAINING_SAMPLES: int = 1000
    MODEL_RETRAIN_THRESHOLD: float = 0.85  # Retrain if accuracy drops below this
    
    # Application Settings
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    AUTO_TRAINING_ENABLED: bool = True
    
    # CBSE Specific
    CBSE_SUBJECTS: List[str] = [
        "Mathematics", "Physics", "Chemistry", "Biology", 
        "English", "Hindi", "Computer Science", "Physical Education",
        "Economics", "Business Studies", "Accountancy", 
        "Political Science", "History", "Geography"
    ]
    
    CBSE_CLASSES: List[int] = [9, 10, 11, 12]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Override with defaults if parsing from env fails
        if not self.CBSE_SUBJECTS:
            self.CBSE_SUBJECTS = [
                "Mathematics", "Physics", "Chemistry", "Biology", 
                "English", "Hindi", "Computer Science", "Physical Education",
                "Economics", "Business Studies", "Accountancy", 
                "Political Science", "History", "Geography"
            ]
        if not self.CBSE_CLASSES:
            self.CBSE_CLASSES = [9, 10, 11, 12]
    
    class Config:
        env_file = ".env"

settings = Settings()