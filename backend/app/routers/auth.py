from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from sqlalchemy.orm import Session

from app.schemas.user import UserRegistration, UserResponse, Token
from app.services.user import register_new_user, get_user_by_email
from app.utils.auth import create_access_token, verify_password
from app.config import settings
from app.database import get_db

router = APIRouter(prefix="/api")


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")


@router.post("/register", response_model=dict)
async def register_user(user_data: UserRegistration, db: Session = Depends(get_db)):
    """Регистрация нового пользователя"""
    user = register_new_user(db, user_data)

    return {
        "success": True,
        "message": "Пользователь успешно зарегистрирован",
        "user_id": user.id
    }


@router.post("/token", response_model=Token)
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):
    """Получение токена доступа"""
    user = get_user_by_email(db, form_data.username)  #

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "role": user.role.value},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}