from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(
    prefix="/api/ratings",
    tags=["Рейтинги"]
)

@router.get("/")
async def get_ratings(db: Session = Depends(get_db)):
    return {"message": "Рейтинги работают"}