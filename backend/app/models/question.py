from __future__ import annotations

from sqlalchemy import Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    subject: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    question_text_en: Mapped[str] = mapped_column(Text, nullable=False)
    question_text_uz: Mapped[str] = mapped_column(Text, nullable=False)
    options_en: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    options_uz: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    correct_answer_index: Mapped[int] = mapped_column(Integer, nullable=False)
