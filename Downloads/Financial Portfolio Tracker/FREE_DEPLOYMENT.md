# 🆓 Free & Easy Deployment Guide

This guide uses **100% FREE** services - no credit card required!

## 🎯 What We'll Use (All Free)

- **Frontend**: Vercel (Free forever)
- **Backend API**: Render (Free tier)
- **Worker Service**: Render (Free tier)
- **MongoDB**: MongoDB Atlas (Free M0 tier)
- **Redis**: Upstash (Free tier)

## 📋 Step-by-Step (15 minutes)

### Step 1: Push Code to GitHub (2 minutes)

```bash
cd "/Users/abc/Downloads/Financial Portfolio Tracker"

# Initialize git
git init
git add .
git commit -m "Financial Portfolio Tracker"

# Create a new repository on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/financial-portfolio-tracker.git
git branch -M main
git push -u origin main
```

**✅ Done!** Your code is on GitHub.

---

### Step 2: Set Up MongoDB Atlas (Free) (3 minutes)

1. **Go to** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** (free account)
3. **Create a free cluster:**
   - Choose **M0 (Free)** tier
   - Select a region close to you
   - Click "Create Cluster" (takes 3-5 minutes)
4. **Create database user:**
   - Click "Database Access" → "Add New Database User"
   - Username: `portfolio-user`
   - Password: Generate a secure password (save it!)
   - Click "Add User"
5. **Whitelist IP:**
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
6. **Get connection string:**
   - Click "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://portfolio-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/portfolio-tracker?retryWrites=true&w=majority`

**✅ Save this connection string!** You'll need it in Step 3.

---

### Step 3: Set Up Upstash Redis (Free) (2 minutes)

1. **Go to** https://upstash.com/
2. **Sign up** (free account)
3. **Create database:**
   - Click "Create Database"
   - Name: `portfolio-redis`
   - Type: Regional
   - Region: Choose closest to you
   - Click "Create"
4. **Get connection details:**
   - Click on your database
   - Copy these values:
     - **UPSTASH_REDIS_REST_URL**: `https://xxxxx.upstash.io`
     - **UPSTASH_REDIS_REST_TOKEN**: `xxxxx`

**✅ Save these!** You'll need them in Step 4.

---

### Step 4: Deploy Backend API on Render (Free) (5 minutes)

1. **Go to** https://render.com
2. **Sign up** with GitHub (free account)
3. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `financial-portfolio-tracker` repo
4. **Configure:**
   - **Name**: `portfolio-api` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `PORT=$PORT npm run start:api`
   - **Plan**: **Free** (select this!)
5. **Add Environment Variables:**
   Click "Add Environment Variable" and add these one by one:
   ```
   API_PORT=$PORT
   MONGODB_URI=mongodb+srv://portfolio-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/portfolio-tracker?retryWrites=true&w=majority
   REDIS_HOST=(we'll use Upstash REST API instead)
   UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxxxx
   COINGECKO_API_URL=https://api.coingecko.com/api/v3
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```
   (Replace with your actual values from Steps 2 & 3)
6. **Click "Create Web Service"**
   - Wait 5-10 minutes for first deployment
   - Copy your service URL (e.g., `https://portfolio-api.onrender.com`)

**✅ Save this URL!** You'll need it for the frontend.

---

### Step 5: Deploy Worker Service on Render (Free) (3 minutes)

1. **In Render dashboard**, click "New +" → "Background Worker"
2. **Configure:**
   - **Name**: `portfolio-worker`
   - **Repository**: Same as before
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start:worker`
   - **Plan**: **Free**
3. **Add Environment Variables** (same as API):
   ```
   MONGODB_URI=mongodb+srv://portfolio-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/portfolio-tracker?retryWrites=true&w=majority
   UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxxxx
   REDIS_HOST=localhost
   REDIS_PORT=6379
   QUEUE_NAME=portfolio-jobs
   NODE_ENV=production
   ```
4. **Click "Create Background Worker"**

**✅ Worker is deploying!**

---

### Step 6: Update Redis Connection Code

We need to update the code to use Upstash REST API instead of direct Redis connection.

**Create a new file:** `api-server/services/upstashCacheService.js`

```javascript
const axios = require('axios');

class UpstashCacheService {
  constructor() {
    this.restUrl = process.env.UPSTASH_REDIS_REST_URL;
    this.restToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    this.isConnected = !!(this.restUrl && this.restToken);
  }

  async get(key) {
    if (!this.isConnected) return null;
    
    try {
      const response = await axios.get(
        `${this.restUrl}/get/${encodeURIComponent(key)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.restToken}`
          }
        }
      );
      return response.data?.result || null;
    } catch (error) {
      console.error('Cache get error:', error.message);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 300) {
    if (!this.isConnected) return;
    
    try {
      await axios.post(
        `${this.restUrl}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}/EX/${ttlSeconds}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.restToken}`
          }
        }
      );
    } catch (error) {
      console.error('Cache set error:', error.message);
    }
  }

  async del(key) {
    if (!this.isConnected) return;
    
    try {
      await axios.post(
        `${this.restUrl}/del/${encodeURIComponent(key)}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.restToken}`
          }
        }
      );
    } catch (error) {
      console.error('Cache delete error:', error.message);
    }
  }
}

module.exports = new UpstashCacheService();
```

**Update `api-server/routes/price.js`** to use Upstash:
```javascript
// Change this line:
const cacheService = require('../services/cacheService');

// To:
const cacheService = process.env.UPSTASH_REDIS_REST_URL 
  ? require('../services/upstashCacheService')
  : require('../services/cacheService');
```

**Commit and push:**
```bash
git add .
git commit -m "Add Upstash Redis support"
git push origin main
```

Render will automatically redeploy!

---

### Step 7: Deploy Frontend on Vercel (Free) (3 minutes)

1. **Go to** https://vercel.com
2. **Sign up** with GitHub (free account)
3. **Import Project:**
   - Click "Add New" → "Project"
   - Import your GitHub repository
4. **Configure:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
5. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add: `REACT_APP_API_URL` = `https://portfolio-api.onrender.com` (your Render API URL)
6. **Click "Deploy"**
   - Wait 2-3 minutes
   - Your app is live! 🎉

**✅ Copy your Vercel URL** (e.g., `https://financial-portfolio-tracker.vercel.app`)

---

### Step 8: Update CORS (Final Step)

1. **Go back to Render** → Your API service
2. **Environment Variables** → Edit `FRONTEND_URL`
3. **Set it to**: `https://your-app.vercel.app` (your actual Vercel URL)
4. **Save** → Render will redeploy automatically

---

## 🎉 Done! Your App is Live!

- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://portfolio-api.onrender.com`

## 📝 Quick Reference

### Your URLs:
- Frontend: `https://________________.vercel.app`
- API: `https://________________.onrender.com`

### Your Credentials:
- MongoDB URI: `mongodb+srv://...`
- Upstash URL: `https://...`
- Upstash Token: `...`

## ⚠️ Important Notes (Free Tier Limitations)

### Render Free Tier:
- **Spins down after 15 minutes of inactivity**
- **First request after spin-down takes ~30 seconds** (cold start)
- **512MB RAM limit**
- **100GB bandwidth/month**

**Solution**: Use a free uptime monitor like:
- https://uptimerobot.com (free, checks every 5 minutes)
- Keeps your Render service awake

### MongoDB Atlas Free Tier:
- **512MB storage**
- **Shared cluster** (may be slower during peak times)

### Upstash Free Tier:
- **10,000 commands/day**
- **256MB storage**

**All of these are plenty for a portfolio tracker!**

## 🔄 Updating Your App

Any time you make changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Both Render and Vercel will automatically redeploy!

## 🆘 Troubleshooting

### API not responding?
- Check Render logs: Render dashboard → Your service → Logs
- First request after 15 min idle takes ~30 seconds (cold start)

### Frontend can't connect?
- Check `REACT_APP_API_URL` in Vercel environment variables
- Check CORS: Make sure `FRONTEND_URL` in Render matches your Vercel URL

### MongoDB connection error?
- Check your connection string
- Verify IP is whitelisted (0.0.0.0/0)
- Check database user password

### Redis errors?
- Verify Upstash credentials
- Check daily command limit (10,000/day)

---

## 💰 Total Cost: $0.00

Everything is free! No credit card required.

---

**Need help?** Check the logs in Render and Vercel dashboards - they're very helpful!

