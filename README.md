# Financial Portfolio Tracker

A comprehensive Crypto/Stock Portfolio Tracker with real-time API integration, background job processing, and event-driven task scheduling.

## 🎯 Resume Pitch

> "Built a Crypto/Stock Portfolio Tracker integrating with the CoinGecko/IEX Cloud API to fetch real-time data. Implemented a Background Job Queue (Redis/Bull) and Cron Jobs for scheduled portfolio valuation, notification delivery, and historical data caching."

## ✨ Core Features

- **External API Integration**: Real-time price data from CoinGecko (crypto) and IEX Cloud (stocks)
- **Background Job Queue**: Redis/Bull for asynchronous task processing
- **Event-Driven Scheduling**: Cron jobs for automated portfolio valuation and data caching
- **Dual Backend Architecture**: Fast API server + Separate Worker service
- **Data Caching**: Redis caching for API responses to reduce external API calls
- **Portfolio Management**: Create portfolios, add holdings, track performance
- **Real-time Visualization**: Chart.js integration for portfolio value trends
- **Historical Data**: Automated caching of historical price data

## 🏗️ Architecture

### System Flow

```
User Request → API Endpoint → Redis Cache Check
                              ↓ (Cache Miss)
                              External Financial API
                              ↓
                              Cache Result → Return to User

Cron Scheduler → Add Job to Queue → Redis/Bull Queue
                                      ↓
                                      Worker Service
                                      ↓
                                      Perform Heavy Calculation
                                      ↓
                                      Update DB / Send Notification
```

### Tech Stack

- **Frontend**: React with Chart.js for visualization
- **Backend**: Node.js with Express
- **Cache/Queue**: Redis (message broker + caching)
- **Database**: MongoDB
- **Job Queue**: Bull (Redis-based)
- **Scheduling**: node-cron

## 📁 Project Structure

```
Financial Portfolio Tracker/
├── api-server/              # Fast user-facing API
│   ├── index.js            # API server entry point
│   ├── routes/             # API routes
│   │   ├── portfolio.js
│   │   ├── price.js
│   │   └── valuation.js
│   ├── services/           # Business logic
│   │   ├── priceService.js # External API integration
│   │   └── cacheService.js # Redis caching
│   └── models/             # MongoDB models
│       ├── Portfolio.js
│       └── PortfolioValuation.js
├── worker-service/         # Background worker service
│   ├── index.js           # Worker entry point
│   └── jobs/              # Background job processors
│       ├── portfolioValuation.js
│       ├── historicalData.js
│       └── notifications.js
├── frontend/              # React frontend
│   ├── src/
│   │   ├── App.js
│   │   └── components/
│   └── public/
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (running locally or connection string)
- Redis (running locally)

### Installation

1. **Clone and install dependencies:**

```bash
cd "Financial Portfolio Tracker"
npm install
cd frontend
npm install
cd ..
```

2. **Set up environment variables:**

```bash
cp .env.example .env
```

Edit `.env` and add your IEX Cloud API key (optional, for stock data):
```
IEX_CLOUD_API_KEY=your_api_key_here
```

3. **Start MongoDB and Redis:**

```bash
# MongoDB (if running locally)
mongod

# Redis (if running locally)
redis-server
```

4. **Start the services:**

```bash
# Terminal 1: Start API server
npm run start:api

# Terminal 2: Start Worker service
npm run start:worker

# Terminal 3: Start Frontend
cd frontend
npm start
```

Or use the dev script to run API and Worker concurrently:
```bash
npm run dev
```

## 📡 API Endpoints

### Portfolio Management
- `GET /api/portfolio` - Get all portfolios
- `GET /api/portfolio/:id` - Get portfolio by ID
- `POST /api/portfolio` - Create new portfolio
- `POST /api/portfolio/:id/holdings` - Add holding to portfolio
- `PUT /api/portfolio/:id/holdings/:holdingId` - Update holding
- `DELETE /api/portfolio/:id/holdings/:holdingId` - Delete holding

### Price Data
- `GET /api/price/:assetType/:symbol` - Get current price (cached)
- `POST /api/price/batch` - Get multiple prices

### Valuation
- `GET /api/valuation/portfolio/:portfolioId` - Get latest valuation
- `GET /api/valuation/portfolio/:portfolioId/history` - Get valuation history
- `POST /api/valuation/portfolio/:portfolioId/calculate` - Trigger manual valuation

## ⚙️ Background Jobs

### Scheduled Tasks (Cron Jobs)

1. **Daily Portfolio Valuation** (9:00 AM UTC)
   - Calculates total portfolio value
   - Updates gain/loss metrics
   - Stores valuation history

2. **Hourly Portfolio Valuation**
   - Real-time portfolio updates
   - Keeps valuations current

3. **Historical Data Caching** (Every 6 hours)
   - Fetches 30-day price history
   - Caches in Redis for fast access

### Job Types

- `portfolio-valuation`: Calculate portfolio value and performance
- `historical-data`: Cache historical price data
- `send-notification`: Send alerts for significant gains/losses

## 🔄 How It Works

1. **Price Fetching with Caching:**
   - User requests price → Check Redis cache
   - Cache hit → Return immediately
   - Cache miss → Fetch from CoinGecko/IEX → Cache result → Return

2. **Background Processing:**
   - Cron scheduler triggers job
   - Job added to Bull queue
   - Worker service processes job
   - Results stored in database

3. **Portfolio Valuation:**
   - Worker fetches current prices (using cache when available)
   - Calculates total value, cost basis, gain/loss
   - Stores valuation in MongoDB
   - Can trigger notifications for significant changes

## 🎨 Frontend Features

- Portfolio list view
- Portfolio detail with holdings
- Real-time price display
- Portfolio value chart (30-day history)
- Add/remove holdings
- Valuation summary cards

## 🔧 Configuration

Key environment variables:
- `API_PORT`: API server port (default: 3000)
- `REDIS_HOST`: Redis host (default: localhost)
- `REDIS_PORT`: Redis port (default: 6379)
- `MONGODB_URI`: MongoDB connection string
- `COINGECKO_API_URL`: CoinGecko API endpoint
- `IEX_CLOUD_API_KEY`: IEX Cloud API key (for stocks)
- `CACHE_TTL`: Cache time-to-live in seconds (default: 300)
- `QUEUE_NAME`: Bull queue name (default: portfolio-jobs)

## 📊 Example Usage

1. **Create a Portfolio:**
   ```bash
   POST /api/portfolio
   {
     "name": "My Crypto Portfolio",
     "userId": "user1"
   }
   ```

2. **Add Holdings:**
   ```bash
   POST /api/portfolio/{id}/holdings
   {
     "symbol": "bitcoin",
     "assetType": "crypto",
     "quantity": 0.5,
     "purchasePrice": 45000
   }
   ```

3. **Get Portfolio Valuation:**
   ```bash
   GET /api/valuation/portfolio/{id}
   ```

## 🎓 Skills Demonstrated

- ✅ External API Integration (REST)
- ✅ Background Processing/Job Queues (Bull/Redis)
- ✅ Data Caching (Redis)
- ✅ Event-Driven Task Scheduling (Cron)
- ✅ Microservices Architecture (API + Worker)
- ✅ Real-time Data Processing
- ✅ Database Design (MongoDB)
- ✅ Frontend Development (React + Chart.js)

## 🐛 Troubleshooting

- **Redis connection errors**: Ensure Redis is running on the configured port
- **MongoDB errors**: Check MongoDB connection string and ensure MongoDB is running
- **API rate limits**: CoinGecko has rate limits; caching helps mitigate this
- **IEX Cloud errors**: Stock data requires a valid API key

## 📝 Notes

- CoinGecko API is free and doesn't require an API key
- IEX Cloud requires an API key for stock data (free tier available)
- Redis caching significantly reduces external API calls
- Worker service can be scaled independently from API server
- Historical data is cached to reduce API load

## 🔮 Future Enhancements

- User authentication and authorization
- Email/push notifications
- More chart types and analytics
- Portfolio rebalancing suggestions
- Multi-currency support
- WebSocket for real-time price updates
- Portfolio comparison features

---

Built with ❤️ for demonstrating event-driven architecture and background job processing in fintech applications.

