from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.schemas.profile import (
    SportsmanProfileUpdate, SponsorProfileUpdate, RegionProfileUpdate,
    SportsmanProfileResponse, SponsorProfileResponse, RegionProfileResponse,
    UserProfileResponse
)
from app.services.profile import (
    get_sportsman_profile, update_sportsman_profile,
    get_sponsor_profile, update_sponsor_profile,
    get_region_profile, update_region_profile,
    get_user_profile
)
from app.utils.auth import get_current_user
from app.models.user import User, UserRole

router = APIRouter(prefix="/api/profiles", tags=["Профили"])


@router.get("/me", response_model=Dict[str, Any])
async def get_my_profile(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Получение профиля текущего пользователя"""
    return get_user_profile(db, current_user.id)


@router.get("/{user_id}", response_model=Dict[str, Any])
async def get_profile(
        user_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Получение профиля пользователя по ID"""
    return get_user_profile(db, user_id)


@router.put("/sportsman", response_model=SportsmanProfileResponse)
async def update_my_sportsman_profile(
        profile_data: SportsmanProfileUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Обновление профиля спортсмена для текущего пользователя"""
    if current_user.role != UserRole.SPORTSMAN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен. Профиль только для спортсмена."
        )

    return update_sportsman_profile(db, current_user.id, profile_data)


@router.put("/sponsor", response_model=SponsorProfileResponse)
async def update_my_sponsor_profile(
        profile_data: SponsorProfileUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Обновление профиля организатора для текущего пользователя"""
    if current_user.role != UserRole.SPONSOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен. Профиль только для организатора."
        )

    return update_sponsor_profile(db, current_user.id, profile_data)


@router.put("/region", response_model=RegionProfileResponse)
async def update_my_region_profile(
        profile_data: RegionProfileUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Обновление профиля представителя региона для текущего пользователя"""
    if current_user.role != UserRole.REGION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен. Профиль только для представителя региона."
        )

    return update_region_profile(db, current_user.id, profile_data)