# 🔐 Environment Variables Template

Copy these when setting up your services. Replace the placeholders with your actual values.

## 📝 MongoDB Atlas

After creating your cluster, you'll get a connection string like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio-tracker?retryWrites=true&w=majority
```

**Save this as:** `MONGODB_URI`

---

## 📝 Upstash Redis

After creating your database, you'll get:
- **UPSTASH_REDIS_REST_URL**: `https://xxxxx.upstash.io`
- **UPSTASH_REDIS_REST_TOKEN**: `xxxxx` (long string)

**Save both of these!**

---

## 🎯 Render - API Service Environment Variables

Add these in Render dashboard → Your API Service → Environment:

```
API_PORT=$PORT
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio-tracker?retryWrites=true&w=majority
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
COINGECKO_API_URL=https://api.coingecko.com/api/v3
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**Note:** Set `FRONTEND_URL` after you deploy to Vercel (Step 5)

---

## 🎯 Render - Worker Service Environment Variables

Add these in Render dashboard → Your Worker Service → Environment:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio-tracker?retryWrites=true&w=majority
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
REDIS_HOST=localhost
REDIS_PORT=6379
QUEUE_NAME=portfolio-jobs
NODE_ENV=production
```

---

## 🎯 Vercel - Frontend Environment Variables

Add this in Vercel dashboard → Your Project → Settings → Environment Variables:

```
REACT_APP_API_URL=https://your-api-name.onrender.com
```

**Replace `your-api-name` with your actual Render API service name!**

---

## 📋 Quick Copy Checklist

When setting up, have these ready:

- [ ] MongoDB connection string
- [ ] Upstash REST URL
- [ ] Upstash REST Token
- [ ] Render API URL (after deployment)
- [ ] Vercel Frontend URL (after deployment)

---

**Tip:** Keep this file open while setting up your services!

