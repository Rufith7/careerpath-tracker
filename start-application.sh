#!/bin/bash

# CareerPath Application Startup Script
# This script ensures both backend and frontend start correctly

echo "🚀 Starting CareerPath Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
    return $?
}

# Function to kill process on port
kill_port() {
    echo -e "${YELLOW}Killing process on port $1...${NC}"
    lsof -ti:$1 | xargs kill -9 2>/dev/null
    sleep 1
}

# Check and clean ports
echo "🔍 Checking ports..."
if check_port 5001; then
    echo -e "${YELLOW}Port 5001 is in use${NC}"
    kill_port 5001
fi

if check_port 3000; then
    echo -e "${YELLOW}Port 3000 is in use${NC}"
    kill_port 3000
fi

if check_port 3001; then
    echo -e "${YELLOW}Port 3001 is in use${NC}"
    kill_port 3001
fi

echo -e "${GREEN}✅ Ports cleared${NC}"
echo ""

# Start backend server
echo "🔧 Starting Backend Server (Port 5001)..."
cd "$(dirname "$0")"
node stable-server.js > backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo ""

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Backend failed to start. Check backend.log for errors${NC}"
    cat backend.log
    exit 1
fi

# Test backend health
echo "🏥 Testing backend health..."
HEALTH_CHECK=$(curl -s http://localhost:5001/api/health 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    cat backend.log
    exit 1
fi
echo ""

# Start frontend
echo "🎨 Starting Frontend (Port 3000)..."
cd client
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo ""

# Save PIDs for cleanup
echo $BACKEND_PID > ../backend.pid
echo $FRONTEND_PID > ../frontend.pid

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ APPLICATION STARTED SUCCESSFULLY!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5001"
echo ""
echo "👤 Demo Login:"
echo "   Email:    demo@careerpath.com"
echo "   Password: demo123"
echo ""
echo "📋 Process IDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "🛑 To stop the application, run: ./stop-application.sh"
echo ""
echo "📊 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "⏳ Waiting for frontend to compile (this may take 30-60 seconds)..."
echo "   The browser will open automatically when ready."
echo ""
