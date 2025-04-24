import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User, UserRole
from app.models.profile import SportsmanProfile, SponsorProfile, RegionProfile
from app.schemas.profile import (
    SportsmanProfileCreate, SportsmanProfileUpdate,
    SponsorProfileCreate, SponsorProfileUpdate,
    RegionProfileCreate, RegionProfileUpdate
)


# Функции для профиля спортсмена
def create_sportsman_profile(db: Session, profile_data: SportsmanProfileCreate) -> SportsmanProfile:
    """Создание профиля спортсмена"""
    user = db.query(User).filter(User.id == profile_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if user.role != UserRole.SPORTSMAN:
        raise HTTPException(status_code=400, detail="Роль пользователя не соответствует типу профиля")

    existing_profile = db.query(SportsmanProfile).filter(SportsmanProfile.user_id == profile_data.user_id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Профиль для этого пользователя уже существует")

    profile_id = str(uuid.uuid4())
    db_profile = SportsmanProfile(
        id=profile_id,
        user_id=profile_data.user_id,
        bio=profile_data.bio,
        specialization=profile_data.specialization,
        experience_years=profile_data.experience_years,
        rating=0,
        completed_events=0,
        wins=0
    )

    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def get_sportsman_profile(db: Session, user_id: str) -> SportsmanProfile:
    """Получение профиля спортсмена"""
    profile = db.query(SportsmanProfile).filter(SportsmanProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Профиль спортсмена не найден")
    return profile


def update_sportsman_profile(db: Session, user_id: str, profile_data: SportsmanProfileUpdate) -> SportsmanProfile:
    """Обновление профиля спортсмена"""
    profile = get_sportsman_profile(db, user_id)

    update_data = profile_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile


# Функции для профиля организатора
def create_sponsor_profile(db: Session, profile_data: SponsorProfileCreate) -> SponsorProfile:
    """Создание профиля организатора"""
    user = db.query(User).filter(User.id == profile_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if user.role != UserRole.SPONSOR:
        raise HTTPException(status_code=400, detail="Роль пользователя не соответствует типу профиля")

    existing_profile = db.query(SponsorProfile).filter(SponsorProfile.user_id == profile_data.user_id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Профиль для этого пользователя уже существует")

    profile_id = str(uuid.uuid4())
    db_profile = SponsorProfile(
        id=profile_id,
        user_id=profile_data.user_id,
        organization_name=profile_data.organization_name,
        organization_description=profile_data.organization_description,
        contact_phone=profile_data.contact_phone,
        contact_email=profile_data.contact_email,
        website=profile_data.website,
        hosted_events_count=0
    )

    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def get_sponsor_profile(db: Session, user_id: str) -> SponsorProfile:
    """Получение профиля организатора"""
    profile = db.query(SponsorProfile).filter(SponsorProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Профиль организатора не найден")
    return profile


def update_sponsor_profile(db: Session, user_id: str, profile_data: SponsorProfileUpdate) -> SponsorProfile:
    """Обновление профиля организатора"""
    profile = get_sponsor_profile(db, user_id)

    update_data = profile_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile


# Функции для профиля региона
def create_region_profile(db: Session, profile_data: RegionProfileCreate) -> RegionProfile:
    """Создание профиля региона"""
    user = db.query(User).filter(User.id == profile_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if user.role != UserRole.REGION:
        raise HTTPException(status_code=400, detail="Роль пользователя не соответствует типу профиля")

    existing_profile = db.query(RegionProfile).filter(RegionProfile.user_id == profile_data.user_id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Профиль для этого пользователя уже существует")

    profile_id = str(uuid.uuid4())
    db_profile = RegionProfile(
        id=profile_id,
        user_id=profile_data.user_id,
        region_name=profile_data.region_name,
        region_code=profile_data.region_code,
        population=profile_data.population,
        contact_phone=profile_data.contact_phone,
        contact_email=profile_data.contact_email,
        team_members=0,
        region_events_count=0
    )

    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def get_region_profile(db: Session, user_id: str) -> RegionProfile:
    """Получение профиля региона"""
    profile = db.query(RegionProfile).filter(RegionProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Профиль региона не найден")
    return profile


def update_region_profile(db: Session, user_id: str, profile_data: RegionProfileUpdate) -> RegionProfile:
    """Обновление профиля региона"""
    profile = get_region_profile(db, user_id)

    update_data = profile_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile


# Общие функции для профилей
def get_user_profile(db: Session, user_id: str):
    """Получение профиля пользователя на основе его роли"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    profile_data = {}

    if user.role == UserRole.SPORTSMAN:
        profile = db.query(SportsmanProfile).filter(SportsmanProfile.user_id == user_id).first()
        if profile:
            profile_data = {
                "bio": profile.bio,
                "specialization": profile.specialization,
                "experience_years": profile.experience_years,
                "rating": profile.rating,
                "completed_events": profile.completed_events,
                "wins": profile.wins
            }
    elif user.role == UserRole.SPONSOR:
        profile = db.query(SponsorProfile).filter(SponsorProfile.user_id == user_id).first()
        if profile:
            profile_data = {
                "organization_name": profile.organization_name,
                "organization_description": profile.organization_description,
                "contact_phone": profile.contact_phone,
                "contact_email": profile.contact_email,
                "website": profile.website,
                "hosted_events_count": profile.hosted_events_count
            }
    elif user.role == UserRole.REGION:
        profile = db.query(RegionProfile).filter(RegionProfile.user_id == user_id).first()
        if profile:
            profile_data = {
                "region_name": profile.region_name,
                "region_code": profile.region_code,
                "population": profile.population,
                "team_members": profile.team_members,
                "region_events_count": profile.region_events_count,
                "contact_phone": profile.contact_phone,
                "contact_email": profile.contact_email
            }

    return {
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role.value,
        "profile_data": profile_data,
        "created_at": user.created_at
    }


def create_profile_after_registration(db: Session, user_id: str, role: UserRole):
    """Создает базовый профиль после регистрации пользователя"""
    try:
        if role == UserRole.SPORTSMAN:
            create_sportsman_profile(db, SportsmanProfileCreate(user_id=user_id))
        elif role == UserRole.SPONSOR:
            create_sponsor_profile(db, SponsorProfileCreate(user_id=user_id))
        elif role == UserRole.REGION:
            # Для региона требуется указать название региона, поэтому
            # нужно будет создать профиль позже с правильными данными
            pass
    except HTTPException as e:
        # Не выбрасываем исключение, чтобы не прерывать регистрацию,
        # если профиль не удалось создать
        print(f"Ошибка при создании профиля: {e.detail}")
        pass