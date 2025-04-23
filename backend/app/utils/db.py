from typing import Dict, Optional
from app.models.user import UserInDB


users_db: Dict[str, UserInDB] = {}

def get_user_by_email(email: str) -> Optional[UserInDB]:
    """Получение пользователя по email"""
    for user in users_db.values():
        if user.email == email:
            return user
    return None

def get_user_by_id(user_id: str) -> Optional[UserInDB]:
    """Получение пользователя по id"""
    return users_db.get(user_id)

def save_user(user: UserInDB) -> UserInDB:
    """Сохранение пользователя в 'базу данных'"""
    users_db[user.id] = user
    return user