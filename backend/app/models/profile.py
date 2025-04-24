from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, DateTime, Text, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

# Модель спортсмена
class SportsmanProfile(Base):
    __tablename__ = "sportsman_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    rating = Column(Integer, default=0)
    completed_events = Column(Integer, default=0)
    wins = Column(Integer, default=0)
    bio = Column(Text, nullable=True)
    specialization = Column(String, nullable=True)
    experience_years = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<SportsmanProfile user_id={self.user_id}, rating={self.rating}>"

# Модель организатора
class SponsorProfile(Base):
    __tablename__ = "sponsor_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    organization_name = Column(String, nullable=True)
    organization_description = Column(Text, nullable=True)
    hosted_events_count = Column(Integer, default=0)
    contact_phone = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<SponsorProfile user_id={self.user_id}, organization={self.organization_name}>"

# Модель представителя региона
class RegionProfile(Base):
    __tablename__ = "region_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    region_name = Column(String, nullable=False)
    region_code = Column(String, nullable=True)
    population = Column(Integer, nullable=True)
    team_members = Column(Integer, default=0)
    region_events_count = Column(Integer, default=0)
    contact_phone = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<RegionProfile user_id={self.user_id}, region={self.region_name}>"