from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    created_at: datetime
    is_admin: bool = False


class UserBestScore(BaseModel):
    subject: str
    best_score: int


class ScoreHistoryItem(BaseModel):
    id: int
    subject: str
    score: int
    mode: str
    completed_at: datetime


class UserStats(BaseModel):
    total_quizzes_taken: int


class UserProfileResponse(UserPublic):
    stats: UserStats
    best_scores: list[UserBestScore]
    score_history: list[ScoreHistoryItem]
