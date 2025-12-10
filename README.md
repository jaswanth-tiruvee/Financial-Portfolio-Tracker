# Financial Portfolio Tracker

A Crypto/Stock Portfolio Tracker with real-time API integration, background job processing, and event-driven task scheduling.

## 🎯 Features

- Real-time price data from CoinGecko (crypto) and IEX Cloud (stocks)
- Background job queue (Redis/Bull) for asynchronous processing
- Scheduled portfolio valuation and data caching
- Dual backend architecture (API server + Worker service)
- Redis caching for API responses
- Portfolio management with real-time visualization

## 🏗️ Tech Stack

- **Frontend**: React with Chart.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Cache/Queue**: Redis
- **Job Queue**: Bull
- **Scheduling**: node-cron

## 📁 Project Structure

```
├── api-server/          # API server
│   ├── routes/         # API endpoints
│   ├── services/       # Business logic
│   └── models/         # Database models
├── worker-service/     # Background worker
│   └── jobs/           # Job processors
└── frontend/           # React frontend
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB
- Redis

### Installation

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

Create a `.env` file with:

```env
API_PORT=3001
MONGODB_URI=your_mongodb_connection_string
REDIS_HOST=localhost
REDIS_PORT=6379
COINGECKO_API_URL=https://api.coingecko.com/api/v3
IEX_CLOUD_API_KEY=your_iex_api_key_optional
CACHE_TTL=300
QUEUE_NAME=portfolio-jobs
FRONTEND_URL=http://localhost:3000
```

### Run

```bash
# Terminal 1: API Server
npm run start:api

# Terminal 2: Worker Service
npm run start:worker

# Terminal 3: Frontend
cd frontend && npm start
```

## 📡 API Endpoints

- `GET /api/portfolio` - Get all portfolios
- `POST /api/portfolio` - Create portfolio
- `POST /api/portfolio/:id/holdings` - Add holding
- `GET /api/price/:assetType/:symbol` - Get price
- `GET /api/valuation/portfolio/:id` - Get valuation

## ⚙️ Background Jobs

- Daily portfolio valuation (9:00 AM UTC)
- Hourly portfolio valuation
- Historical data caching (every 6 hours)

## 📝 License

MIT
