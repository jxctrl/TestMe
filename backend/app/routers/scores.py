from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.score import ScoreCreate, ScoreResponse
from app.services.score_service import create_score

router = APIRouter(tags=["scores"])


@router.post("/scores", response_model=ScoreResponse, status_code=status.HTTP_201_CREATED)
def submit_score(
    payload: ScoreCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ScoreResponse:
    score = create_score(db, user.id, payload)
    return ScoreResponse(
        id=score.id,
        user_id=score.user_id,
        subject=score.subject,
        score=score.score,
        mode=score.mode,
        completed_at=score.completed_at,
    )
