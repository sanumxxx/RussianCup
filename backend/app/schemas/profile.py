from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# Базовые схемы
class ProfileBase(BaseModel):
    user_id: str

# Схемы для спортсмена
class SportsmanProfileCreate(ProfileBase):
    bio: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = 0

class SportsmanProfileUpdate(BaseModel):
    bio: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None

class SportsmanProfileResponse(ProfileBase):
    id: str
    rating: int
    completed_events: int
    wins: int
    bio: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Схемы для организатора
class SponsorProfileCreate(ProfileBase):
    organization_name: Optional[str] = None
    organization_description: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    website: Optional[str] = None

class SponsorProfileUpdate(BaseModel):
    organization_name: Optional[str] = None
    organization_description: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    website: Optional[str] = None

class SponsorProfileResponse(ProfileBase):
    id: str
    organization_name: Optional[str] = None
    organization_description: Optional[str] = None
    hosted_events_count: int
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Схемы для представителя региона
class RegionProfileCreate(ProfileBase):
    region_name: str
    region_code: Optional[str] = None
    population: Optional[int] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None

class RegionProfileUpdate(BaseModel):
    region_name: Optional[str] = None
    region_code: Optional[str] = None
    population: Optional[int] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None

class RegionProfileResponse(ProfileBase):
    id: str
    region_name: str
    region_code: Optional[str] = None
    population: Optional[int] = None
    team_members: int
    region_events_count: int
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Общая схема профиля для отправки клиенту
class UserProfileResponse(BaseModel):
    user_id: str
    full_name: str
    email: str
    role: str
    profile_data: dict
    created_at: datetime

    class Config:
        orm_mode = True