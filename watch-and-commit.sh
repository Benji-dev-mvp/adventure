#!/bin/bash
# File watcher that auto-commits on changes
# Usage: ./watch-and-commit.sh [directory] [interval-seconds]

WATCH_DIR="${1:-.}"
INTERVAL="${2:-300}" # Default: 5 minutes

echo "🔍 Watching ${WATCH_DIR} for changes (checking every ${INTERVAL}s)"
echo "Press Ctrl+C to stop"

while true; do
    # Check if there are changes
    if [[ -n $(git status --porcelain) ]]; then
        echo "📝 Changes detected at $(date '+%Y-%m-%d %H:%M:%S')"
        ./auto-commit.sh "🤖 Auto-commit: Changes detected at $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    sleep ${INTERVAL}
done
