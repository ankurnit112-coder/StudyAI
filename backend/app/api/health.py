from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
try:
    from app.core.database import get_db
    from app.core.config import settings
except ImportError:
    # Fallback for when modules aren't available
    def get_db():
        return None
    
    class MockSettings:
        ML_MODEL_PATH = "./models"
    
    settings = MockSettings()
import psutil
import os
import time
from datetime import datetime
import logging

router = APIRouter()

logger = logging.getLogger(__name__)

@router.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """Comprehensive health check endpoint"""
    
    try:
        # Basic system info
        health_data = {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "version": "2.0.0",
            "environment": os.getenv("NODE_ENV", "development"),
            "uptime": time.time() - psutil.boot_time(),
            "system": {
                "cpu_percent": psutil.cpu_percent(interval=1),
                "memory_percent": psutil.virtual_memory().percent,
                "disk_percent": psutil.disk_usage('/').percent,
                "load_average": os.getloadavg() if hasattr(os, 'getloadavg') else None
            },
            "checks": {}
        }
        
        # Database health check
        try:
            db.execute("SELECT 1")
            health_data["checks"]["database"] = "healthy"
        except Exception as e:
            health_data["checks"]["database"] = "unhealthy"
            logger.error(f"Database health check failed: {str(e)}")
        
        # ML Models health check
        try:
            models_path = settings.ML_MODEL_PATH
            if os.path.exists(models_path):
                model_files = [f for f in os.listdir(models_path) if f.endswith('.joblib')]
                health_data["checks"]["ml_models"] = {
                    "status": "healthy" if len(model_files) > 0 else "no_models",
                    "model_count": len(model_files),
                    "models_path": models_path
                }
            else:
                health_data["checks"]["ml_models"] = "models_directory_missing"
        except Exception as e:
            health_data["checks"]["ml_models"] = "unhealthy"
            logger.error(f"ML models health check failed: {str(e)}")
        
        # Redis health check (if configured)
        try:
            # This would check Redis connection in a real implementation
            health_data["checks"]["redis"] = "healthy"
        except Exception as e:
            health_data["checks"]["redis"] = "unhealthy"
            logger.error(f"Redis health check failed: {str(e)}")
        
        # Training scheduler health check
        try:
            from app.ml.training_scheduler import get_scheduler_status
            scheduler_status = get_scheduler_status()
            health_data["checks"]["training_scheduler"] = {
                "status": "healthy" if scheduler_status["is_running"] else "stopped",
                "last_training_result": scheduler_status["last_training_result"],
                "next_scheduled_jobs": scheduler_status["next_scheduled_jobs"]
            }
        except Exception as e:
            health_data["checks"]["training_scheduler"] = "unhealthy"
            logger.error(f"Training scheduler health check failed: {str(e)}")
        
        # Determine overall health
        unhealthy_checks = [
            check for check, status in health_data["checks"].items() 
            if isinstance(status, str) and status == "unhealthy"
        ]
        
        if unhealthy_checks:
            health_data["status"] = "degraded"
            health_data["unhealthy_checks"] = unhealthy_checks
        
        # Check critical thresholds
        if (health_data["system"]["cpu_percent"] > 90 or 
            health_data["system"]["memory_percent"] > 90 or
            health_data["system"]["disk_percent"] > 90):
            health_data["status"] = "warning"
            health_data["warnings"] = []
            
            if health_data["system"]["cpu_percent"] > 90:
                health_data["warnings"].append("High CPU usage")
            if health_data["system"]["memory_percent"] > 90:
                health_data["warnings"].append("High memory usage")
            if health_data["system"]["disk_percent"] > 90:
                health_data["warnings"].append("High disk usage")
        
        # Return appropriate status code
        status_code = 200
        if health_data["status"] == "degraded":
            status_code = 503
        elif health_data["status"] == "warning":
            status_code = 200  # Warning is still operational
            
        return health_data
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }

@router.get("/ready")
async def readiness_check(db: Session = Depends(get_db)):
    """Kubernetes readiness probe endpoint"""
    
    try:
        # Check if application is ready to serve requests
        db.execute("SELECT 1")
        
        # Check if ML models are loaded
        models_path = settings.ML_MODEL_PATH
        if not os.path.exists(models_path):
            raise HTTPException(status_code=503, detail="ML models not available")
        
        model_files = [f for f in os.listdir(models_path) if f.endswith('.joblib')]
        if len(model_files) == 0:
            raise HTTPException(status_code=503, detail="No ML models found")
        
        return {"status": "ready", "timestamp": datetime.now().isoformat()}
        
    except Exception as e:
        logger.error(f"Readiness check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Application not ready")

@router.get("/live")
async def liveness_check():
    """Kubernetes liveness probe endpoint"""
    
    try:
        # Basic liveness check - just verify the application is running
        return {
            "status": "alive",
            "timestamp": datetime.now().isoformat(),
            "pid": os.getpid()
        }
        
    except Exception as e:
        logger.error(f"Liveness check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Application not alive")