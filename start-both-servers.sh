#!/bin/bash

# CareerPath Tracker - Complete Startup Script
# This script starts both backend and frontend servers

echo "🚀 Starting CareerPath Tracker..."
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

# Check and kill existing processes
echo "🔍 Checking for existing processes..."

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

echo ""
echo "✅ Ports cleared"
echo ""

# Start backend
echo "🔧 Starting Backend Server (Port 5001)..."
node stable-server.js > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Check if backend is running
if check_port 5001; then
    echo -e "${GREEN}✅ Backend started successfully on port 5001${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    echo "Check backend.log for errors"
    exit 1
fi

echo ""

# Start frontend
echo "📱 Starting Frontend Server (Port 3000)..."
cd client
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
echo "Waiting for frontend to compile..."
sleep 10

# Check if frontend is running
if check_port 3000; then
    echo -e "${GREEN}✅ Frontend started successfully on port 3000${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    echo "Check frontend.log for errors"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 CareerPath Tracker is running!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5001"
echo ""
echo "👤 Demo Login:"
echo "   Email:    demo@careerpath.com"
echo "   Password: demo123"
echo ""
echo "📝 Logs:"
echo "   Backend:  backend.log"
echo "   Frontend: frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   or run: ./stop-servers.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop monitoring (servers will continue running)"
echo ""

# Keep script running and monitor servers
while true; do
    if ! check_port 5001; then
        echo -e "${RED}❌ Backend stopped unexpectedly!${NC}"
        echo "Check backend.log for errors"
        break
    fi
    
    if ! check_port 3000; then
        echo -e "${RED}❌ Frontend stopped unexpectedly!${NC}"
        echo "Check frontend.log for errors"
        break
    fi
    
    sleep 5
done
