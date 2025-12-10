#!/bin/bash

# Simple script to start the Financial Portfolio Tracker

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Financial Portfolio Tracker...${NC}"
echo ""

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Check Docker containers
echo -e "${YELLOW}Checking Docker containers...${NC}"
if ! docker ps | grep -q mongodb; then
    echo "Starting MongoDB..."
    docker start mongodb 2>/dev/null || docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_DATABASE=portfolio-tracker mongo:latest
    sleep 2
fi

if ! docker ps | grep -q redis; then
    echo "Starting Redis..."
    docker start redis 2>/dev/null || docker run -d --name redis -p 6379:6379 redis:latest
    sleep 2
fi

echo -e "${GREEN}✅ Docker containers ready${NC}"
echo ""

# Change to project directory
cd "$(dirname "$0")"

# Start API Server
echo -e "${YELLOW}Starting API Server on port 3001...${NC}"
PORT=3001 npm run start:api > /tmp/portfolio-api.log 2>&1 &
API_PID=$!
sleep 3

# Check if API started
if curl -s http://localhost:3001/health > /dev/null; then
    echo -e "${GREEN}✅ API Server running (PID: $API_PID)${NC}"
else
    echo -e "${YELLOW}⚠️  API Server starting... (check /tmp/portfolio-api.log)${NC}"
fi

# Start Worker Service
echo -e "${YELLOW}Starting Worker Service...${NC}"
npm run start:worker > /tmp/portfolio-worker.log 2>&1 &
WORKER_PID=$!
sleep 2
echo -e "${GREEN}✅ Worker Service running (PID: $WORKER_PID)${NC}"

# Start Frontend
echo -e "${YELLOW}Starting Frontend on port 3000...${NC}"
cd frontend
BROWSER=none npm start > /tmp/portfolio-frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
sleep 5

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo -e "${BLUE}📱 Open your browser and go to:${NC}"
echo -e "${GREEN}   http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}Services:${NC}"
echo "  • API Server: http://localhost:3001"
echo "  • Frontend: http://localhost:3000"
echo "  • Worker: Running in background"
echo ""
echo -e "${YELLOW}Logs:${NC}"
echo "  • API: tail -f /tmp/portfolio-api.log"
echo "  • Worker: tail -f /tmp/portfolio-worker.log"
echo "  • Frontend: tail -f /tmp/portfolio-frontend.log"
echo ""
echo -e "${YELLOW}To stop services:${NC}"
echo "  pkill -f 'node.*(api-server|worker-service|react-scripts)'"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

