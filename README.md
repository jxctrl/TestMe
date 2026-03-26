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
- React + Vite SPA under `frontend/` for the API-driven experience
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
├── quiz.html           # Practice mode
├── competition.html    # Competition mode
├── profile.html        # User profile
├── settings.html       # Account settings
├── admin.html          # Admin panel
├── frontend/           # React + Vite SPA
├── backend/            # FastAPI app, routers, models, schemas
├── css/
├── js/
└── favicon/
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

**Backend**
```bash
pip install -e .
cd backend && uvicorn app.main:app --reload
```

**React frontend**
```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies API calls to `http://127.0.0.1:8000`.
When you build with `npm run build`, FastAPI serves the React app from `/app`.

---

## Why I built this

My mother is a teacher. Watching her manage the stress of Teacher Certification while her students struggled with a lack of digital practice tools was my original motivation. Most existing platforms are either in Russian or English, not Uzbek. QuizArena is being built to change that.

---

## Author

Built by [jxctrl](https://github.com/jxctrl) — Andijan, Uzbekistan
