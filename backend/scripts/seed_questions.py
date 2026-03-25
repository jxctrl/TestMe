from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = ROOT / "backend"
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.db.session import SessionLocal
from app.models.question import Question


def extract_questions() -> dict[str, dict[str, list[dict[str, object]]]]:
    quiz_js = (ROOT / "js" / "quiz.js").read_text(encoding="utf-8")
    if "const QUESTIONS = " not in quiz_js:
        quiz_js = subprocess.check_output(
            ["git", "show", "HEAD:js/quiz.js"],
            cwd=ROOT,
            text=True,
        )
    start = quiz_js.index("const QUESTIONS = ") + len("const QUESTIONS = ")
    end = quiz_js.index(";\n\nlet currentSubject")
    raw_object = quiz_js[start:end]
    json_like = re.sub(r'([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:', r'\1"\2":', raw_object)
    return json.loads(json_like)


def seed_questions(*, reset: bool = False) -> None:
    payload = extract_questions()
    db = SessionLocal()
    try:
        if reset:
            db.query(Question).delete()
            db.commit()

        if db.query(Question).count() > 0:
            print("Questions already exist. Use --reset to replace them.")
            return

        for subject, english_questions in payload["en"].items():
            uzbek_questions = payload["uz"][subject]
            for index, en_question in enumerate(english_questions):
                uz_question = uzbek_questions[index]
                db.add(
                    Question(
                        subject=subject,
                        question_text_en=en_question["q"],
                        question_text_uz=uz_question["q"],
                        options_en=en_question["options"],
                        options_uz=uz_question["options"],
                        correct_answer_index=en_question["answer"],
                    )
                )

        db.commit()
        print("Seeded questions successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed QuizArena questions from the existing frontend bank.")
    parser.add_argument("--reset", action="store_true", help="Delete existing questions before seeding.")
    args = parser.parse_args()
    seed_questions(reset=args.reset)
