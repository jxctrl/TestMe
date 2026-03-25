from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.score import LeaderboardEntry, LeaderboardResponse
from app.services.score_service import get_leaderboard

router = APIRouter(tags=["leaderboard"])


@router.get("/leaderboard", response_model=LeaderboardResponse)
def leaderboard(
    mode: str | None = Query(default=None),
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
) -> LeaderboardResponse:
    entries = [LeaderboardEntry(**row) for row in get_leaderboard(db, mode=mode, limit=limit)]
    return LeaderboardResponse(mode=mode, limit=limit, entries=entries)
