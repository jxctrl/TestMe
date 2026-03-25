from __future__ import annotations

from pydantic import BaseModel, Field


class QuestionResponse(BaseModel):
    id: int
    subject: str
    question_text: str
    options: list[str]
    correct_answer_index: int


class QuestionListResponse(BaseModel):
    subject: str
    language: str
    count: int
    questions: list[QuestionResponse]


class AdminQuestionCreate(BaseModel):
    subject: str = Field(min_length=2, max_length=50)
    question_text_en: str = Field(min_length=5)
    question_text_uz: str = Field(min_length=5)
    options_en: list[str] = Field(min_length=4, max_length=4)
    options_uz: list[str] = Field(min_length=4, max_length=4)
    correct_answer_index: int = Field(ge=0, le=3)


class AdminQuestionResponse(AdminQuestionCreate):
    id: int
