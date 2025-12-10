# ✅ Free Deployment Checklist

Follow this checklist step by step. Each step takes 1-3 minutes.

## 📝 Pre-Deployment

- [ ] Code is ready
- [ ] All files committed locally

## 1️⃣ GitHub Setup (2 min)

- [ ] Create account at https://github.com (if needed)
- [ ] Create new repository: `financial-portfolio-tracker`
- [ ] Run these commands:
  ```bash
  git init
  git add .
  git commit -m "Financial Portfolio Tracker"
  git remote add origin https://github.com/YOUR_USERNAME/financial-portfolio-tracker.git
  git branch -M main
  git push -u origin main
  ```
- [ ] ✅ Code is on GitHub

## 2️⃣ MongoDB Atlas (3 min)

- [ ] Sign up at https://mongodb.com/cloud/atlas/register
- [ ] Create free M0 cluster
- [ ] Create database user (save password!)
- [ ] Whitelist IP: 0.0.0.0/0 (allow all)
- [ ] Copy connection string
- [ ] ✅ MongoDB ready: `mongodb+srv://...`

## 3️⃣ Upstash Redis (2 min)

- [ ] Sign up at https://upstash.com
- [ ] Create free database
- [ ] Copy `UPSTASH_REDIS_REST_URL`
- [ ] Copy `UPSTASH_REDIS_REST_TOKEN`
- [ ] ✅ Redis ready

## 4️⃣ Render - API Service (5 min)

- [ ] Sign up at https://render.com (with GitHub)
- [ ] New → Web Service
- [ ] Connect GitHub repo
- [ ] Configure:
  - Name: `portfolio-api`
  - Build: `npm install`
  - Start: `PORT=$PORT npm run start:api`
  - Plan: **Free**
- [ ] Add environment variables:
  - `API_PORT=$PORT`
  - `MONGODB_URI=your_mongodb_uri`
  - `UPSTASH_REDIS_REST_URL=your_url`
  - `UPSTASH_REDIS_REST_TOKEN=your_token`
  - `FRONTEND_URL=https://xxx.vercel.app` (update after Vercel)
  - `NODE_ENV=production`
- [ ] Deploy and wait
- [ ] Copy API URL: `https://xxx.onrender.com`
- [ ] ✅ API deployed

## 5️⃣ Render - Worker Service (3 min)

- [ ] New → Background Worker
- [ ] Same repo
- [ ] Configure:
  - Name: `portfolio-worker`
  - Build: `npm install`
  - Start: `npm run start:worker`
  - Plan: **Free**
- [ ] Add same environment variables (except API_PORT)
- [ ] Deploy
- [ ] ✅ Worker deployed

## 6️⃣ Vercel - Frontend (3 min)

- [ ] Sign up at https://vercel.com (with GitHub)
- [ ] Import project
- [ ] Configure:
  - Root Directory: `frontend`
  - Framework: Create React App
- [ ] Add environment variable:
  - `REACT_APP_API_URL=https://xxx.onrender.com` (your Render API URL)
- [ ] Deploy
- [ ] Copy frontend URL: `https://xxx.vercel.app`
- [ ] ✅ Frontend deployed

## 7️⃣ Final Setup (2 min)

- [ ] Go back to Render API service
- [ ] Update `FRONTEND_URL` to your Vercel URL
- [ ] Save (auto-redeploys)
- [ ] ✅ CORS configured

## 8️⃣ Test (2 min)

- [ ] Open your Vercel URL
- [ ] Create a portfolio
- [ ] Add a holding (bitcoin, 0.5)
- [ ] See prices load
- [ ] ✅ App working!

## 🎉 Done!

Your app URLs:
- Frontend: `https://________________.vercel.app`
- API: `https://________________.onrender.com`

## 💡 Pro Tips

- [ ] Set up UptimeRobot (free) to ping Render API every 5 min
  - Prevents cold starts
  - Go to https://uptimerobot.com
  - Add monitor for your Render API URL

## 📚 Need Help?

- See `FREE_DEPLOYMENT.md` for detailed instructions
- See `SIMPLE_DEPLOY.md` for quick reference
- Check Render/Vercel logs if something doesn't work

---

**Total time: ~20 minutes**
**Total cost: $0.00** 🎉

