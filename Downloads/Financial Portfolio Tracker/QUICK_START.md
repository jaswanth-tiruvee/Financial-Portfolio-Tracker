# Quick Start Guide

## Prerequisites Check

Before running the app, you need:

1. **Node.js** (v14 or higher)
2. **MongoDB** (running locally or connection string)
3. **Redis** (running locally)

## Installation Steps

### 1. Install Node.js (if not installed)

**macOS (using Homebrew):**
```bash
brew install node
```

**Or download from:** https://nodejs.org/

**Verify installation:**
```bash
node --version
npm --version
```

### 2. Install MongoDB

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Verify MongoDB is running:**
```bash
mongosh --eval "db.version()"
```

### 3. Install Redis

**macOS (using Homebrew):**
```bash
brew install redis
brew services start redis
```

**Verify Redis is running:**
```bash
redis-cli ping
# Should return: PONG
```

### 4. Install Project Dependencies

```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker"
npm install
cd frontend
npm install
cd ..
```

### 5. Environment Setup

The `.env` file has been created with default values. You can optionally add your IEX Cloud API key for stock data:

```bash
# Edit .env and add (optional):
IEX_CLOUD_API_KEY=your_api_key_here
```

### 6. Start the Application

**Option A: Run all services separately (Recommended for first run)**

Terminal 1 - API Server:
```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker"
npm run start:api
```

Terminal 2 - Worker Service:
```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker"
npm run start:worker
```

Terminal 3 - Frontend:
```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker/frontend"
npm start
```

**Option B: Run API and Worker together**

Terminal 1:
```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker"
npm run dev
```

Terminal 2 - Frontend:
```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker/frontend"
npm start
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

## Troubleshooting

### "npm: command not found"
- Install Node.js (see step 1)

### "MongoDB connection error"
- Ensure MongoDB is running: `brew services start mongodb-community`
- Check MongoDB is listening: `lsof -i :27017`

### "Redis connection error"
- Ensure Redis is running: `brew services start redis`
- Check Redis is listening: `lsof -i :6379`

### Port already in use
- Change `API_PORT` in `.env` to a different port (e.g., 3001)
- Update frontend proxy in `frontend/package.json` if needed

### Frontend can't connect to API
- Ensure API server is running on the correct port
- Check browser console for CORS errors
- Verify `REACT_APP_API_URL` or proxy settings

## Quick Test

Once everything is running:

1. Open http://localhost:3000
2. Click "New Portfolio"
3. Create a portfolio (e.g., "My Crypto Portfolio")
4. Add a holding:
   - Symbol: `bitcoin`
   - Asset Type: `crypto`
   - Quantity: `0.5`
5. View the portfolio with real-time prices!

## Notes

- CoinGecko API is free and doesn't require an API key
- Stock data (IEX Cloud) requires an API key but is optional
- The app will work with just crypto data if IEX Cloud key is not provided
- Worker service runs background jobs automatically (check console logs)

