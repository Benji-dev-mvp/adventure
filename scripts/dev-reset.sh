#!/bin/bash
# dev-reset.sh - Reset development environment to clean state
# Usage: ./scripts/dev-reset.sh

set -e

echo "🔄 Resetting development environment..."
echo ""

# Kill any process on port 3004
echo "1️⃣ Checking for processes on port 3004..."
PORT_PID=$(lsof -ti:3004 2>/dev/null || true)
if [ -n "$PORT_PID" ]; then
  echo "   Killing process $PORT_PID on port 3004"
  kill -9 $PORT_PID 2>/dev/null || true
  sleep 1
else
  echo "   No process found on port 3004"
fi

# Clear Vite cache
echo ""
echo "2️⃣ Clearing Vite cache..."
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist
echo "   ✓ Cache cleared"

# Clear browser storage (instructions)
echo ""
echo "3️⃣ Clear browser storage:"
echo "   → Hard refresh: Ctrl+Shift+R (Win/Linux) or Cmd+Shift+R (Mac)"
echo "   → Or DevTools → Application → Clear storage"

# Reinstall dependencies (optional)
if [ "$1" = "--full" ]; then
  echo ""
  echo "4️⃣ Reinstalling dependencies..."
  npm install
  echo "   ✓ Dependencies installed"
fi

echo ""
echo "✅ Reset complete!"
echo ""
echo "Start dev server:"
echo "  npm run dev"
echo ""
