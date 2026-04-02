#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "QuizArena Mobile App Setup"
echo "=========================="
echo

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd "$FRONTEND_DIR"

echo -e "${YELLOW}Step 1/4: Installing frontend and Capacitor dependencies...${NC}"
npm install

echo -e "${YELLOW}Step 2/4: Building the mobile bundle from the original QuizArena frontend...${NC}"
npm run build:mobile

echo -e "${YELLOW}Step 3/4: Ensuring the Android platform exists...${NC}"
if [ ! -d android ]; then
  npx cap add android
else
  echo "Android platform already exists"
fi

echo -e "${YELLOW}Step 4/4: Syncing the mobile bundle into Android...${NC}"
npx cap sync android

echo -e "${GREEN}Setup complete.${NC}"
echo
echo "Next steps:"
echo "1. Open Android Studio"
echo "2. Open $FRONTEND_DIR/android"
echo "3. Build the APK or run on a device/emulator"
