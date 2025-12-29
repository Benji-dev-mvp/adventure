#!/bin/bash
# Auto-sync main and ensure dependencies are present when a Codespace starts

set -euo pipefail

echo "🔍 Detecting current branch..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📌 Current branch: $CURRENT_BRANCH"

if [[ "$CURRENT_BRANCH" == "main" ]]; then
	if git diff --quiet --ignore-submodules; then
		echo "🔄 Pulling latest changes from origin/main..."
		git fetch origin main
		git pull --ff-only origin main || echo "⚠️ Pull skipped"
	else
		echo "⚠️ Working tree dirty; skipping auto-pull to avoid conflicts"
	fi
else
	echo "ℹ️ Skipping auto-pull because branch is not main"
fi

echo "📦 Installing frontend dependencies..."
npm install

if [[ -f "backend/requirements.txt" ]]; then
	echo "📦 Installing backend dependencies..."
	python3 -m pip install --user --upgrade pip
	python3 -m pip install --user -r backend/requirements.txt
fi

echo "✅ Codespace is ready!"
