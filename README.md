# QuizArena

A browser-based quiz platform with practice and competitive modes.

## Overview
QuizArena allows users to solve quizzes individually or compete in timed sessions. The current version focuses on frontend interaction, with a backend system in development.

## Features (Current)
- Multiple quiz pages
- Question navigation system
- Score tracking (client-side)
- Responsive UI

## Planned Features
- REST API (Python backend using FastAPI or Flask)
- Database integration (PostgreSQL or SQLite)
- User authentication (login/register)
- Persistent scores and history
- Real-time or timed competition mode

## Tech Stack
Frontend:
- HTML
- CSS
- JavaScript (vanilla)

Backend (planned):
- Python
- FastAPI / Flask
- SQL database

## Project Structure
- /pages → quiz and UI pages
- /styles → CSS files
- /scripts → JavaScript logic

## Design Decisions
- Started with vanilla JS to fully control logic without framework abstraction
- Separated UI and logic to keep code maintainable
- Building frontend first to define interaction before backend integration

## Current Limitations
- No backend (no data persistence)
- No authentication
- Scores reset on refresh

## Roadmap
1. Build backend API (questions, users, scores)
2. Connect frontend to API
3. Add authentication system
4. Implement persistent scoring
5. Add competition logic

## Status
Active development. This project is being expanded into a full-stack application.
