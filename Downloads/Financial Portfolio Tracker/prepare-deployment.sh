#!/bin/bash

# Script to prepare your code for deployment
# Run this before deploying to ensure everything is ready

echo "🔍 Preparing Financial Portfolio Tracker for Deployment..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Check for required files
echo "📋 Checking required files..."

REQUIRED_FILES=(
    "api-server/index.js"
    "worker-service/index.js"
    "frontend/package.json"
    ".gitignore"
    "Procfile"
)

MISSING_FILES=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

if [ $MISSING_FILES -gt 0 ]; then
    echo ""
    echo "❌ Some required files are missing!"
    exit 1
fi

echo ""
echo "✅ All required files present"
echo ""

# Check git status
echo "📦 Checking Git status..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "  ✅ Git repository initialized"
    
    # Check if remote is set
    if git remote get-url origin > /dev/null 2>&1; then
        REMOTE_URL=$(git remote get-url origin)
        echo "  ✅ Remote set to: $REMOTE_URL"
    else
        echo "  ⚠️  No remote repository set"
        echo "     Run: git remote add origin https://github.com/YOUR_USERNAME/repo.git"
    fi
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo "  ⚠️  You have uncommitted changes"
        echo "     Consider: git add . && git commit -m 'Your message'"
    else
        echo "  ✅ All changes committed"
    fi
else
    echo "  ⚠️  Git not initialized"
    echo "     Run: git init"
fi

echo ""
echo "📝 Environment Variables Checklist:"
echo ""
echo "For Render API Service, you'll need:"
echo "  - API_PORT=\$PORT"
echo "  - MONGODB_URI=mongodb+srv://..."
echo "  - UPSTASH_REDIS_REST_URL=https://..."
echo "  - UPSTASH_REDIS_REST_TOKEN=..."
echo "  - FRONTEND_URL=https://xxx.vercel.app (set after Vercel deployment)"
echo "  - NODE_ENV=production"
echo ""
echo "For Render Worker Service, you'll need:"
echo "  - MONGODB_URI=mongodb+srv://..."
echo "  - UPSTASH_REDIS_REST_URL=https://..."
echo "  - UPSTASH_REDIS_REST_TOKEN=..."
echo "  - QUEUE_NAME=portfolio-jobs"
echo "  - NODE_ENV=production"
echo ""
echo "For Vercel Frontend, you'll need:"
echo "  - REACT_APP_API_URL=https://xxx.onrender.com"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Preparation complete!"
echo ""
echo "Next steps:"
echo "1. Follow DEPLOY_CHECKLIST.md"
echo "2. Set up MongoDB Atlas (free)"
echo "3. Set up Upstash Redis (free)"
echo "4. Deploy to Render (free)"
echo "5. Deploy to Vercel (free)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

