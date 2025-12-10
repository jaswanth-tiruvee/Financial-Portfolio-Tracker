# Install Prerequisites

## Current Status

The prerequisite checker shows that you need to install:
- ❌ Node.js
- ❌ MongoDB  
- ❌ Redis

## Quick Installation (macOS with Homebrew)

If you have Homebrew installed, run these commands:

```bash
# Install Node.js
brew install node

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Install Redis
brew install redis
```

Then start the services:

```bash
# Start MongoDB
brew services start mongodb-community

# Start Redis
brew services start redis
```

## Verify Installation

After installation, run the checker again:

```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker"
./check-prerequisites.sh
```

## Alternative Installation Methods

### If you don't have Homebrew:

**Install Homebrew first:**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Or install manually:**

1. **Node.js**: Download from https://nodejs.org/ (LTS version recommended)
2. **MongoDB**: Download from https://www.mongodb.com/try/download/community
3. **Redis**: Download from https://redis.io/download or use Docker:
   ```bash
   docker run -d -p 6379:6379 redis:latest
   ```

## After Installation

Once all prerequisites are installed and running:

1. **Install project dependencies:**
   ```bash
   cd "/Users/abc/Downloads/Financial Portfolio Tracker"
   npm install
   cd frontend
   npm install
   cd ..
   ```

2. **Start the application:**
   ```bash
   # Terminal 1: API Server
   npm run start:api
   
   # Terminal 2: Worker Service
   npm run start:worker
   
   # Terminal 3: Frontend
   cd frontend && npm start
   ```

3. **Open browser:** http://localhost:3000

## Need Help?

- Check `QUICK_START.md` for detailed setup instructions
- Check `SETUP.md` for troubleshooting tips
- Run `./check-prerequisites.sh` anytime to verify your setup

