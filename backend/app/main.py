from fastapi import FastAPI
from app.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth

# Создаём один раз!
app = FastAPI(title="Федерация спортивного программирования - API")

# Добавляем CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Лучше указать точный адрес, например: ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(auth.router, tags=["Аутентификация"])

# Создаём таблицы
Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    return {"message": "API федерации спортивного программирования работает"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
