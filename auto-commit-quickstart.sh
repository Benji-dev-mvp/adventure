#!/bin/bash
# Quick start script for auto-commit system

echo "🤖 Auto-Commit System - Quick Start"
echo "===================================="
echo ""
echo "Available commands:"
echo ""
echo "1. Manual auto-commit (one-time):"
echo "   ./auto-commit.sh"
echo "   ./auto-commit.sh \"Your custom message\""
echo ""
echo "2. Watch mode (continuous):"
echo "   ./watch-and-commit.sh"
echo "   ./watch-and-commit.sh ./src 120  # Watch src folder every 2 min"
echo ""
echo "3. GitHub Actions (automatic):"
echo "   - Push-triggered: Runs when you push to main"
echo "   - Scheduled: Runs every 30 minutes"
echo "   - Manual: Go to Actions tab → Run workflow"
echo ""
echo "📚 Full documentation: AUTO_COMMIT_GUIDE.md"
echo ""

# Show current status
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  You have uncommitted changes:"
    git status --short
    echo ""
    read -p "Run auto-commit now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./auto-commit.sh
    fi
else
    echo "✅ No uncommitted changes"
fi
