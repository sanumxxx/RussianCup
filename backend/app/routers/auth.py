from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from sqlalchemy.orm import Session
from app.schemas.user import UserRegistration, Token
from app.services.user import register_new_user, get_user_by_email
from app.utils.auth import create_access_token, get_current_user
from app.utils.hashing import verify_password  # Импорт из нового модуля
from app.config import settings
from app.database import get_db
from app.models.user import User

router = APIRouter(prefix="/api")


@router.post("/register", response_model=dict)
async def register_user(user_data: UserRegistration, db: Session = Depends(get_db)):
    user = register_new_user(db, user_data)

    # После успешной регистрации сразу создаем токен для пользователя
    access_token = create_access_token(
        data={"sub": user.id, "role": user.role.value},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "success": True,
        "message": "Пользователь успешно зарегистрирован",
        "user_id": user.id,
        "role": user.role.value,
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": user.id, "role": user.role.value},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=dict)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role.value,
        "is_active": current_user.is_active
    }