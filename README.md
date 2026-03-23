<div align="center">

<h1>🎯 QuizArena</h1>

<p><strong>A bilingual quiz platform for students — built in English and Uzbek</strong></p>

<p>
  <img src="https://img.shields.io/badge/status-active-c8f135?style=flat-square"/>
  <img src="https://img.shields.io/badge/frontend-complete-c8f135?style=flat-square"/>
  <img src="https://img.shields.io/badge/backend-in%20progress-orange?style=flat-square"/>
  <img src="https://img.shields.io/badge/languages-EN%20%2F%20UZ-4a9eff?style=flat-square"/>
</p>

</div>

---

## What is this

QuizArena is a quiz platform I built for students preparing for exams. It started as a small project in 2022 and has been rebuilt several times since. The current version is the cleanest and most complete one.

🔗 **Live demo:** [quizarena-jxctrl.netlify.app](https://quizarena-jxctrl.netlify.app)

It runs fully in the browser with no backend yet. A Python/FastAPI backend with user accounts, a leaderboard, and an admin panel is in development for late 2026.

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

---


## Tech Stack

**Current (frontend)**
- HTML, CSS, JavaScript — no frameworks, no dependencies
- Custom i18n system using `localStorage` for language persistence

**Planned (backend)**
- Python + FastAPI
- PostgreSQL or SQLite
- User authentication (register/login)
- Leaderboard with real scores
- Admin panel to add/remove questions without touching code

---

## Project Structure

```
QuizArena/
├── index.html          # Landing page
├── quiz.html           # Practice mode
├── competition.html    # Competition mode
├── css/
│   ├── style.css       # Main styles
│   ├── quiz.css        # Quiz and competition UI
│   └── media.css       # Responsive breakpoints
├── js/
│   ├── app.js          # Loader, navbar, contact form
│   ├── lang.js         # Translation system (EN/UZ)
│   ├── quiz.js         # Quiz logic + all question data
│   └── competition.js  # Competition logic + timer
└── favicon/
```

---

## Roadmap

- [x] Practice mode with subject selection
- [x] Competition mode with 10-second timer
- [x] Bilingual support (English + Uzbek)
- [x] Language persistence across pages
- [x] Score summary and grade on completion
- [ ] Python/FastAPI backend
- [ ] User registration and login
- [ ] Persistent score history
- [ ] Leaderboard (all-time + weekly)
- [ ] Admin panel for managing questions
- [x] Deploy publicly

---

## Why I built this

My mother is a teacher. Watching her manage the stress of Teacher Certification while her students struggled with a lack of digital practice tools was my original motivation. Most existing platforms are either in Russian or English, not Uzbek. QuizArena is being built to change that.

---

## Author

Built by [jxctrl](https://github.com/jxctrl) — Andijan, Uzbekistan
