from datetime import datetime
import uuid
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserRegistration
from app.models.user import User
from app.utils.auth import get_password_hash


def get_user_by_email(db: Session, email: str):
    """Получение пользователя по email"""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: str):
    """Получение пользователя по id"""
    return db.query(User).filter(User.id == user_id).first()


def register_new_user(db: Session, user_data: UserRegistration) -> User:
    """Регистрация нового пользователя"""
    # Проверка, существует ли пользователь с таким email
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Пользователь с таким email уже существует"
        )


    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_data.password)

    # Создание пользователя в БД
    db_user = User(
        id=user_id,
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed_password,
        role=user_data.role
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user