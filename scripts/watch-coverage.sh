#!/bin/bash
# Watch frontend src/ for changes and auto-run coverage validation

echo "👀 Watching src/ for changes (Ctrl+C to stop)..."
echo "When you save a file in src/, coverage will auto-run."
echo ""

# Requires: npm install -D chokidar-cli
# Or use: fswatch (macOS) or inotify-tools (Linux)

if command -v chokidar &> /dev/null; then
  chokidar "src/**/*" --command "npm run coverage:validate"
elif command -v fswatch &> /dev/null; then
  # macOS
  fswatch -r src --event Modified | while read -r event; do
    npm run coverage:validate
  done
elif command -v inotifywait &> /dev/null; then
  # Linux
  inotifywait -m -r -e modify src --format '%T' --timefmt '%H:%M:%S' | while read -r time; do
    npm run coverage:validate
  done
else
  echo "❌ No file watcher found."
  echo "   Install one of:"
  echo "   - chokidar-cli: npm install -D chokidar-cli"
  echo "   - fswatch (macOS): brew install fswatch"
  echo "   - inotify-tools (Linux): sudo apt install inotify-tools"
  exit 1
fi
