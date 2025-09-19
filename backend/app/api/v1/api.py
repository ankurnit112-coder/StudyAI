from fastapi import APIRouter
from app.api.v1.endpoints import predictions, training, students, academic_records

api_router = APIRouter()

api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(training.router, prefix="/training", tags=["training"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(academic_records.router, prefix="/academic-records", tags=["academic-records"])