# Quick Setup Guide

## Prerequisites Installation

### macOS (using Homebrew)
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Install Redis
brew install redis
brew services start redis
```

### Linux (Ubuntu/Debian)
```bash
# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb

# Install Redis
sudo apt-get install -y redis-server
sudo systemctl start redis
```

### Windows
- MongoDB: Download from https://www.mongodb.com/try/download/community
- Redis: Download from https://redis.io/download or use WSL

## Project Setup

1. **Install root dependencies:**
```bash
npm install
```

2. **Install frontend dependencies:**
```bash
cd frontend
npm install
cd ..
```

3. **Create .env file:**
```bash
cp .env.example .env
```

Edit `.env` and optionally add your IEX Cloud API key for stock data:
```
IEX_CLOUD_API_KEY=your_api_key_here
```

4. **Start services:**

**Option 1: Run separately (recommended for development)**
```bash
# Terminal 1: API Server
npm run start:api

# Terminal 2: Worker Service
npm run start:worker

# Terminal 3: Frontend
cd frontend
npm start
```

**Option 2: Run API and Worker together**
```bash
# Terminal 1: API + Worker
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

5. **Access the application:**
- Frontend: http://localhost:3000
- API Server: http://localhost:3000/api
- Worker Service: Runs in background (check console logs)

## Verify Setup

1. **Check MongoDB:**
```bash
mongosh
# Should connect successfully
```

2. **Check Redis:**
```bash
redis-cli ping
# Should return: PONG
```

3. **Test API:**
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","service":"api-server",...}
```

## Common Issues

**Port already in use:**
- Change `API_PORT` in `.env` to a different port

**Redis connection failed:**
- Ensure Redis is running: `redis-cli ping`
- Check `REDIS_HOST` and `REDIS_PORT` in `.env`

**MongoDB connection failed:**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

**Frontend can't connect to API:**
- Ensure API server is running on port 3000
- Check `REACT_APP_API_URL` in frontend or use proxy in package.json

