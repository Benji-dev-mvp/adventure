#!/bin/bash
# Startup script for Artisan platform in Codespaces
# Consolidated single port setup: Everything accessible via port 3004
# Backend runs on 8000 internally, proxied through frontend

set -e  # Exit on error

echo "🚀 Starting Artisan Platform (Consolidated on port 3004)..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if packages are installed
echo -e "${YELLOW}📦 Checking Python dependencies...${NC}"
cd /workspaces/codespaces-react/backend

if ! python3 -c "import jwt" 2>/dev/null; then
    echo -e "${YELLOW}Installing missing Python packages...${NC}"
    python3 -m pip install -q -r requirements.txt
    echo -e "${GREEN}✅ Python packages installed${NC}"
else
    echo -e "${GREEN}✅ Python packages already installed${NC}"
fi

# Kill any existing processes on all ports
echo -e "${YELLOW}🔧 Cleaning up existing processes...${NC}"
pkill -f "vite" || true
pkill -f "uvicorn" || true
pkill -f "npm run" || true
sleep 2

# Start backend (internal only, not exposed)
echo -e "${YELLOW}🔄 Starting FastAPI backend on port 8000 (internal only)...${NC}"
cd /workspaces/codespaces-react/backend
nohup python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend failed to start. Check /tmp/backend.log${NC}"
        tail -20 /tmp/backend.log
        exit 1
    fi
    sleep 1
done

# Start frontend (single entry point on 3004)
echo -e "${YELLOW}🔄 Starting React frontend on port 3004 (with API proxy)...${NC}"
cd /workspaces/codespaces-react
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

# Wait for frontend to be ready
echo -e "${YELLOW}⏳ Waiting for frontend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3004 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is healthy${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Frontend failed to start. Check /tmp/frontend.log${NC}"
        tail -20 /tmp/frontend.log
        exit 1
    fi
    sleep 1
done

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Artisan Platform is running!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "🌐 Main App:  ${YELLOW}http://localhost:3004${NC}"
echo -e "   All requests (app + API) go through this single port"
echo -e "   API calls are proxied to backend automatically"
echo ""
echo -e "📖 API Docs:  ${YELLOW}http://localhost:3004/api/docs${NC}"
echo ""
echo -e "📝 Logs:"
echo -e "   Backend:  tail -f /tmp/backend.log"
echo -e "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop watching logs (services will continue running)${NC}"
echo ""

# Tail both logs
tail -f /tmp/backend.log /tmp/frontend.log
