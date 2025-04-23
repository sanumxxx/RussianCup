from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from app.models.user import UserRole


class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    role: UserRole


class UserRegistration(UserBase):
    password: str = Field(..., min_length=8)

    @validator('password')
    def password_strength(cls, v):
        # Проверка сложности пароля
        if len(v) < 8:
            raise ValueError('Пароль должен содержать минимум 8 символов')

        has_upper = any(c.isupper() for c in v)
        has_lower = any(c.islower() for c in v)
        has_digit = any(c.isdigit() for c in v)

        if not (has_upper and has_lower and has_digit):
            raise ValueError('Пароль должен содержать заглавные, строчные буквы и цифры')

        return v



class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    role: UserRole
    created_at: datetime

    class Config:
        orm_mode = True



class Token(BaseModel):
    access_token: str
    token_type: str



class TokenPayload(BaseModel):
    sub: str
    role: str
    exp: Optional[int] = None  # expiration time