from fastapi import FastAPI
from app.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os
from app.routers import auth, ratings, profiles, events

# Импортируем все модели для создания таблиц
from app.models.user import User
from app.models.profile import SportsmanProfile, SponsorProfile, RegionProfile
from app.models.event import Event, Tag, event_participants, event_tags

# Создаём один раз!
app = FastAPI(title="Федерация спортивного программирования - API")

# Добавляем CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(auth.router, tags=["Аутентификация"])
app.include_router(ratings.router, tags=["Рейтинг"])
app.include_router(profiles.router, tags=["Профили"])
app.include_router(events.router, tags=["События"])

# Создаём директорию для загрузок, если ещё не создана
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)
events_uploads_dir = uploads_dir / "events"
events_uploads_dir.mkdir(exist_ok=True)

# Монтируем статические файлы
app.mount("/api/uploads", StaticFiles(directory="uploads"), name="uploads")

# Создаём таблицы
print("Создание таблиц в базе данных...")
Base.metadata.create_all(bind=engine)
print("Таблицы успешно созданы")


@app.get("/")
async def root():
    return {"message": "API федерации спортивного программирования работает"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)