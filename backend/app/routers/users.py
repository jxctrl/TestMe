from __future__ import annotations

import base64

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserProfileResponse
from app.services.score_service import build_user_profile

router = APIRouter(prefix="/users", tags=["users"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_AVATAR_SIZE = 2 * 1024 * 1024  # 2 MB


class UsernameUpdate(BaseModel):
    username: str


@router.get("/me", response_model=UserProfileResponse)
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> UserProfileResponse:
    return build_user_profile(db, user, is_admin=settings.is_admin_email(user.email))


@router.patch("/me", response_model=UserProfileResponse)
def update_me(
    payload: UsernameUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserProfileResponse:
    username = payload.username.strip()
    if len(username) < 3:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username must be at least 3 characters.")
    if len(username) > 50:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username must be 50 characters or fewer.")

    from sqlalchemy import func, select
    from app.models.user import User as UserModel
    conflict = db.scalar(
        select(UserModel).where(
            func.lower(UserModel.username) == username.lower(),
            UserModel.id != user.id,
        )
    )
    if conflict:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="That username is already taken.")

    user.username = username
    db.commit()
    db.refresh(user)
    return build_user_profile(db, user, is_admin=settings.is_admin_email(user.email))


@router.post("/me/avatar", response_model=UserProfileResponse)
async def upload_avatar(
    avatar: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserProfileResponse:
    if avatar.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported image type: {avatar.content_type}. Use JPEG, PNG, WebP, or GIF.",
        )

    contents = await avatar.read()
    if len(contents) > MAX_AVATAR_SIZE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Avatar image must be under 2 MB.")

    b64 = base64.b64encode(contents).decode("utf-8")
    data_url = f"data:{avatar.content_type};base64,{b64}"

    user.avatar_url = data_url
    db.commit()
    db.refresh(user)
    return build_user_profile(db, user, is_admin=settings.is_admin_email(user.email))
