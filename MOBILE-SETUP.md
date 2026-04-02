# QuizArena Mobile Setup

This project now keeps the mobile build inside `frontend/` and uses a dedicated Capacitor bundle so the native app does not conflict with the FastAPI-served web build.

## What changed

- `frontend/capacitor.config.json` is the Capacitor source of truth.
- `npm run build` still builds the web SPA for FastAPI at `/app`.
- `npm run build:mobile` creates a native-friendly bundle in `frontend/dist-mobile`.
- `frontend/.env.mobile` points the native app at `https://quizarena-nrje.onrender.com`.
- Backend CORS now allows Capacitor's localhost origins.

## Prerequisites

- Node.js 18+
- Java JDK 17+
- Android Studio

## One-command setup

From the repo root:

```bash
./setup-mobile.sh
```

That script will:

- install frontend dependencies
- build the mobile bundle
- create `frontend/android` if needed
- sync the latest web assets into the Android project

## Manual workflow

```bash
cd frontend
npm install
npm run build:mobile
npx cap add android
npx cap sync android
```

`npx cap add android` only needs to be run once. After that, use `npx cap sync android` whenever the frontend changes.

## Build output

- Web deployment bundle: `frontend/dist`
- Mobile Capacitor bundle: `frontend/dist-mobile`
- Android project: `frontend/android`

## Open in Android Studio

1. Open Android Studio.
2. Choose `Open`.
3. Select `frontend/android`.
4. Build an APK or run the app on a device/emulator.

## API and CORS notes

- The mobile build uses `frontend/.env.mobile`.
- If your API host changes, update `VITE_API_BASE_URL` in `frontend/.env.mobile`.
- Capacitor Android runs from `https://localhost`, so the backend must allow that origin in `CORS_ORIGINS`.
- If your backend is hosted on Render or another platform, update that deployment's `CORS_ORIGINS` env var too. Changing the repo `.env` alone is not enough.

## Useful commands

```bash
cd frontend
npm run build
npm run build:mobile
npx cap sync android
```
