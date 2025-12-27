#!/bin/bash
# Auto-pull latest changes when Codespace starts

echo "🔄 Fetching latest changes..."
git fetch origin

CURRENT_BRANCH=$(git branch --show-current)
echo "📌 Current branch: $CURRENT_BRANCH"

echo "⬇️ Pulling latest changes from origin/$CURRENT_BRANCH..."
git pull origin "$CURRENT_BRANCH" --no-edit || echo "⚠️ Pull failed or nothing to pull"

echo "📦 Installing dependencies..."
npm install

echo "✅ Codespace is ready!"
