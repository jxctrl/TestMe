from __future__ import annotations

import httpx

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token
from app.db.session import get_db
from app.schemas.auth import GoogleAuthRequest, LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserPublic
from app.services.auth_service import authenticate_google_user, authenticate_user, register_user, verify_google_credential

router = APIRouter(prefix="/auth", tags=["auth"])


def build_token_response(user) -> TokenResponse:
    access_token = create_access_token(str(user.id))
    return TokenResponse(
        access_token=access_token,
        user=UserPublic.model_validate(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at,
                "is_admin": settings.is_admin_email(user.email),
                "avatar_url": user.avatar_url,
            }
        ),
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    try:
        user = register_user(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return build_token_response(user)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = authenticate_user(db, payload)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    return build_token_response(user)


@router.post("/google", response_model=TokenResponse)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)) -> TokenResponse:
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google sign-in is not configured for this environment.",
        )

    try:
        google_profile = verify_google_credential(payload.credential, expected_client_id=settings.google_client_id)
        user = authenticate_google_user(
            db,
            email=google_profile["email"],
            display_name=google_profile["name"],
            avatar_url=google_profile["picture"] or None,
        )
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Google sign-in could not be verified right now. Please try again.",
        ) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return build_token_response(user)
