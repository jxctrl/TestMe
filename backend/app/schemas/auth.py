from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.user import UserPublic


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=8, max_length=255)


class LoginRequest(BaseModel):
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=8, max_length=255)


class GoogleAuthRequest(BaseModel):
    credential: str = Field(min_length=20)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic
