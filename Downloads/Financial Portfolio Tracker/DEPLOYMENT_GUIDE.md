# 🚀 Deployment Guide - Host Live from GitHub

This guide shows you how to deploy your Financial Portfolio Tracker to production using various hosting platforms.

## 📋 Pre-Deployment Checklist

### 1. Prepare Your GitHub Repository

```bash
# Initialize git (if not already done)
cd "/Users/abc/Downloads/Financial Portfolio Tracker"
git init

# Create .gitignore (already exists, but verify)
# Make sure it includes: node_modules/, .env, *.log, dist/, build/

# Add all files
git add .

# Commit
git commit -m "Initial commit: Financial Portfolio Tracker"

# Create GitHub repository and push
# Go to https://github.com/new
# Create a new repository (e.g., "financial-portfolio-tracker")
# Then run:

git remote add origin https://github.com/YOUR_USERNAME/financial-portfolio-tracker.git
git branch -M main
git push -u origin main
```

### 2. Environment Variables

Create a `.env.example` file (already exists) and document all required variables:

```env
API_PORT=3001
WORKER_PORT=3002
REDIS_HOST=your-redis-host
REDIS_PORT=6379
MONGODB_URI=your-mongodb-connection-string
COINGECKO_API_URL=https://api.coingecko.com/api/v3
IEX_CLOUD_API_URL=https://cloud.iexapis.com/stable
IEX_CLOUD_API_KEY=your_iex_api_key
CACHE_TTL=300
HISTORICAL_CACHE_TTL=3600
QUEUE_NAME=portfolio-jobs
```

## 🌐 Deployment Options

## Option 1: Railway (Recommended - Easiest)

Railway supports MongoDB, Redis, and Node.js out of the box.

### Steps:

1. **Sign up at** https://railway.app
2. **Connect GitHub** and select your repository
3. **Add Services:**

   **Service 1: API Server**
   - Root Directory: `/` (or leave blank)
   - Build Command: `npm install`
   - Start Command: `PORT=$PORT npm run start:api`
   - Environment Variables:
     ```
     API_PORT=$PORT
     MONGODB_URI=${{MongoDB.DATABASE_URL}}
     REDIS_HOST=${{Redis.REDIS_HOST}}
     REDIS_PORT=${{Redis.REDIS_PORT}}
     REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
     ```

   **Service 2: Worker Service**
   - Root Directory: `/` (or leave blank)
   - Build Command: `npm install`
   - Start Command: `npm run start:worker`
   - Environment Variables: (same as API Server)

   **Service 3: MongoDB**
   - Add MongoDB plugin from Railway
   - Copy the connection string

   **Service 4: Redis**
   - Add Redis plugin from Railway
   - Copy connection details

4. **Deploy Frontend:**
   - Use Vercel or Netlify (see Option 2)
   - Set `REACT_APP_API_URL` to your Railway API URL

## Option 2: Vercel (Frontend) + Railway/Heroku (Backend)

### Frontend on Vercel:

1. **Sign up at** https://vercel.com
2. **Import GitHub repository**
3. **Configure:**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Environment Variables:
     ```
     REACT_APP_API_URL=https://your-api-url.railway.app
     ```

4. **Deploy!**

### Backend on Railway/Heroku:

**Railway (Easier):**
- Follow Option 1 steps for backend services

**Heroku:**
```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create apps
heroku create your-api-name
heroku create your-worker-name

# Add MongoDB (MongoDB Atlas free tier)
heroku addons:create mongolab:sandbox --app your-api-name

# Add Redis (Redis Cloud free tier)
heroku addons:create rediscloud:30 --app your-api-name

# Set environment variables
heroku config:set API_PORT=$PORT --app your-api-name
heroku config:set MONGODB_URI=$(heroku config:get MONGODB_URI --app your-api-name) --app your-api-name

# Deploy
git push heroku main
```

## Option 3: Render (All-in-One)

1. **Sign up at** https://render.com
2. **Create Web Service for API:**
   - Connect GitHub repo
   - Build Command: `npm install`
   - Start Command: `PORT=$PORT npm run start:api`
   - Environment: Node
   - Add MongoDB and Redis from Render's database options

3. **Create Background Worker:**
   - Type: Background Worker
   - Build Command: `npm install`
   - Start Command: `npm run start:worker`

4. **Create Static Site for Frontend:**
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

## Option 4: DigitalOcean App Platform

1. **Sign up at** https://www.digitalocean.com
2. **Create App from GitHub**
3. **Add Components:**
   - API Server (Web Service)
   - Worker Service (Worker)
   - Frontend (Static Site)
   - MongoDB Database
   - Redis Database

## 📝 Required Code Changes for Production

### 1. Update Frontend API URL

Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-api-url.com
```

Update `frontend/src/App.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

### 2. Update CORS Settings

In `api-server/index.js`, update CORS:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### 3. Add Production Build Scripts

Update `package.json`:
```json
{
  "scripts": {
    "build": "cd frontend && npm install && npm run build",
    "start:prod": "NODE_ENV=production node api-server/index.js"
  }
}
```

### 4. Create Procfile (for Heroku/Railway)

Create `Procfile`:
```
web: npm run start:api
worker: npm run start:worker
```

## 🔐 Environment Variables Setup

### For API Server:
```env
NODE_ENV=production
API_PORT=$PORT
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio-tracker
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
COINGECKO_API_URL=https://api.coingecko.com/api/v3
IEX_CLOUD_API_KEY=your_key_here
CACHE_TTL=300
```

### For Worker Service:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio-tracker
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
QUEUE_NAME=portfolio-jobs
```

### For Frontend:
```env
REACT_APP_API_URL=https://your-api-url.com
```

## 🗄️ Database Setup

### MongoDB Atlas (Free Tier):

1. **Sign up at** https://www.mongodb.com/cloud/atlas
2. **Create cluster** (free M0 tier)
3. **Get connection string:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/portfolio-tracker?retryWrites=true&w=majority
   ```
4. **Add your IP** to network access (or 0.0.0.0/0 for all)

### Redis Cloud (Free Tier):

1. **Sign up at** https://redis.com/try-free/
2. **Create database**
3. **Get connection details:**
   - Host: `your-redis-host.redis.cloud`
   - Port: `12345`
   - Password: `your-password`

## 📦 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables configured
- [ ] MongoDB Atlas database created
- [ ] Redis Cloud database created
- [ ] CORS configured for production domain
- [ ] Frontend API URL updated
- [ ] Build scripts tested locally
- [ ] All services deployed
- [ ] Health checks passing
- [ ] Test portfolio creation
- [ ] Test price fetching

## 🧪 Post-Deployment Testing

1. **Test API Health:**
   ```bash
   curl https://your-api-url.com/health
   ```

2. **Test Frontend:**
   - Open your frontend URL
   - Create a portfolio
   - Add a holding
   - Verify prices load

3. **Check Worker:**
   - Wait for scheduled jobs (hourly/daily)
   - Check logs for job execution

## 🔄 Continuous Deployment

Most platforms auto-deploy on git push:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Platform automatically deploys!
```

## 📊 Monitoring

- **Railway**: Built-in logs and metrics
- **Vercel**: Analytics dashboard
- **Heroku**: `heroku logs --tail`
- **Render**: Logs dashboard

## 💰 Cost Estimates (Free Tiers)

- **Railway**: $5/month (after free trial)
- **Vercel**: Free (hobby)
- **MongoDB Atlas**: Free (M0)
- **Redis Cloud**: Free (30MB)
- **Total**: ~$5/month or free with Vercel + free tiers

## 🚨 Common Issues

### CORS Errors:
- Update CORS origin to your frontend URL
- Check environment variables

### Database Connection:
- Verify connection strings
- Check IP whitelist (MongoDB Atlas)
- Verify credentials

### Build Failures:
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check build logs

### Worker Not Running:
- Ensure worker service is deployed separately
- Check Redis connection
- Verify queue configuration

---

**Recommended Setup:**
- **Frontend**: Vercel (free, easy)
- **Backend API**: Railway (easy MongoDB/Redis setup)
- **Worker**: Railway (same platform)
- **Total Cost**: ~$5/month or free with careful resource management

