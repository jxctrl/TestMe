from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.stats import StatsResponse
from app.services.score_service import get_stats

router = APIRouter(tags=["stats"])


@router.get("/stats", response_model=StatsResponse)
def stats(db: Session = Depends(get_db)) -> StatsResponse:
    return StatsResponse(**get_stats(db))
