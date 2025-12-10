#!/bin/bash

echo "🔍 Checking Prerequisites for Financial Portfolio Tracker..."
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js installed: $NODE_VERSION"
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        echo "✅ npm installed: $NPM_VERSION"
    else
        echo "❌ npm not found"
    fi
else
    echo "❌ Node.js not installed"
    echo "   Install: brew install node"
    echo "   Or download from: https://nodejs.org/"
fi
echo ""

# Check MongoDB
echo "🍃 Checking MongoDB..."
if command -v mongosh &> /dev/null; then
    echo "✅ MongoDB client installed"
    if mongosh --eval "db.version()" --quiet &> /dev/null; then
        echo "✅ MongoDB server is running"
    else
        echo "⚠️  MongoDB client found but server not responding"
        echo "   Start with: brew services start mongodb-community"
    fi
elif command -v mongo &> /dev/null; then
    echo "✅ MongoDB (legacy) client installed"
else
    echo "❌ MongoDB not installed"
    echo "   Install: brew tap mongodb/brew && brew install mongodb-community"
    echo "   Start: brew services start mongodb-community"
fi
echo ""

# Check Redis
echo "🔴 Checking Redis..."
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo "✅ Redis installed and running"
    else
        echo "⚠️  Redis installed but not running"
        echo "   Start with: brew services start redis"
    fi
else
    echo "❌ Redis not installed"
    echo "   Install: brew install redis"
    echo "   Start: brew services start redis"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if command -v node &> /dev/null && command -v mongosh &> /dev/null && command -v redis-cli &> /dev/null; then
    if mongosh --eval "db.version()" --quiet &> /dev/null && redis-cli ping &> /dev/null; then
        echo "✅ All prerequisites are installed and running!"
        echo ""
        echo "Next steps:"
        echo "1. npm install"
        echo "2. cd frontend && npm install && cd .."
        echo "3. npm run start:api (in one terminal)"
        echo "4. npm run start:worker (in another terminal)"
        echo "5. cd frontend && npm start (in a third terminal)"
    else
        echo "⚠️  Prerequisites installed but some services need to be started"
    fi
else
    echo "❌ Some prerequisites are missing. Please install them first."
    echo ""
    echo "Quick install (macOS with Homebrew):"
    echo "  brew install node"
    echo "  brew tap mongodb/brew && brew install mongodb-community"
    echo "  brew install redis"
    echo ""
    echo "Then start services:"
    echo "  brew services start mongodb-community"
    echo "  brew services start redis"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

