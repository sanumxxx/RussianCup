from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):

    APP_NAME: str = "Федерация спортивного программирования"
    SECRET_KEY: str = "your-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


    DATABASE_URL: Optional[str] = None

    class Config:
        env_file = ".env"



settings = Settings()