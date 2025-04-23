from fastapi import FastAPI
from app.routers import auth
from app.database import Base, engine


Base.metadata.create_all(bind=engine)
app = FastAPI(title="Федерация спортивного программирования - API")
app.include_router(auth.router, tags=["Аутентификация"])


@app.get("/")
async def root():
    return {"message": "API федерации спортивного программирования работает"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)