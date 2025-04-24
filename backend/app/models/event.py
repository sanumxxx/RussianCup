from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, DateTime, Text, Table, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base

# Таблица связи для участников мероприятия
event_participants = Table(
    "event_participants",
    Base.metadata,
    Column("event_id", String, ForeignKey("events.id"), primary_key=True),
    Column("user_id", String, ForeignKey("users.id"), primary_key=True),
    Column("registered_at", DateTime(timezone=True), server_default=func.now()),
    Column("status", String, default="registered"),  # registered, confirmed, cancelled
)

# Таблица связи для тегов мероприятия
event_tags = Table(
    "event_tags",
    Base.metadata,
    Column("event_id", String, ForeignKey("events.id"), primary_key=True),
    Column("tag_id", String, ForeignKey("tags.id"), primary_key=True),
)


class EventStatus(str, enum.Enum):
    DRAFT = "draft"
    REGISTRATION = "registration"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class EventType(str, enum.Enum):
    HACKATHON = "hackathon"
    COMPETITION = "competition"
    WORKSHOP = "workshop"
    MEETUP = "meetup"
    CONFERENCE = "conference"
    OTHER = "other"


class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    MEDIUM = "medium"
    ADVANCED = "advanced"
    EXPERT = "expert"


class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)

    # Даты
    date = Column(DateTime(timezone=True), nullable=False)
    registration_deadline = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Мета-информация
    location = Column(String, nullable=True)
    is_online = Column(Boolean, default=False)
    max_participants = Column(Integer, default=100)
    current_participants = Column(Integer, default=0)
    image_url = Column(String, nullable=True)
    image_filename = Column(String, nullable=True)  # Добавляем поле для хранения имени файла

    # Статус и тип
    status = Column(Enum(EventStatus), default=EventStatus.REGISTRATION)
    event_type = Column(Enum(EventType), default=EventType.COMPETITION)
    difficulty_level = Column(Enum(DifficultyLevel), default=DifficultyLevel.MEDIUM)

    # Связи с другими моделями
    organizer_id = Column(String, ForeignKey("users.id"), nullable=False)
    organizer = relationship("User", back_populates="organized_events")
    participants = relationship("User", secondary=event_participants, back_populates="participated_events")
    tags = relationship("Tag", secondary=event_tags, back_populates="events")

    def __repr__(self):
        return f"<Event {self.name}, status={self.status}, organizer_id={self.organizer_id}>"


class Tag(Base):
    __tablename__ = "tags"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    events = relationship("Event", secondary=event_tags, back_populates="tags")

    def __repr__(self):
        return f"<Tag {self.name}>"