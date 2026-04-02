#!/bin/bash

# ============================================
# CareerPath Tracker - Complete Startup
# ============================================

echo "🚀 Starting CareerPath Tracker..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if backend is already running
if lsof -ti:5001 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Backend already running on port 5001${NC}"
else
    echo -e "${BLUE}🔧 Starting Backend...${NC}"
    node stable-server.js > backend.log 2>&1 &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    sleep 3
    
    if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend started successfully${NC}"
    else
        echo -e "${RED}❌ Backend failed to start${NC}"
        exit 1
    fi
fi

echo ""

# Check if frontend is already running
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Frontend already running on port 3000${NC}"
else
    echo -e "${BLUE}📱 Frontend should be started separately${NC}"
    echo -e "${BLUE}   Run: cd client && npm start${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Backend is running!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}🌐 URLs:${NC}"
echo "   Backend:  http://localhost:5001"
echo "   Frontend: http://localhost:3000"
echo ""
echo -e "${BLUE}👤 Demo Account:${NC}"
echo "   Email:    demo@careerpath.com"
echo "   Password: demo123"
echo ""
echo -e "${BLUE}📝 Logs:${NC}"
echo "   Backend:  tail -f backend.log"
echo ""
echo -e "${BLUE}🛑 To stop backend:${NC}"
echo "   lsof -ti:5001 | xargs kill -9"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
