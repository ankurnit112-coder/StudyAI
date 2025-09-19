import asyncio
import schedule
import time
from datetime import datetime
import logging
from typing import Dict
from app.ml.training_pipeline import run_training_job
from app.core.database import get_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TrainingScheduler:
    """Scheduler for automated ML model training"""
    
    def __init__(self):
        self.is_running = False
        self.last_training_result = None
    
    async def start_scheduler(self):
        """Start the training scheduler"""
        if self.is_running:
            logger.info("Training scheduler is already running")
            return
        
        self.is_running = True
        logger.info("Starting ML training scheduler...")
        
        # Schedule training jobs
        schedule.every().day.at("02:00").do(self._run_scheduled_training)  # Daily at 2 AM
        schedule.every().sunday.at("01:00").do(self._run_full_retraining)  # Weekly full retrain
        
        # Run initial training if needed
        await self._check_and_run_initial_training()
        
        # Start scheduler loop
        asyncio.create_task(self._scheduler_loop())
        
        logger.info("Training scheduler started successfully")
    
    async def _scheduler_loop(self):
        """Main scheduler loop"""
        while self.is_running:
            schedule.run_pending()
            await asyncio.sleep(60)  # Check every minute
    
    async def _check_and_run_initial_training(self):
        """Check if initial training is needed and run it"""
        try:
            db = next(get_db())
            from app.ml.training_pipeline import MLTrainingPipeline
            
            pipeline = MLTrainingPipeline(db)
            if pipeline.should_retrain():
                logger.info("Running initial model training...")
                result = await asyncio.get_event_loop().run_in_executor(
                    None, run_training_job
                )
                self.last_training_result = result
                logger.info(f"Initial training completed: {result['status']}")
            else:
                logger.info("Model is up to date, skipping initial training")
                
        except Exception as e:
            logger.error(f"Initial training check failed: {str(e)}")
        finally:
            db.close()
    
    def _run_scheduled_training(self):
        """Run scheduled training job"""
        logger.info("Running scheduled model training...")
        try:
            result = run_training_job()
            self.last_training_result = result
            logger.info(f"Scheduled training completed: {result['status']}")
        except Exception as e:
            logger.error(f"Scheduled training failed: {str(e)}")
    
    def _run_full_retraining(self):
        """Run full model retraining (weekly)"""
        logger.info("Running full model retraining...")
        try:
            result = run_training_job()
            self.last_training_result = result
            logger.info(f"Full retraining completed: {result['status']}")
        except Exception as e:
            logger.error(f"Full retraining failed: {str(e)}")
    
    def stop_scheduler(self):
        """Stop the training scheduler"""
        self.is_running = False
        schedule.clear()
        logger.info("Training scheduler stopped")
    
    def get_status(self) -> Dict:
        """Get scheduler status"""
        return {
            "is_running": self.is_running,
            "last_training_result": self.last_training_result,
            "next_scheduled_jobs": [str(job) for job in schedule.jobs],
            "current_time": datetime.now().isoformat()
        }

# Global scheduler instance
_scheduler = TrainingScheduler()

async def start_training_scheduler():
    """Start the global training scheduler"""
    await _scheduler.start_scheduler()

def stop_training_scheduler():
    """Stop the global training scheduler"""
    _scheduler.stop_scheduler()

def get_scheduler_status() -> Dict:
    """Get the status of the global scheduler"""
    return _scheduler.get_status()

def trigger_manual_training() -> Dict:
    """Manually trigger a training job"""
    logger.info("Manual training triggered")
    try:
        result = run_training_job()
        _scheduler.last_training_result = result
        return result
    except Exception as e:
        error_result = {"status": "failed", "reason": str(e)}
        _scheduler.last_training_result = error_result
        return error_result