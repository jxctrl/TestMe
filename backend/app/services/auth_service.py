from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest


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
