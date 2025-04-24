from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models.event import EventStatus, EventType, DifficultyLevel


# Базовые схемы для тегов
class TagBase(BaseModel):
    name: str


class TagCreate(TagBase):
    pass


class TagResponse(TagBase):
    id: str

    class Config:
        orm_mode = True


# Базовые схемы для мероприятий
class EventBase(BaseModel):
    name: str
    description: Optional[str] = None
    date: datetime
    registration_deadline: Optional[datetime] = None
    location: Optional[str] = None
    is_online: bool = False
    max_participants: int = Field(100, ge=1)
    event_type: EventType = EventType.COMPETITION
    difficulty_level: DifficultyLevel = DifficultyLevel.MEDIUM
    image_url: Optional[str] = None

    @validator('registration_deadline')
    def deadline_must_be_before_date(cls, v, values):
        if v and 'date' in values and v > values['date']:
            raise ValueError('Дедлайн регистрации должен быть раньше даты мероприятия')
        return v


class EventCreate(EventBase):
    tags: List[str] = []


class EventUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    registration_deadline: Optional[datetime] = None
    location: Optional[str] = None
    is_online: Optional[bool] = None
    max_participants: Optional[int] = None
    event_type: Optional[EventType] = None
    difficulty_level: Optional[DifficultyLevel] = None
    status: Optional[EventStatus] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None

    @validator('max_participants')
    def max_participants_positive(cls, v):
        if v is not None and v < 1:
            raise ValueError('Максимальное количество участников должно быть положительным')
        return v

    @validator('registration_deadline')
    def deadline_must_be_before_date(cls, v, values):
        if v and 'date' in values and values['date'] and v > values['date']:
            raise ValueError('Дедлайн регистрации должен быть раньше даты мероприятия')
        return v


class EventResponse(EventBase):
    id: str
    organizer_id: str
    status: EventStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    current_participants: int
    tags: List[TagResponse] = []

    class Config:
        orm_mode = True


class EventDetailResponse(EventResponse):
    organizer: Optional[Dict[str, Any]] = None

    class Config:
        orm_mode = True

        @staticmethod
        def schema_extra(schema: Dict[str, Any], model) -> None:
            if "properties" in schema:
                schema["properties"]["organizer"] = {
                    "title": "Organizer",
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"},
                        "full_name": {"type": "string"},
                        "email": {"type": "string"},
                        "organization_name": {"type": "string"}
                    }
                }


# Схема для регистрации на мероприятие
class EventRegistration(BaseModel):
    event_id: str


# Схема для статистики мероприятий
class EventStats(BaseModel):
    total_events: int
    active_events: int
    upcoming_events: int
    popular_tags: List[Dict[str, Any]]
    recent_events: List[EventResponse]

    class Config:
        orm_mode = True