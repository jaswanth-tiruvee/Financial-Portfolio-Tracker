#!/bin/bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Financial Portfolio Tracker Services...${NC}"
echo ""

# Check Docker containers
echo "Checking Docker containers..."
if ! docker ps | grep -q mongodb; then
    echo "Starting MongoDB container..."
    docker start mongodb 2>/dev/null || docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_DATABASE=portfolio-tracker mongo:latest
fi

if ! docker ps | grep -q redis; then
    echo "Starting Redis container..."
    docker start redis 2>/dev/null || docker run -d --name redis -p 6379:6379 redis:latest
fi

echo -e "${GREEN}✅ Docker containers ready${NC}"
echo ""

# Start API Server
echo "Starting API Server on port 3001..."
cd "$(dirname "$0")"
PORT=3001 npm run start:api > api-server.log 2>&1 &
API_PID=$!
echo "API Server PID: $API_PID"
sleep 2

# Start Worker Service
echo "Starting Worker Service..."
npm run start:worker > worker-service.log 2>&1 &
WORKER_PID=$!
echo "Worker Service PID: $WORKER_PID"
sleep 2

# Start Frontend
echo "Starting Frontend on port 3000..."
cd frontend
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

echo ""
echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo "Services:"
echo "  - API Server: http://localhost:3001"
echo "  - Frontend: http://localhost:3000"
echo "  - Worker Service: Running in background"
echo ""
echo "Logs:"
echo "  - API: api-server.log"
echo "  - Worker: worker-service.log"
echo "  - Frontend: frontend.log"
echo ""
echo "To stop services:"
echo "  kill $API_PID $WORKER_PID $FRONTEND_PID"
echo ""
echo "Or run: pkill -f 'node.*(api-server|worker-service|react-scripts)'"

