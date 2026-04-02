# QuizArena Mobile Setup

This project keeps the Android build inside `frontend/`, but the mobile bundle now packages the original static QuizArena frontend from the repo root so the native app matches the UI you already use.

## What changed

- `frontend/capacitor.config.json` is the Capacitor source of truth.
- `npm run build:mobile` copies the root HTML/CSS/JS frontend into `frontend/dist-mobile`.
- `frontend/.env.mobile` sets the API host used by the packaged mobile build.
- Capacitor HTTP is enabled for the native app so Android requests do not rely on browser CORS.
- `npm run build` still builds the separate React app that FastAPI serves from `/app`.

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
- build the static mobile bundle from the original QuizArena pages
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

- Static mobile bundle: `frontend/dist-mobile`
- React web bundle: `frontend/dist`
- Android project: `frontend/android`

## Open in Android Studio

1. Open Android Studio.
2. Choose `Open`.
3. Select `frontend/android`.
4. Build an APK or run the app on a device/emulator.

## API and CORS notes

- The mobile build reads `frontend/.env.mobile`.
- If your API host changes, update `VITE_API_BASE_URL` in `frontend/.env.mobile`.
- Capacitor HTTP is enabled, so most Android API requests go through the native bridge instead of browser fetch.
- If you rely on browser-only requests like plain web uploads, keep `https://localhost` allowed in backend `CORS_ORIGINS` too.

## Useful commands

```bash
cd frontend
npm run build:mobile
npx cap sync android
```
