from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import os

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.api import api_router
from app.ml.training_scheduler import start_training_scheduler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting StudyAI Backend...")
    
    # Create database tables
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
    
    # Create ML models directory
    os.makedirs(settings.ML_MODEL_PATH, exist_ok=True)
    logger.info(f"ML models directory created: {settings.ML_MODEL_PATH}")
    
    # Start training scheduler
    try:
        await start_training_scheduler()
        logger.info("Training scheduler started successfully")
    except Exception as e:
        logger.error(f"Error starting training scheduler: {str(e)}")
    
    logger.info("StudyAI Backend startup complete")
    
    yield
    
    # Shutdown
    logger.info("Shutting down StudyAI Backend...")

# Create FastAPI app
app = FastAPI(
    title="StudyAI Backend",
    description="AI-powered CBSE board exam prediction system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Include health check routes
try:
    from app.api.health import router as health_router
    app.include_router(health_router, tags=["health"])
except ImportError:
    logger.warning("Health check routes not available")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "StudyAI Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        from app.core.database import get_db
        db = next(get_db())
        db.execute("SELECT 1")
        db.close()
        
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service unhealthy")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )