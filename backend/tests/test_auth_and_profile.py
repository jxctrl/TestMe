from __future__ import annotations

import app.routers.auth as auth_router
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


def test_register_login_and_profile_flow(client) -> None:
    registration = register_user(client, username="StudentOne", email="Student@example.com")

    assert registration["token_type"] == "bearer"
    assert registration["user"]["email"] == "student@example.com"
    assert registration["user"]["username"] == "StudentOne"
    assert registration["user"]["is_admin"] is False

    login = client.post(
        "/auth/login",
        json={
            "email": "STUDENT@example.com",
            "password": "password123",
        },
    )
    assert login.status_code == 200, login.text
    token = login.json()["access_token"]

    me = client.get("/users/me", headers=auth_headers(token))
    assert me.status_code == 200, me.text
    profile = me.json()
    assert profile["stats"]["total_quizzes_taken"] == 0
    assert profile["best_scores"] == []
    assert profile["score_history"] == []

    update = client.patch(
        "/users/me",
        json={"username": "  Champion  "},
        headers=auth_headers(token),
    )
    assert update.status_code == 200, update.text
    assert update.json()["username"] == "Champion"

    duplicate = client.post(
        "/auth/register",
        json={
            "username": "Champion",
            "email": "student@example.com",
            "password": "password123",
        },
    )
    assert duplicate.status_code == 400
    assert duplicate.json()["detail"] == "A user with that email or username already exists."


def test_google_login_creates_and_reuses_account(client, monkeypatch) -> None:
    monkeypatch.setattr(settings, "google_client_id", "google-client-id")
    credential = "google-id-token-value-12345"

    def fake_verify_google_credential(credential: str, *, expected_client_id: str) -> dict[str, str]:
        assert credential == "google-id-token-value-12345"
        assert expected_client_id == "google-client-id"
        return {
            "email": "googleuser@example.com",
            "name": "Google User",
            "picture": "https://example.com/avatar.png",
        }

    monkeypatch.setattr(auth_router, "verify_google_credential", fake_verify_google_credential)

    created = client.post("/auth/google", json={"credential": credential})
    assert created.status_code == 200, created.text
    created_payload = created.json()
    assert created_payload["user"]["email"] == "googleuser@example.com"
    assert created_payload["user"]["username"] == "GoogleUser"
    assert created_payload["user"]["avatar_url"] == "https://example.com/avatar.png"

    repeated = client.post("/auth/google", json={"credential": credential})
    assert repeated.status_code == 200, repeated.text
    repeated_payload = repeated.json()
    assert repeated_payload["user"]["id"] == created_payload["user"]["id"]
    assert repeated_payload["user"]["email"] == created_payload["user"]["email"]
