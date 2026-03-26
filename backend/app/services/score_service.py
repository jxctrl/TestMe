from __future__ import annotations

from collections import defaultdict
from datetime import UTC, datetime

from sqlalchemy import case, desc, distinct, func, select
from sqlalchemy.orm import Session

from app.models.score import Score
from app.models.user import User
from app.schemas.score import ScoreCreate
from app.schemas.user import ScoreHistoryItem, UserBestScore, UserProfileResponse, UserStats


def create_score(db: Session, user_id: int, payload: ScoreCreate) -> Score:
    score = Score(
        user_id=user_id,
        subject=payload.subject.strip().lower(),
        score=payload.score,
        mode=payload.mode,
    )
    db.add(score)
    db.commit()
    db.refresh(score)
    return score


def get_leaderboard(db: Session, mode: str | None, limit: int) -> list[dict[str, int | str]]:
    stmt = (
        select(
            User.id.label("user_id"),
            User.username.label("username"),
            func.sum(Score.score).label("total_score"),
            func.count(Score.id).label("completed_runs"),
        )
        .join(Score, Score.user_id == User.id)
        .group_by(User.id, User.username)
        .order_by(desc("total_score"), desc("completed_runs"), User.username.asc())
        .limit(limit)
    )

    if mode:
        stmt = stmt.where(Score.mode == mode)

    rows = db.execute(stmt).all()
    return [
        {
            "rank": index,
            "user_id": row.user_id,
            "username": row.username,
            "total_score": int(row.total_score or 0),
            "completed_runs": int(row.completed_runs or 0),
        }
        for index, row in enumerate(rows, start=1)
    ]


def get_stats(db: Session) -> dict[str, int | float]:
    today = datetime.now(UTC).replace(hour=0, minute=0, second=0, microsecond=0)

    total_quizzes_taken = db.scalar(select(func.count(Score.id))) or 0
    active_users_today = db.scalar(
        select(func.count(distinct(Score.user_id))).where(Score.completed_at >= today)
    ) or 0

    normalized_score = case(
        (Score.mode == "competition", (Score.score / 10000.0) * 100.0),
        else_=(Score.score / 10.0) * 100.0,
    )
    average_score = db.scalar(select(func.avg(normalized_score))) or 0.0

    return {
        "total_quizzes_taken": int(total_quizzes_taken),
        "average_score": round(float(average_score), 1),
        "active_users_today": int(active_users_today),
    }


def build_user_profile(db: Session, user: User, *, is_admin: bool) -> UserProfileResponse:
    rows = db.scalars(select(Score).where(Score.user_id == user.id).order_by(Score.completed_at.desc())).all()

    best_scores_map: dict[str, int] = defaultdict(int)
    history: list[ScoreHistoryItem] = []
    for score in rows:
        best_scores_map[score.subject] = max(best_scores_map[score.subject], score.score)
        history.append(
            ScoreHistoryItem(
                id=score.id,
                subject=score.subject,
                score=score.score,
                mode=score.mode,
                completed_at=score.completed_at,
            )
        )

    best_scores = [
        UserBestScore(subject=subject, best_score=best_score)
        for subject, best_score in sorted(best_scores_map.items())
    ]

    return UserProfileResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        created_at=user.created_at,
        is_admin=is_admin,
        avatar_url=user.avatar_url,
        stats=UserStats(total_quizzes_taken=len(history)),
        best_scores=best_scores,
        score_history=history,
    )
