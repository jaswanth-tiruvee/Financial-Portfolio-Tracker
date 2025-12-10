# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  - Portfolio Management UI                                      │
│  - Real-time Price Display                                      │
│  - Chart.js Visualization                                       │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP/REST
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                    API Server (Express)                          │
│  - Fast User-Facing API                                         │
│  - Portfolio CRUD Operations                                    │
│  - Price Endpoints (with caching)                               │
│  - Valuation Endpoints                                          │
└──────┬──────────────────────────────┬───────────────────────────┘
       │                              │
       │                              │
┌──────▼──────────┐         ┌────────▼──────────┐
│   MongoDB       │         │   Redis Cache     │
│   - Portfolios  │         │   - Price Cache   │
│   - Valuations  │         │   - Historical    │
│   - Holdings    │         │   - TTL: 5min     │
└─────────────────┘         └───────────────────┘
                                     │
                                     │
                            ┌────────▼──────────┐
                            │  Redis/Bull Queue │
                            │  - Job Queue     │
                            │  - Message Broker│
                            └────────┬──────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────┐
│                  Worker Service (Background)                     │
│  - Portfolio Valuation Jobs                                      │
│  - Historical Data Caching                                       │
│  - Notification Processing                                       │
│  - Cron Job Scheduler                                            │
└─────────────────────────────────────────────────────────────────┘
                                     │
                                     │
┌────────────────────────────────────▼────────────────────────────┐
│              External APIs                                       │
│  - CoinGecko API (Crypto)                                        │
│  - IEX Cloud API (Stocks)                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Price Request Flow
```
User → API → Redis Cache Check
              ├─ Cache Hit → Return Cached Data
              └─ Cache Miss → External API → Cache Result → Return
```

### 2. Background Job Flow
```
Cron Scheduler → Add Job to Queue → Redis/Bull Queue
                                          │
                                          ▼
                                    Worker Service
                                          │
                                          ▼
                              Process Job (Heavy Calculation)
                                          │
                                          ▼
                              Update MongoDB / Send Notification
```

### 3. Portfolio Valuation Flow
```
Cron Trigger → Queue Job → Worker Picks Up
                              │
                              ▼
                    Fetch All Portfolios
                              │
                              ▼
                    For Each Portfolio:
                      - Get Holdings
                      - Fetch Current Prices (with cache)
                      - Calculate Value, Gain/Loss
                      - Store Valuation in MongoDB
                      - Check for Notifications
```

## Component Responsibilities

### API Server
- **Purpose**: Fast, user-facing API
- **Responsibilities**:
  - Handle HTTP requests
  - Portfolio CRUD operations
  - Price fetching with caching
  - Trigger background jobs
- **Port**: 3000

### Worker Service
- **Purpose**: Background task processing
- **Responsibilities**:
  - Process queued jobs
  - Scheduled portfolio valuations
  - Historical data caching
  - Notification generation
- **Port**: 3001 (for health checks)

### Redis
- **Dual Role**:
  1. **Cache Layer**: Store API responses (5min TTL)
  2. **Message Broker**: Bull queue for job processing

### MongoDB
- **Collections**:
  - `portfolios`: User portfolios and holdings
  - `portfoliovaluations`: Historical valuation snapshots

## Job Types

### 1. Portfolio Valuation (`portfolio-valuation`)
- **Trigger**: Cron (hourly + daily)
- **Process**:
  1. Fetch portfolios
  2. Get current prices (cached when possible)
  3. Calculate total value, cost basis, gain/loss
  4. Store valuation snapshot
- **Output**: MongoDB document

### 2. Historical Data (`historical-data`)
- **Trigger**: Cron (every 6 hours)
- **Process**:
  1. Get all unique assets from portfolios
  2. Fetch 30-day price history
  3. Cache in Redis (1 hour TTL)
- **Output**: Redis cache entries

### 3. Notifications (`send-notification`)
- **Trigger**: After valuation (if thresholds met)
- **Process**:
  1. Check latest valuation
  2. Compare against thresholds (5% loss, 10% gain)
  3. Generate notification
- **Output**: Console log (extendable to email/push)

## Cron Schedule

| Job | Schedule | Description |
|-----|----------|-------------|
| Daily Valuation | `0 9 * * *` | 9:00 AM UTC daily |
| Hourly Valuation | `0 * * * *` | Every hour |
| Historical Cache | `0 */6 * * *` | Every 6 hours |

## Scalability Considerations

1. **API Server**: Can be horizontally scaled (stateless)
2. **Worker Service**: Can run multiple instances (Bull handles distribution)
3. **Redis**: Can use Redis Cluster for high availability
4. **MongoDB**: Can use replica sets for read scaling

## Security Notes

- Add authentication/authorization in production
- Validate and sanitize all inputs
- Rate limit API endpoints
- Secure Redis and MongoDB connections
- Use environment variables for secrets
- Implement CORS properly for production

