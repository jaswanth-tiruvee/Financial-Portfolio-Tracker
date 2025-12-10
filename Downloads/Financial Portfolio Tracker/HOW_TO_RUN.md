# 🚀 How to Run the App

## Quick Start (3 Steps)

### Step 1: Ensure Docker Containers are Running

```bash
# Check if containers are running
docker ps | grep -E "(mongodb|redis)"

# If not running, start them:
docker start mongodb redis

# Or if they don't exist, create them:
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_DATABASE=portfolio-tracker mongo:latest
docker run -d --name redis -p 6379:6379 redis:latest
```

### Step 2: Start the Services

**Option A: Use the Startup Script (Easiest)**
```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker"
./START_SERVICES.sh
```

**Option B: Start Manually (3 Terminal Windows)**

**Terminal 1 - API Server:**
```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker"
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
PORT=3001 npm run start:api
```
You should see: `🚀 API Server running on port 3001`

**Terminal 2 - Worker Service:**
```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker"
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
npm run start:worker
```
You should see: `🚀 Worker Service running on port 3001`

**Terminal 3 - Frontend:**
```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker/frontend"
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
npm start
```
You should see: `Compiled successfully!` and the browser may open automatically.

### Step 3: Open in Browser

🌐 **Open your browser and go to:**
```
http://localhost:3000
```

The React app will load and you'll see the Portfolio Tracker interface!

## Verify Everything is Running

Run this command to check all services:
```bash
echo "=== Service Status ===" && \
curl -s http://localhost:3001/health && echo " ✅ API Server" || echo "❌ API Server" && \
docker ps | grep mongodb > /dev/null && echo "✅ MongoDB" || echo "❌ MongoDB" && \
docker ps | grep redis > /dev/null && echo "✅ Redis" || echo "❌ Redis" && \
lsof -ti:3000 > /dev/null && echo "✅ Frontend (port 3000)" || echo "⏳ Frontend starting..."
```

## Using the App

### 1. Create a Portfolio
- Click the **"+ New Portfolio"** button
- Enter a name (e.g., "My Crypto Portfolio")
- Click **"Create Portfolio"**

### 2. Add Holdings
- Click on your portfolio card
- Click **"+ Add Holding"**
- Fill in:
  - **Asset Type**: Choose `crypto` or `stock`
  - **Symbol**: 
    - For crypto: `bitcoin`, `ethereum`, `cardano`, etc.
    - For stocks: `AAPL`, `TSLA`, `GOOGL`, etc. (requires IEX Cloud API key)
  - **Quantity**: Amount you own (e.g., `0.5` for Bitcoin)
  - **Purchase Price** (optional): What you paid
- Click **"Add Holding"**

### 3. View Portfolio
- See real-time prices
- View 24h change percentages
- Check total portfolio value
- See gain/loss calculations
- View 30-day value chart

## Troubleshooting

### "Cannot connect to API"
- Make sure API server is running on port 3001
- Check: `curl http://localhost:3001/health`
- Restart API server if needed

### "MongoDB connection error"
- Start MongoDB container: `docker start mongodb`
- Check: `docker ps | grep mongodb`

### "Redis connection error"
- Start Redis container: `docker start redis`
- Check: `docker ps | grep redis`

### Frontend shows "Cannot GET /"
- Wait 30-60 seconds for React to compile (first run)
- Check if React dev server is running: `lsof -ti:3000`
- Restart frontend if needed

### Port 3000 already in use
- React will automatically use port 3001 or ask you to confirm
- Or stop the process using port 3000: `lsof -ti:3000 | xargs kill`

### "node: command not found"
- Load NVM: `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"`
- Or add to your shell profile (~/.zshrc or ~/.bash_profile)

## Stop Services

To stop all services:
```bash
# Stop Node.js processes
pkill -f "node.*(api-server|worker-service|react-scripts)"

# Stop Docker containers (optional - they can stay running)
docker stop mongodb redis
```

## Restart Services

```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker"
./START_SERVICES.sh
```

## What Each Service Does

- **API Server (port 3001)**: Handles HTTP requests, portfolio CRUD, price fetching
- **Worker Service**: Processes background jobs (valuations, caching, notifications)
- **Frontend (port 3000)**: React UI for interacting with your portfolios
- **MongoDB**: Stores portfolios and valuation history
- **Redis**: Caches API responses and manages job queue

## Example Workflow

1. ✅ Start all services (see Step 2)
2. ✅ Open http://localhost:3000
3. ✅ Create "My Crypto Portfolio"
4. ✅ Add holding: `bitcoin`, `0.5` quantity
5. ✅ View real-time Bitcoin price and portfolio value
6. ✅ Add more holdings (ethereum, cardano, etc.)
7. ✅ Watch your portfolio value update in real-time!

---

**Need help?** Check the logs:
- API: `tail -f api-server.log`
- Worker: `tail -f worker-service.log`
- Frontend: Check the terminal where you ran `npm start`

