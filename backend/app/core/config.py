from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[3]


def _parse_env_file(env_file: Path) -> dict[str, str]:
    if not env_file.exists():
        return {}

    values: dict[str, str] = {}
    for line in env_file.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", maxsplit=1)
        values[key.strip()] = value.strip()
    return values


def _load_env_files() -> None:
    merged_values: dict[str, str] = {}
    merged_values.update(_parse_env_file(PROJECT_ROOT / ".env.example"))
    merged_values.update(_parse_env_file(PROJECT_ROOT / ".env"))

    for key, value in merged_values.items():
        os.environ.setdefault(key, value)


_load_env_files()


def _parse_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(slots=True)
class Settings:
    app_name: str = field(default_factory=lambda: os.getenv("APP_NAME", "QuizArena API"))
    secret_key: str = field(default_factory=lambda: os.getenv("SECRET_KEY", "change-me-in-production"))
    access_token_expire_minutes: int = field(
        default_factory=lambda: int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
    )
    database_url: str = field(
        default_factory=lambda: os.getenv(
            "DATABASE_URL",
            "sqlite:///./backend/quiz_arena.db",
        )
    )
    cors_origins: list[str] = field(
        default_factory=lambda: _parse_csv(
            os.getenv(
                "CORS_ORIGINS",
                "http://127.0.0.1:8000,http://localhost:8000,http://127.0.0.1:5500,http://localhost:5500,http://127.0.0.1:5173,http://localhost:5173",
            )
        )
    )
    admin_emails: list[str] = field(
        default_factory=lambda: [email.lower() for email in _parse_csv(os.getenv("ADMIN_EMAILS", "jacsaidabror@gmail.com"))]
    )
    auto_create_tables: bool = field(
        default_factory=lambda: os.getenv("AUTO_CREATE_TABLES", "true").lower() == "true"
    )

    def is_admin_email(self, email: str) -> bool:
        return email.lower() in self.admin_emails


settings = Settings()
