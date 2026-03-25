from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.question import QuestionListResponse
from app.services.question_service import get_questions

router = APIRouter(tags=["questions"])


@router.get("/questions/{subject}", response_model=QuestionListResponse)
def fetch_questions(
    subject: str,
    lang: str = Query(default="en", pattern="^(en|uz)$"),
    limit: int = Query(default=10, ge=1, le=20),
    ids: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> QuestionListResponse:
    requested_ids = [int(item) for item in ids.split(",") if item.strip().isdigit()] if ids else None
    questions = get_questions(db, subject.strip().lower(), lang, limit=limit, ids=requested_ids)
    if not questions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No questions found for that subject.")
    return QuestionListResponse(subject=subject.strip().lower(), language=lang, count=len(questions), questions=questions)
