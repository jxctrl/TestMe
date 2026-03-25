from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.question import Question
from app.schemas.question import AdminQuestionCreate, QuestionResponse


def serialize_question(question: Question, language: str) -> QuestionResponse:
    if language == "uz":
        return QuestionResponse(
            id=question.id,
            subject=question.subject,
            question_text=question.question_text_uz,
            options=list(question.options_uz),
            correct_answer_index=question.correct_answer_index,
        )

    return QuestionResponse(
        id=question.id,
        subject=question.subject,
        question_text=question.question_text_en,
        options=list(question.options_en),
        correct_answer_index=question.correct_answer_index,
    )


def get_questions(
    db: Session,
    subject: str,
    language: str,
    *,
    limit: int = 10,
    ids: list[int] | None = None,
) -> list[QuestionResponse]:
    stmt = select(Question)
    if subject != "all":
        stmt = stmt.where(Question.subject == subject)

    if ids:
        stmt = stmt.where(Question.id.in_(ids))
        rows = db.scalars(stmt).all()
        question_map = {question.id: question for question in rows}
        ordered_questions = [question_map[question_id] for question_id in ids if question_id in question_map]
        return [serialize_question(question, language) for question in ordered_questions]

    stmt = stmt.order_by(func.random()).limit(limit)
    questions = db.scalars(stmt).all()
    return [serialize_question(question, language) for question in questions]


def create_question(db: Session, payload: AdminQuestionCreate) -> Question:
    question = Question(
        subject=payload.subject.strip().lower(),
        question_text_en=payload.question_text_en.strip(),
        question_text_uz=payload.question_text_uz.strip(),
        options_en=[option.strip() for option in payload.options_en],
        options_uz=[option.strip() for option in payload.options_uz],
        correct_answer_index=payload.correct_answer_index,
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


def list_questions(db: Session) -> list[Question]:
    return db.scalars(select(Question).order_by(Question.subject.asc(), Question.id.asc())).all()
