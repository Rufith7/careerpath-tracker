#!/bin/bash

# CareerPath Application Stop Script

echo "🛑 Stopping CareerPath Application..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to kill process on port
kill_port() {
    if lsof -ti:$1 > /dev/null 2>&1; then
        echo -e "${YELLOW}Stopping process on port $1...${NC}"
        lsof -ti:$1 | xargs kill -9 2>/dev/null
        echo -e "${GREEN}✅ Port $1 cleared${NC}"
    else
        echo -e "${GREEN}✅ Port $1 already free${NC}"
    fi
}

# Kill by PID if available
if [ -f backend.pid ]; then
    BACKEND_PID=$(cat backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${YELLOW}Stopping backend (PID: $BACKEND_PID)...${NC}"
        kill -9 $BACKEND_PID 2>/dev/null
        echo -e "${GREEN}✅ Backend stopped${NC}"
    fi
    rm backend.pid
fi

if [ -f frontend.pid ]; then
    FRONTEND_PID=$(cat frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${YELLOW}Stopping frontend (PID: $FRONTEND_PID)...${NC}"
        kill -9 $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}✅ Frontend stopped${NC}"
    fi
    rm frontend.pid
fi

# Kill by port as backup
kill_port 5001
kill_port 3000
kill_port 3001

# Clean up log files
if [ -f backend.log ]; then
    rm backend.log
fi

if [ -f frontend.log ]; then
    rm frontend.log
fi

echo ""
echo -e "${GREEN}✅ Application stopped successfully${NC}"
echo ""
