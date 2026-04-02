from __future__ import annotations

import secrets

import httpx
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest

GOOGLE_TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo"


def register_user(db: Session, payload: RegisterRequest) -> User:
    username = payload.username.strip()
    email = payload.email.strip().lower()

    existing_user = db.scalar(
        select(User).where((func.lower(User.email) == email) | (func.lower(User.username) == username.lower()))
    )
    if existing_user:
        raise ValueError("A user with that email or username already exists.")

    user = User(username=username, email=email, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, payload: LoginRequest) -> User | None:
    email = payload.email.strip().lower()
    user = db.scalar(select(User).where(func.lower(User.email) == email))
    if not user:
        return None
    if not verify_password(payload.password, user.password_hash):
        return None
    return user


def verify_google_credential(credential: str, *, expected_client_id: str) -> dict[str, str]:
    response = httpx.get(
        GOOGLE_TOKENINFO_URL,
        params={"id_token": credential},
        timeout=10.0,
    )
    response.raise_for_status()
    payload = response.json()

    if payload.get("aud") != expected_client_id:
        raise ValueError("This Google sign-in token was issued for a different app.")
    if payload.get("email_verified") not in {"true", True}:
        raise ValueError("Your Google account email is not verified.")

    email = str(payload.get("email", "")).strip().lower()
    if not email:
        raise ValueError("Google did not provide an email address.")

    display_name = str(payload.get("name") or payload.get("given_name") or "").strip()
    return {
        "email": email,
        "name": display_name,
        "picture": str(payload.get("picture") or "").strip(),
    }


def _build_username(db: Session, preferred_name: str, email: str) -> str:
    base_username = preferred_name or email.split("@", maxsplit=1)[0] or "player"
    sanitized = "".join(char for char in base_username if char.isalnum() or char in {"_", "-"}).strip("_-")
    candidate = sanitized[:50] or "player"
    suffix = 1

    while db.scalar(select(User.id).where(func.lower(User.username) == candidate.lower())):
        suffix_text = str(suffix)
        candidate = f"{(sanitized[: max(1, 50 - len(suffix_text) - 1)] or 'player')}_{suffix_text}"
        suffix += 1

    return candidate


def authenticate_google_user(
    db: Session,
    *,
    email: str,
    display_name: str,
    avatar_url: str | None = None,
) -> User:
    existing_user = db.scalar(select(User).where(func.lower(User.email) == email.lower()))
    if existing_user:
        if avatar_url and existing_user.avatar_url != avatar_url:
            existing_user.avatar_url = avatar_url
            db.commit()
            db.refresh(existing_user)
        return existing_user

    user = User(
        username=_build_username(db, display_name, email),
        email=email.lower(),
        password_hash=hash_password(secrets.token_urlsafe(32)),
        avatar_url=avatar_url or None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
