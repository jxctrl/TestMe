from __future__ import annotations

from pydantic import BaseModel


class AdminUserSummary(BaseModel):
    id: int
    username: str
    email: str
    created_at: str
    total_quizzes_taken: int
    best_score: int | None
