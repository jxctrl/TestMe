from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.routers.admin import router as admin_router
from app.routers.auth import router as auth_router
from app.routers.leaderboard import router as leaderboard_router
from app.routers.questions import router as questions_router
from app.routers.scores import router as scores_router
from app.routers.stats import router as stats_router
from app.routers.users import router as users_router

PROJECT_ROOT = Path(__file__).resolve().parents[2]
FRONTEND_DIST = PROJECT_ROOT / "frontend" / "dist"

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(questions_router)
app.include_router(scores_router)
app.include_router(leaderboard_router)
app.include_router(stats_router)
app.include_router(users_router)
app.include_router(admin_router)


@app.on_event("startup")
def on_startup() -> None:
    if settings.auto_create_tables:
        Base.metadata.create_all(bind=engine)


@app.get("/health", include_in_schema=False)
def health() -> dict[str, str]:
    return {"status": "ok"}


app.mount("/css", StaticFiles(directory=PROJECT_ROOT / "css"), name="css")
app.mount("/js", StaticFiles(directory=PROJECT_ROOT / "js"), name="js")
app.mount("/favicon", StaticFiles(directory=PROJECT_ROOT / "favicon"), name="favicon")


def _page_response(filename: str) -> FileResponse:
    return FileResponse(PROJECT_ROOT / filename)


def _frontend_dist_ready() -> bool:
    return (FRONTEND_DIST / "index.html").exists()


def _frontend_response(path: str = "") -> FileResponse:
    if not _frontend_dist_ready():
        raise HTTPException(
            status_code=404,
            detail="The React frontend is not built yet. Run `npm install && npm run build` inside /frontend first.",
        )

    requested_path = path.strip("/")
    if requested_path:
        candidate = (FRONTEND_DIST / requested_path).resolve()
        try:
            candidate.relative_to(FRONTEND_DIST)
        except ValueError as exc:
            raise HTTPException(status_code=404, detail="Not found.") from exc

        if candidate.is_file():
            return FileResponse(candidate)

    return FileResponse(FRONTEND_DIST / "index.html")


@app.get("/", include_in_schema=False)
def root() -> FileResponse:
    return _page_response("index.html")


@app.get("/index.html", include_in_schema=False)
def index_page() -> FileResponse:
    return _page_response("index.html")


@app.get("/quiz.html", include_in_schema=False)
def quiz_page() -> FileResponse:
    return _page_response("quiz.html")


@app.get("/competition.html", include_in_schema=False)
def competition_page() -> FileResponse:
    return _page_response("competition.html")


@app.get("/login.html", include_in_schema=False)
def login_page() -> FileResponse:
    return _page_response("login.html")


@app.get("/register.html", include_in_schema=False)
def register_page() -> FileResponse:
    return _page_response("register.html")


@app.get("/profile.html", include_in_schema=False)
def profile_page() -> FileResponse:
    return _page_response("profile.html")


@app.get("/settings.html", include_in_schema=False)
def settings_page() -> FileResponse:
    return _page_response("settings.html")


@app.get("/admin.html", include_in_schema=False)
def admin_page() -> FileResponse:
    return _page_response("admin.html")


@app.get("/app", include_in_schema=False)
def react_app_index() -> FileResponse:
    return _frontend_response()


@app.get("/app/{path:path}", include_in_schema=False)
def react_app(path: str) -> FileResponse:
    return _frontend_response(path)