from sqlalchemy import Column, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class UserRole(str, enum.Enum):
    SPORTSMAN = "sportsman"
    REGION = "region"
    SPONSOR = "sponsor"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(UserRole))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Связи с мероприятиями
    organized_events = relationship("Event", back_populates="organizer")
    participated_events = relationship("Event", secondary="event_participants", back_populates="participants")

    def __repr__(self):
        return f"<User {self.email}>"