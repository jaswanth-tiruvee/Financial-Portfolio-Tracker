# 🚀 Quick Deployment Guide

## ✅ App Stopped Locally

All services have been stopped:
- ✅ API Server stopped
- ✅ Worker Service stopped  
- ✅ Frontend stopped
- ✅ Docker containers stopped

## 📦 Deploy to Production (3 Steps)

### Step 1: Push to GitHub

```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker"

# Initialize git (if not done)
git init
git add .
git commit -m "Financial Portfolio Tracker - Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/financial-portfolio-tracker.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend (Railway - Recommended)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository

**Add MongoDB:**
- Click "+ New" → "Database" → "MongoDB"
- Copy the connection string

**Add Redis:**
- Click "+ New" → "Database" → "Redis"
- Copy connection details

**Configure API Service:**
- Root Directory: `/`
- Build Command: `npm install`
- Start Command: `PORT=$PORT npm run start:api`
- Environment Variables:
  ```
  API_PORT=$PORT
  MONGODB_URI=${{MongoDB.DATABASE_URL}}
  REDIS_HOST=${{Redis.REDIS_HOST}}
  REDIS_PORT=${{Redis.REDIS_PORT}}
  REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
  NODE_ENV=production
  ```

**Configure Worker Service:**
- Add another service
- Build Command: `npm install`
- Start Command: `npm run start:worker`
- Same environment variables as API

5. Copy your API URL (e.g., `https://your-app.railway.app`)

### Step 3: Deploy Frontend (Vercel - Free)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Environment Variables**:
     ```
     REACT_APP_API_URL=https://your-api-url.railway.app
     ```
6. Click "Deploy"

## 🎉 Done!

Your app is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-api.railway.app`

## 📝 Update CORS (Important!)

After deployment, update your API server CORS to allow your frontend domain:

In Railway, add environment variable:
```
FRONTEND_URL=https://your-app.vercel.app
```

Then update `api-server/index.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## 🔄 Update & Redeploy

Any time you make changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Both Railway and Vercel will automatically redeploy!

## 💰 Cost

- **Vercel**: Free (hobby plan)
- **Railway**: $5/month (after free trial) or use free tier
- **MongoDB Atlas**: Free (M0 tier)
- **Redis Cloud**: Free (30MB)

**Total: ~$5/month or FREE with careful resource usage**

## 📚 Full Guide

See `DEPLOYMENT_GUIDE.md` for detailed instructions and alternative platforms.

