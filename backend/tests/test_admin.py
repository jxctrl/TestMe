from __future__ import annotations

from app.core.config import settings


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


def test_admin_routes_require_admin_and_manage_questions(client) -> None:
    regular_user = register_user(client, username="Learner", email="learner@example.com")
    forbidden = client.get("/admin/questions", headers=auth_headers(regular_user["access_token"]))
    assert forbidden.status_code == 403
    assert forbidden.json()["detail"] == "Admin access required."

    admin_user = register_user(client, username="AdminUser", email=settings.admin_emails[0])

    payload = {
        "subject": "history",
        "question_text_en": "Who built the pyramids?",
        "question_text_uz": "Piramidalarni kim qurgan?",
        "options_en": ["Romans", "Egyptians", "Greeks", "Persians"],
        "options_uz": ["Rimliklar", "Misrliklar", "Yunonlar", "Forslar"],
        "correct_answer_index": 1,
    }

    created = client.post(
        "/admin/questions",
        json=payload,
        headers=auth_headers(admin_user["access_token"]),
    )
    assert created.status_code == 201, created.text
    created_payload = created.json()
    assert created_payload["subject"] == "history"

    listing = client.get("/admin/questions", headers=auth_headers(admin_user["access_token"]))
    assert listing.status_code == 200, listing.text
    assert len(listing.json()) == 1

    deleted = client.delete(
        f"/admin/questions/{created_payload['id']}",
        headers=auth_headers(admin_user["access_token"]),
    )
    assert deleted.status_code == 204, deleted.text

    empty_listing = client.get("/admin/questions", headers=auth_headers(admin_user["access_token"]))
    assert empty_listing.status_code == 200, empty_listing.text
    assert empty_listing.json() == []
