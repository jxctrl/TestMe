<div align="center">
<h1>🎯 QuizArena</h1>
<p><strong>A bilingual quiz platform for students — built in English and Uzbek</strong></p>
<p>
  <img src="https://img.shields.io/badge/status-active-c8f135?style=flat-square"/>
  <img src="https://img.shields.io/badge/frontend-complete-c8f135?style=flat-square"/>
  <img src="https://img.shields.io/badge/backend-live-c8f135?style=flat-square"/>
  <img src="https://img.shields.io/badge/languages-EN%20%2F%20UZ-4a9eff?style=flat-square"/>
</p>
</div>

---

## What is this

QuizArena is a quiz platform I built for students preparing for exams. It started as a small project in 2022 and has been rebuilt several times since. The current version is the cleanest and most complete one — with a full Python/FastAPI backend, user accounts, a leaderboard, and an admin panel.

🔗 **Live demo:** [quizarena-nrje.onrender.com](https://quizarena-nrje.onrender.com)

---

## Why this project stands out

- Full-stack architecture: static HTML/CSS/JS frontend, FastAPI backend, SQLAlchemy models, and PostgreSQL in production.
- Real product surface: authentication, leaderboard, admin tooling, profile management, and bilingual content.
- Cross-platform direction: web deployment plus Capacitor-based Android packaging under `frontend/android`.
- Quality signals: backend API tests with `pytest` and GitHub Actions CI for backend and mobile bundle checks.

---

## Features

**Practice Mode**
- Choose from 6 subjects
- Answer 10 questions at your own pace
- Correct answers shown immediately after each question
- Score summary at the end

**Competition Mode**
- 10 seconds per question
- 1000 points per correct answer
- Automatic timeout if you don't answer in time
- Breakdown of correct, wrong, and timed-out answers at the end

**Bilingual Support**
- Full English and Uzbek language support
- Language toggle on every page
- Saves your language preference across sessions
- Questions, UI, and results all translated

**User Accounts**
- Register and log in
- Persistent score history and leaderboard
- Profile page with badges, stats, and progress tracking
- Avatar upload and account settings

**Admin Panel**
- Add and remove bilingual questions without touching code
- Monitor user activity and quiz stats

---

## Tech Stack

**Frontend**
- Static HTML, CSS, JavaScript pages
- Capacitor Android packaging for the mobile build
- Custom i18n system using `localStorage` for language persistence

**Backend**
- Python + FastAPI
- PostgreSQL (production) / SQLite (local dev)
- Custom JWT authentication (no third-party auth library)
- PBKDF2 password hashing

---

## Project Structure
```
QuizArena/
├── index.html          # Landing page
├── frontend/           # Mobile bundle tooling + Capacitor Android project
├── backend/            # FastAPI app, routers, models, schemas, tests
├── setup-mobile.sh     # Mobile bundle + Android sync helper
├── MOBILE-SETUP.md     # Mobile workflow notes
├── css/                # Static site styles
├── js/                 # Static site scripts
└── favicon/            # Icons and web manifest
```

---

## Roadmap

- [x] Practice mode with subject selection
- [x] Competition mode with 10-second timer
- [x] Bilingual support (English + Uzbek)
- [x] Language persistence across pages
- [x] Score summary and grade on completion
- [x] Python/FastAPI backend
- [x] User registration and login
- [x] Persistent score history
- [x] Leaderboard (all-time + by mode)
- [x] Admin panel for managing questions
- [x] Deploy publicly
- [ ] Email verification
- [ ] Password reset
- [ ] Weekly leaderboard

---

## Running Locally

**Environment**
```bash
python -m venv .venv
. .venv/bin/activate
cp .env.example .env
cp frontend/.env.example frontend/.env.mobile
```

Set `GOOGLE_CLIENT_ID` in `.env` only if you plan to expose Google sign-in in a future frontend.

**Backend + web app**
```bash
python -m pip install -e ".[dev]"
cd backend && uvicorn app.main:app --reload
```

FastAPI serves the original static QuizArena pages from `/`, `/quiz.html`, `/competition.html`, and the other root routes.

**Android build**
```bash
cd frontend
npm install
npm run build:mobile
```

That packages the original static QuizArena frontend into `frontend/dist-mobile` for Capacitor.
Run `./setup-mobile.sh` from the repo root to build and sync the Android project.
The old React experiment now lives in `frontend/legacy-react/` as an archive and is not part of the active app.

---

## Verification

**Backend tests**
```bash
python -m pytest backend/tests
```

**Frontend builds**
```bash
cd frontend
npm run build:mobile
```

**CI**
- GitHub Actions runs backend tests plus the mobile frontend bundle build on every push and pull request.

---

## Why I built this

My mother is a teacher. Watching her manage the stress of Teacher Certification while her students struggled with a lack of digital practice tools was my original motivation. Most existing platforms are either in Russian or English, not Uzbek. QuizArena is being built to change that.

---

## Author

Built by [jxctrl](https://github.com/jxctrl) — Andijan, Uzbekistan
