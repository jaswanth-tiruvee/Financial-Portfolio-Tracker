# 🚀 Quick Start Guide - How to Run & View the App

## ✅ Current Status

Your services are partially running. Here's how to get everything up and view the app:

## Step-by-Step Instructions

### 1. Open 3 Terminal Windows

You'll need 3 separate terminal windows/tabs.

### 2. Terminal 1: Start API Server

```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker"
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
PORT=3001 npm run start:api
```

**Wait for:** `🚀 API Server running on port 3001` and `✅ MongoDB connected`

### 3. Terminal 2: Start Worker Service

```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker"
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
npm run start:worker
```

**Wait for:** `🚀 Worker Service running` and scheduled job messages

### 4. Terminal 3: Start Frontend

```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker/frontend"
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
npm start
```

**Wait for:** 
- `Compiled successfully!`
- Browser may open automatically
- Or you'll see: `webpack compiled with X warnings`

### 5. Open Browser

🌐 **Go to:** http://localhost:3000

The app should load! You'll see:
- "Financial Portfolio Tracker" header
- "My Portfolios" section
- "+ New Portfolio" button

## Quick Test

1. Click **"+ New Portfolio"**
2. Enter name: `My Crypto Portfolio`
3. Click **"Create Portfolio"**
4. Click on the portfolio card
5. Click **"+ Add Holding"**
6. Fill in:
   - Symbol: `bitcoin`
   - Asset Type: `crypto`
   - Quantity: `0.5`
7. Click **"Add Holding"**
8. See real-time Bitcoin price! 🎉

## Verify Services

Run this in a new terminal to check everything:

```bash
echo "API Server:" && curl -s http://localhost:3001/health && echo "" || echo "❌ Not running"
echo "MongoDB:" && docker ps | grep mongodb && echo "✅ Running" || echo "❌ Not running"
echo "Redis:" && docker ps | grep redis && echo "✅ Running" || echo "❌ Not running"
echo "Frontend:" && lsof -ti:3000 > /dev/null && echo "✅ Running on port 3000" || echo "❌ Not running"
```

## Troubleshooting

### "Cannot connect to API"
- Make sure Terminal 1 (API Server) is running
- Check: `curl http://localhost:3001/health`
- Should return: `{"status":"ok","service":"api-server",...}`

### "MongoDB connection error"
- Start MongoDB: `docker start mongodb`
- Check: `docker ps | grep mongodb`

### Frontend shows blank or error
- Wait 30-60 seconds for React to compile (first time)
- Check Terminal 3 for compilation errors
- Make sure API server is running (Terminal 1)

### Port already in use
- If port 3000 is taken, React will ask to use 3001
- Press `Y` to confirm
- Then access: http://localhost:3001

### Services keep stopping
- Make sure all 3 terminals stay open
- Don't close the terminal windows
- Each service needs to keep running

## What You Should See

### In Terminal 1 (API Server):
```
✅ MongoDB connected
🚀 API Server running on port 3001
```

### In Terminal 2 (Worker):
```
✅ Worker: MongoDB connected
🚀 Worker Service running on port 3001
📅 Setting up cron jobs...
```

### In Terminal 3 (Frontend):
```
Compiled successfully!

You can now view portfolio-tracker-frontend in the browser.

  Local:            http://localhost:3000
```

### In Browser (http://localhost:3000):
- Purple gradient background
- "Financial Portfolio Tracker" header
- Portfolio management interface

## Stop Services

Press `Ctrl+C` in each terminal window to stop the services.

Or stop all at once:
```bash
pkill -f "node.*(api-server|worker-service|react-scripts)"
```

## Restart Everything

If something goes wrong, stop all services and start fresh:

```bash
# Stop everything
pkill -f "node.*(api-server|worker-service|react-scripts)"

# Start Docker containers
docker start mongodb redis

# Then follow steps 2-4 above to start services
```

---

**🎯 That's it!** Once all 3 terminals show their services running, open http://localhost:3000 in your browser!

