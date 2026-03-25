from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ScoreCreate(BaseModel):
    subject: str = Field(min_length=2, max_length=50)
    score: int = Field(ge=0)
    mode: Literal["practice", "competition"]


class ScoreResponse(BaseModel):
    id: int
    user_id: int
    subject: str
    score: int
    mode: str
    completed_at: datetime


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    username: str
    total_score: int
    completed_runs: int


class LeaderboardResponse(BaseModel):
    mode: str | None
    limit: int
    entries: list[LeaderboardEntry]
