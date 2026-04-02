from __future__ import annotations

from app.models.question import Question


def register_user(client, *, username: str, email: str, password: str = "password123") -> dict[str, object]:
    response = client.post(
        "/auth/register",
        json={
            "username": username,
            "email": email,
            "password": password,
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_fetch_questions_respects_language_and_requested_ids(client, db_session) -> None:
    first = Question(
        subject="math",
        question_text_en="What is 2 + 2?",
        question_text_uz="2 + 2 nechiga teng?",
        options_en=["1", "2", "3", "4"],
        options_uz=["1", "2", "3", "4"],
        correct_answer_index=3,
    )
    second = Question(
        subject="math",
        question_text_en="What is 5 x 5?",
        question_text_uz="5 x 5 nechiga teng?",
        options_en=["10", "15", "20", "25"],
        options_uz=["10", "15", "20", "25"],
        correct_answer_index=3,
    )
    db_session.add_all([first, second])
    db_session.commit()

    response = client.get(f"/questions/math?lang=uz&ids={second.id},{first.id}")
    assert response.status_code == 200, response.text

    payload = response.json()
    assert payload["subject"] == "math"
    assert payload["language"] == "uz"
    assert [question["id"] for question in payload["questions"]] == [second.id, first.id]
    assert payload["questions"][0]["question_text"] == "5 x 5 nechiga teng?"

    missing = client.get("/questions/history")
    assert missing.status_code == 404
    assert missing.json()["detail"] == "No questions found for that subject."


def test_score_submission_updates_stats_and_leaderboard(client) -> None:
    first_user = register_user(client, username="Alpha", email="alpha@example.com")
    second_user = register_user(client, username="Bravo", email="bravo@example.com")

    unauthorized = client.post(
        "/scores",
        json={"subject": "math", "score": 8, "mode": "practice"},
    )
    assert unauthorized.status_code == 401

    first_score = client.post(
        "/scores",
        json={"subject": "math", "score": 8, "mode": "practice"},
        headers=auth_headers(first_user["access_token"]),
    )
    assert first_score.status_code == 201, first_score.text

    second_score = client.post(
        "/scores",
        json={"subject": "science", "score": 9000, "mode": "competition"},
        headers=auth_headers(second_user["access_token"]),
    )
    assert second_score.status_code == 201, second_score.text

    stats = client.get("/stats")
    assert stats.status_code == 200, stats.text
    assert stats.json() == {
        "total_quizzes_taken": 2,
        "average_score": 85.0,
        "active_users_today": 2,
    }

    leaderboard = client.get("/leaderboard?mode=practice&limit=5")
    assert leaderboard.status_code == 200, leaderboard.text
    leaderboard_payload = leaderboard.json()
    assert leaderboard_payload["mode"] == "practice"
    assert leaderboard_payload["entries"] == [
        {
            "rank": 1,
            "user_id": first_user["user"]["id"],
            "username": "Alpha",
            "total_score": 8,
            "completed_runs": 1,
        }
    ]

    profile = client.get("/users/me", headers=auth_headers(first_user["access_token"]))
    assert profile.status_code == 200, profile.text
    profile_payload = profile.json()
    assert profile_payload["stats"]["total_quizzes_taken"] == 1
    assert profile_payload["best_scores"] == [{"subject": "math", "best_score": 8}]
    assert profile_payload["score_history"][0]["mode"] == "practice"
