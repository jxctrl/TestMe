from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserProfileResponse
from app.services.score_service import build_user_profile

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserProfileResponse)
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> UserProfileResponse:
    return build_user_profile(db, user, is_admin=settings.is_admin_email(user.email))
