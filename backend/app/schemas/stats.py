from __future__ import annotations

from pydantic import BaseModel


class StatsResponse(BaseModel):
    total_quizzes_taken: int
    average_score: float
    active_users_today: int
