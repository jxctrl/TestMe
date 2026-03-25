from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import require_admin
from app.models.question import Question
from app.models.score import Score
from app.models.user import User
from app.schemas.admin import AdminUserSummary
from app.schemas.question import AdminQuestionCreate, AdminQuestionResponse
from app.services.question_service import create_question, list_questions

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/questions", response_model=list[AdminQuestionResponse])
def admin_list_questions(_: User = Depends(require_admin), db: Session = Depends(get_db)) -> list[AdminQuestionResponse]:
    questions = list_questions(db)
    return [
        AdminQuestionResponse(
            id=question.id,
            subject=question.subject,
            question_text_en=question.question_text_en,
            question_text_uz=question.question_text_uz,
            options_en=list(question.options_en),
            options_uz=list(question.options_uz),
            correct_answer_index=question.correct_answer_index,
        )
        for question in questions
    ]


@router.post("/questions", response_model=AdminQuestionResponse, status_code=status.HTTP_201_CREATED)
def admin_create_question(
    payload: AdminQuestionCreate,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminQuestionResponse:
    question = create_question(db, payload)
    return AdminQuestionResponse(
        id=question.id,
        subject=question.subject,
        question_text_en=question.question_text_en,
        question_text_uz=question.question_text_uz,
        options_en=list(question.options_en),
        options_uz=list(question.options_uz),
        correct_answer_index=question.correct_answer_index,
    )


@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_question(
    question_id: int,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> None:
    question = db.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found.")
    db.delete(question)
    db.commit()


@router.get("/users", response_model=list[AdminUserSummary])
def admin_list_users(_: User = Depends(require_admin), db: Session = Depends(get_db)) -> list[AdminUserSummary]:
    stmt = (
        select(
            User.id,
            User.username,
            User.email,
            User.created_at,
            func.count(Score.id).label("total_quizzes_taken"),
            func.max(Score.score).label("best_score"),
        )
        .outerjoin(Score, Score.user_id == User.id)
        .group_by(User.id, User.username, User.email, User.created_at)
        .order_by(User.created_at.desc())
    )
    rows = db.execute(stmt).all()
    return [
        AdminUserSummary(
            id=row.id,
            username=row.username,
            email=row.email,
            created_at=row.created_at.isoformat(),
            total_quizzes_taken=int(row.total_quizzes_taken or 0),
            best_score=int(row.best_score) if row.best_score is not None else None,
        )
        for row in rows
    ]
