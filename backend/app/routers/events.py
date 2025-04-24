from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File, Form
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
import shutil
import os
import uuid
from pathlib import Path

from app.database import get_db
from app.models.event import EventStatus, EventType, DifficultyLevel
from app.models.user import User, UserRole
from app.schemas.event import (
    EventCreate,
    EventUpdate,
    EventResponse,
    EventDetailResponse,
    EventStats
)
from app.services.event import (
    create_event,
    get_event,
    update_event,
    delete_event,
    get_events,
    register_for_event,
    unregister_from_event,
    get_event_participants,
    get_user_events,
    get_events_stats
)
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/api/events",
    tags=["События"]
)

# Создаем директорию для загруженных изображений
UPLOAD_DIR = Path("uploads/events")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_new_event(
        name: str = Form(...),
        description: Optional[str] = Form(None),
        date: str = Form(...),
        location: Optional[str] = Form(None),
        is_online: bool = Form(False),
        max_participants: int = Form(100),
        difficulty_level: DifficultyLevel = Form(DifficultyLevel.MEDIUM),
        event_type: EventType = Form(EventType.COMPETITION),
        image: Optional[UploadFile] = File(None),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Создание нового мероприятия (только для организаторов)"""
    if current_user.role != UserRole.SPONSOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только организаторы могут создавать мероприятия"
        )

    # Конвертируем дату из строки в datetime
    from datetime import datetime
    try:
        event_date = datetime.fromisoformat(date.replace('Z', '+00:00'))
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неверный формат даты. Используйте формат ISO (YYYY-MM-DD)"
        )

    # Обрабатываем загрузку изображения
    image_filename = None
    image_url = None

    if image:
        # Генерируем уникальное имя файла
        filename = f"{uuid.uuid4()}{os.path.splitext(image.filename)[1]}"
        image_path = UPLOAD_DIR / filename

        # Сохраняем файл
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # Формируем URL для изображения
        image_filename = filename
        image_url = f"/api/uploads/events/{filename}"

    # Создаем объект для передачи в сервис
    event_data = EventCreate(
        name=name,
        description=description,
        date=event_date,
        location=location,
        is_online=is_online,
        max_participants=max_participants,
        difficulty_level=difficulty_level,
        event_type=event_type,
        tags=[]  # Теги добавим отдельным запросом
    )

    # Вызываем сервис для создания события с дополнительными параметрами
    event = create_event(db, event_data, current_user.id, image_filename, image_url)

    return event


@router.get("", response_model=List[EventResponse])
async def read_events(
        skip: int = Query(0, ge=0),
        limit: int = Query(20, ge=1, le=100),
        status: Optional[EventStatus] = None,
        event_type: Optional[EventType] = None,
        difficulty_level: Optional[DifficultyLevel] = None,
        search: Optional[str] = None,
        organizer_id: Optional[str] = None,
        db: Session = Depends(get_db)
):
    """Получение списка мероприятий с фильтрацией"""
    return get_events(
        db,
        skip=skip,
        limit=limit,
        status=status,
        event_type=event_type,
        difficulty_level=difficulty_level,
        search=search,
        organizer_id=organizer_id
    )


@router.get("/stats", response_model=EventStats)
async def read_events_stats(
        db: Session = Depends(get_db)
):
    """Получение статистики по мероприятиям"""
    return get_events_stats(db)


@router.get("/my", response_model=List[EventResponse])
async def read_my_events(
        skip: int = Query(0, ge=0),
        limit: int = Query(20, ge=1, le=100),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Получение мероприятий текущего пользователя"""
    if current_user.role == UserRole.SPONSOR:
        # Для организаторов показываем созданные мероприятия
        return get_events(
            db,
            skip=skip,
            limit=limit,
            organizer_id=current_user.id
        )
    else:
        # Для спортсменов показываем мероприятия, на которые они зарегистрированы
        return get_user_events(db, current_user.id, skip, limit)


@router.get("/{event_id}", response_model=EventDetailResponse)
async def read_event(
        event_id: str,
        db: Session = Depends(get_db)
):
    """Получение информации о мероприятии по ID"""
    return get_event(db, event_id)


@router.put("/{event_id}", response_model=EventResponse)
async def update_event_details(
        event_id: str,
        event_data: EventUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Обновление информации о мероприятии (только для организатора)"""
    event = get_event(db, event_id)

    if event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только организатор может редактировать мероприятие"
        )

    return update_event(db, event_id, event_data, current_user.id)


@router.delete("/{event_id}", response_model=Dict[str, Any])
async def delete_event_by_id(
        event_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Удаление мероприятия (только для организатора)"""
    event = get_event(db, event_id)

    if event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только организатор может удалить мероприятие"
        )

    delete_event(db, event_id, current_user.id)

    return {
        "success": True,
        "message": "Мероприятие успешно удалено",
        "event_id": event_id
    }


@router.post("/{event_id}/register", response_model=Dict[str, Any])
async def register_user_for_event(
        event_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Регистрация пользователя на мероприятие"""
    if current_user.role != UserRole.SPORTSMAN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только спортсмены могут регистрироваться на мероприятия"
        )

    return register_for_event(db, event_id, current_user.id)


@router.delete("/{event_id}/register", response_model=Dict[str, Any])
async def unregister_user_from_event(
        event_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Отмена регистрации пользователя на мероприятие"""
    return unregister_from_event(db, event_id, current_user.id)


@router.get("/{event_id}/participants", response_model=List[Dict[str, Any]])
async def read_event_participants(
        event_id: str,
        skip: int = Query(0, ge=0),
        limit: int = Query(50, ge=1, le=200),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Получение списка участников мероприятия"""
    event = get_event(db, event_id)

    # Для публичных мероприятий показываем только количество
    is_organizer = event.organizer_id == current_user.id

    if not is_organizer and event.status == EventStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа к черновику мероприятия"
        )

    participants = get_event_participants(db, event_id, skip, limit)

    # Для организатора показываем полную информацию
    if is_organizer:
        return [
            {
                "id": participant.id,
                "full_name": participant.full_name,
                "email": participant.email,
                "role": participant.role
            }
            for participant in participants
        ]

    # Для остальных показываем только публичную информацию
    return [
        {
            "id": participant.id,
            "full_name": participant.full_name
        }
        for participant in participants
    ]