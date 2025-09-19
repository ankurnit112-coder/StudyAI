#!/usr/bin/env python3
"""
Simple startup script for StudyAI Backend
"""

import uvicorn
import os
from app.main import app

if __name__ == "__main__":
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("DEBUG", "True").lower() == "true"
    
    print(f"Starting StudyAI Backend on {host}:{port}")
    print(f"Debug mode: {reload}")
    print("API Documentation available at:")
    print(f"  - Swagger UI: http://{host}:{port}/docs")
    print(f"  - ReDoc: http://{host}:{port}/redoc")
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )