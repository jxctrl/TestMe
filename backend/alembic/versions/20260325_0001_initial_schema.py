"""Initial schema for QuizArena."""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20260325_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_users_id", "users", ["id"])
    op.create_index("ix_users_username", "users", ["username"], unique=True)
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "questions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("subject", sa.String(length=50), nullable=False),
        sa.Column("question_text_en", sa.Text(), nullable=False),
        sa.Column("question_text_uz", sa.Text(), nullable=False),
        sa.Column("options_en", sa.JSON(), nullable=False),
        sa.Column("options_uz", sa.JSON(), nullable=False),
        sa.Column("correct_answer_index", sa.Integer(), nullable=False),
    )
    op.create_index("ix_questions_id", "questions", ["id"])
    op.create_index("ix_questions_subject", "questions", ["subject"])

    op.create_table(
        "scores",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("subject", sa.String(length=50), nullable=False),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column("mode", sa.String(length=20), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_scores_id", "scores", ["id"])
    op.create_index("ix_scores_user_id", "scores", ["user_id"])
    op.create_index("ix_scores_subject", "scores", ["subject"])
    op.create_index("ix_scores_mode", "scores", ["mode"])


def downgrade() -> None:
    op.drop_index("ix_scores_mode", table_name="scores")
    op.drop_index("ix_scores_subject", table_name="scores")
    op.drop_index("ix_scores_user_id", table_name="scores")
    op.drop_index("ix_scores_id", table_name="scores")
    op.drop_table("scores")

    op.drop_index("ix_questions_subject", table_name="questions")
    op.drop_index("ix_questions_id", table_name="questions")
    op.drop_table("questions")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_username", table_name="users")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_table("users")
