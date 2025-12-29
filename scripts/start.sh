#!/bin/bash
# Startup script for Artisan platform in Codespaces
# This ensures backend and frontend start properly without conflicts

set -e  # Exit on error

echo "🚀 Starting Artisan Platform..."

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

# Kill any existing processes on ports 3004 and 8000
echo -e "${YELLOW}🔧 Cleaning up existing processes...${NC}"
pkill -f "vite.*3004" || true
pkill -f "uvicorn.*8000" || true
sleep 2

# Start backend
echo -e "${YELLOW}🔄 Starting FastAPI backend on port 8000...${NC}"
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

# Start frontend
echo -e "${YELLOW}🔄 Starting React frontend on port 3004...${NC}"
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
echo -e "📊 Frontend:  ${YELLOW}http://localhost:3004${NC}"
echo -e "🔧 Backend:   ${YELLOW}http://localhost:8000${NC}"
echo -e "📖 API Docs:  ${YELLOW}http://localhost:8000/docs${NC}"
echo ""
echo -e "📝 Logs:"
echo -e "   Backend:  tail -f /tmp/backend.log"
echo -e "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop watching logs (services will continue running)${NC}"
echo ""

# Tail both logs
tail -f /tmp/backend.log /tmp/frontend.log
