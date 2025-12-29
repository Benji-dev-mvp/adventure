#!/bin/bash

# Enterprise Features - Quick Start Script
# This script helps you start all required services for enterprise features

echo "🚀 Starting Enterprise Features..."
echo ""

# Check if Redis is installed
echo "📦 Checking Redis installation..."
if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis is not installed. Installing Redis..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y redis-server
        sudo systemctl start redis
        sudo systemctl enable redis
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install redis
        brew services start redis
    else
        echo "❌ Please install Redis manually for your system"
        exit 1
    fi
fi

# Check if Redis is running
echo "🔍 Checking Redis status..."
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is running"
else
    echo "❌ Redis is not running. Starting Redis..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo systemctl start redis
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start redis
    else
        redis-server --daemonize yes
    fi
fi

# Check Python dependencies
echo ""
echo "📦 Installing Python dependencies..."
cd /workspaces/codespaces-react/backend
pip install -q -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# Sentry Configuration (Optional)
# SENTRY_DSN=https://xxx@sentry.io/xxx
ENVIRONMENT=development

# Application
APP_VERSION=1.0.0
EOF
    echo "✅ .env file created"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 To start all services, run these commands in separate terminals:"
echo ""
echo "  Terminal 1 - FastAPI Backend:"
echo "    cd /workspaces/codespaces-react/backend"
echo "    uvicorn app.main:app --reload --port 8000"
echo ""
echo "  Terminal 2 - Celery Worker:"
echo "    cd /workspaces/codespaces-react/backend"
echo "    celery -A app.core.celery_app worker -l info -Q emails,campaigns,analytics"
echo ""
echo "  Terminal 3 - Celery Beat (Scheduled Tasks):"
echo "    cd /workspaces/codespaces-react/backend"
echo "    celery -A app.core.celery_app beat -l info"
echo ""
echo "  Terminal 4 - Frontend:"
echo "    cd /workspaces/codespaces-react"
echo "    npm run dev"
echo ""
echo "📊 Access points:"
echo "  - Frontend: http://localhost:3004"
echo "  - Admin Dashboard: http://localhost:3004/admin"
echo "  - API Docs: http://localhost:8000/docs"
echo "  - Health Check: http://localhost:8000/api/health/detailed"
echo ""
