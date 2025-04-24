import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from fastapi import HTTPException, status

from app.models.event import Event, EventStatus, Tag, event_participants
from app.models.user import User, UserRole
from app.models.profile import SponsorProfile
from app.schemas.event import EventCreate, EventUpdate, TagCreate


def get_tag_by_name(db: Session, name: str):
    """Получить тег по имени или создать новый"""
    tag = db.query(Tag).filter(func.lower(Tag.name) == name.lower()).first()
    if not tag:
        tag_id = str(uuid.uuid4())
        tag = Tag(id=tag_id, name=name)
        db.add(tag)
        db.commit()
        db.refresh(tag)
    return tag


def create_event(db: Session, event_data: EventCreate, organizer_id: str, image_filename=None, image_url=None) -> Event:
    """Создать новое мероприятие"""
    # Проверка на организатора
    user = db.query(User).filter(User.id == organizer_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if user.role != UserRole.SPONSOR:
        raise HTTPException(
            status_code=403,
            detail="Только организаторы могут создавать мероприятия"
        )

    # Создаем событие
    event_id = str(uuid.uuid4())
    db_event = Event(
        id=event_id,
        name=event_data.name,
        description=event_data.description,
        date=event_data.date,
        registration_deadline=event_data.registration_deadline,
        location=event_data.location,
        is_online=event_data.is_online,
        max_participants=event_data.max_participants,
        event_type=event_data.event_type,
        difficulty_level=event_data.difficulty_level,
        organizer_id=organizer_id,
        status=EventStatus.REGISTRATION,
        image_filename=image_filename,
        image_url=image_url
    )

    db.add(db_event)

    # Добавляем теги
    if event_data.tags:
        for tag_name in event_data.tags:
            tag = get_tag_by_name(db, tag_name)
            db_event.tags.append(tag)

    # Обновляем счетчик мероприятий в профиле организатора
    sponsor_profile = db.query(SponsorProfile).filter(SponsorProfile.user_id == organizer_id).first()
    if sponsor_profile:
        sponsor_profile.hosted_events_count += 1

    db.commit()
    db.refresh(db_event)
    return db_event


def get_event(db: Session, event_id: str) -> Event:
    """Получить мероприятие по ID"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=404,
            detail="Мероприятие не найдено"
        )

    # Ensure the organizer relationship is loaded
    if event.organizer is None:
        db.refresh(event)

    return event

def update_event(db: Session, event_id: str, event_data: EventUpdate, user_id: str) -> Event:
    """Обновить мероприятие"""
    event = get_event(db, event_id)

    # Проверка прав доступа
    if event.organizer_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="У вас нет прав на редактирование этого мероприятия"
        )

    # Обновляем поля
    update_data = event_data.dict(exclude_unset=True)

    # Обработка тегов отдельно
    if "tags" in update_data:
        tags = update_data.pop("tags")

        # Очищаем текущие теги
        event.tags = []

        # Добавляем новые теги
        if tags:
            for tag_name in tags:
                tag = get_tag_by_name(db, tag_name)
                event.tags.append(tag)

    # Обновляем остальные поля
    for key, value in update_data.items():
        setattr(event, key, value)

    db.commit()
    db.refresh(event)
    return event


def delete_event(db: Session, event_id: str, user_id: str) -> bool:
    """Удалить мероприятие"""
    event = get_event(db, event_id)

    # Проверка прав доступа
    if event.organizer_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="У вас нет прав на удаление этого мероприятия"
        )

    # Удаляем связанное изображение, если оно есть
    if event.image_filename:
        import os
        from pathlib import Path

        image_path = Path(f"uploads/events/{event.image_filename}")
        if image_path.exists():
            try:
                os.remove(image_path)
            except Exception as e:
                print(f"Ошибка при удалении изображения {event.image_filename}: {e}")

    # Обновляем счетчик мероприятий в профиле организатора
    sponsor_profile = db.query(SponsorProfile).filter(SponsorProfile.user_id == user_id).first()
    if sponsor_profile and sponsor_profile.hosted_events_count > 0:
        sponsor_profile.hosted_events_count -= 1

    db.delete(event)
    db.commit()
    return True


def get_events(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        status: Optional[EventStatus] = None,
        event_type: Optional[str] = None,
        difficulty_level: Optional[str] = None,
        search: Optional[str] = None,
        organizer_id: Optional[str] = None
) -> List[Event]:
    """Получить список мероприятий с фильтрами"""
    query = db.query(Event)

    # Применяем фильтры
    if status:
        query = query.filter(Event.status == status)

    if event_type:
        query = query.filter(Event.event_type == event_type)

    if difficulty_level:
        query = query.filter(Event.difficulty_level == difficulty_level)

    if search:
        query = query.filter(Event.name.ilike(f"%{search}%"))

    if organizer_id:
        query = query.filter(Event.organizer_id == organizer_id)

    # Сортируем по дате создания (новые в начале)
    query = query.order_by(desc(Event.created_at))

    # Пагинация
    events = query.offset(skip).limit(limit).all()
    return events


def register_for_event(db: Session, event_id: str, user_id: str) -> Dict[str, Any]:
    """Регистрация пользователя на мероприятие"""
    event = get_event(db, event_id)
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Проверки
    if event.status != EventStatus.REGISTRATION:
        raise HTTPException(
            status_code=400,
            detail="Регистрация на это мероприятие закрыта"
        )

    if event.current_participants >= event.max_participants:
        raise HTTPException(
            status_code=400,
            detail="Мероприятие уже заполнено"
        )

    # Проверяем, не зарегистрирован ли уже пользователь
    is_registered = db.query(event_participants).filter(
        event_participants.c.event_id == event_id,
        event_participants.c.user_id == user_id
    ).first()

    if is_registered:
        raise HTTPException(
            status_code=400,
            detail="Вы уже зарегистрированы на это мероприятие"
        )

    # Регистрируем пользователя
    event.participants.append(user)
    event.current_participants += 1

    db.commit()
    db.refresh(event)

    return {
        "success": True,
        "message": "Вы успешно зарегистрированы на мероприятие",
        "event_id": event_id,
        "event_name": event.name
    }


def unregister_from_event(db: Session, event_id: str, user_id: str) -> Dict[str, Any]:
    """Отмена регистрации пользователя на мероприятие"""
    event = get_event(db, event_id)

    # Проверяем регистрацию
    is_registered = db.query(event_participants).filter(
        event_participants.c.event_id == event_id,
        event_participants.c.user_id == user_id
    ).first()

    if not is_registered:
        raise HTTPException(
            status_code=400,
            detail="Вы не зарегистрированы на это мероприятие"
        )

    # Если мероприятие уже активно или завершено
    if event.status not in [EventStatus.REGISTRATION, EventStatus.ACTIVE]:
        raise HTTPException(
            status_code=400,
            detail="Нельзя отменить регистрацию на завершенное мероприятие"
        )

    # Удаляем регистрацию
    stmt = event_participants.delete().where(
        event_participants.c.event_id == event_id,
        event_participants.c.user_id == user_id
    )
    db.execute(stmt)

    # Уменьшаем счетчик
    event.current_participants -= 1

    db.commit()

    return {
        "success": True,
        "message": "Регистрация на мероприятие отменена",
        "event_id": event_id
    }


def get_event_participants(db: Session, event_id: str, skip: int = 0, limit: int = 100):
    """Получить список участников мероприятия"""
    event = get_event(db, event_id)

    # Получаем участников с пагинацией
    participants = db.query(User).join(
        event_participants,
        event_participants.c.user_id == User.id
    ).filter(
        event_participants.c.event_id == event_id
    ).offset(skip).limit(limit).all()

    return participants


def get_user_events(db: Session, user_id: str, skip: int = 0, limit: int = 20):
    """Получить мероприятия, на которые зарегистрирован пользователь"""
    events = db.query(Event).join(
        event_participants,
        event_participants.c.event_id == Event.id
    ).filter(
        event_participants.c.user_id == user_id
    ).order_by(Event.date).offset(skip).limit(limit).all()

    return events


def get_events_stats(db: Session) -> Dict[str, Any]:
    """Получить статистику по мероприятиям"""
    # Общее количество мероприятий
    total_events = db.query(func.count(Event.id)).scalar()

    # Активные мероприятия
    active_events = db.query(func.count(Event.id)).filter(
        Event.status == EventStatus.ACTIVE
    ).scalar()

    # Предстоящие мероприятия
    upcoming_events = db.query(func.count(Event.id)).filter(
        Event.date > datetime.now(),
        Event.status.in_([EventStatus.REGISTRATION, EventStatus.ACTIVE])
    ).scalar()

    # Популярные теги
    popular_tags_query = db.query(
        Tag.name,
        func.count(event_tags.c.event_id).label('event_count')
    ).join(
        Tag.events
    ).group_by(
        Tag.name
    ).order_by(
        desc('event_count')
    ).limit(5)

    popular_tags = [{"name": tag[0], "count": tag[1]} for tag in popular_tags_query]

    # Недавние мероприятия
    recent_events = db.query(Event).order_by(
        desc(Event.created_at)
    ).limit(5).all()

    return {
        "total_events": total_events,
        "active_events": active_events,
        "upcoming_events": upcoming_events,
        "popular_tags": popular_tags,
        "recent_events": recent_events
    }