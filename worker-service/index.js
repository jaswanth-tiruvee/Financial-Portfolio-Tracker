const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Queue = require('bull');
const cron = require('node-cron');
const portfolioValuationJob = require('./jobs/portfolioValuation');
const historicalDataJob = require('./jobs/historicalData');
const notificationJob = require('./jobs/notifications');

dotenv.config();

const PORT = process.env.WORKER_PORT || 3001;

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Worker: MongoDB connected'))
.catch(err => console.error('❌ Worker: MongoDB connection error:', err));

// Create Bull queue
// For Upstash, we need to use the Redis URL format
const redisConfig = process.env.UPSTASH_REDIS_REST_URL 
  ? {
      // Upstash provides a Redis URL, but Bull needs host/port
      // For free tier, we'll use a workaround or disable queue
      // Note: Bull doesn't work directly with Upstash REST API
      // For production, consider using a full Redis instance or BullMQ with Upstash
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    }
  : {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    };

const queue = new Queue(process.env.QUEUE_NAME || 'portfolio-jobs', {
  redis: redisConfig,
});

// Queue event handlers
queue.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

queue.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});

queue.on('error', (error) => {
  console.error('❌ Queue error:', error);
});

// Process jobs
queue.process('portfolio-valuation', portfolioValuationJob);
queue.process('historical-data', historicalDataJob);
queue.process('send-notification', notificationJob);

// Cron Jobs - Schedule tasks
console.log('📅 Setting up cron jobs...');

// Daily portfolio valuation at 9 AM UTC
cron.schedule('0 9 * * *', async () => {
  console.log('🔄 Running daily portfolio valuation...');
  await queue.add('portfolio-valuation', {
    type: 'daily',
    timestamp: new Date().toISOString(),
  });
});

// Historical data caching every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('🔄 Running historical data cache update...');
  await queue.add('historical-data', {
    type: 'cache-update',
    timestamp: new Date().toISOString(),
  });
});

// Portfolio valuation every hour (for real-time updates)
cron.schedule('0 * * * *', async () => {
  console.log('🔄 Running hourly portfolio valuation...');
  await queue.add('portfolio-valuation', {
    type: 'hourly',
    timestamp: new Date().toISOString(),
  });
});

console.log(`🚀 Worker Service running on port ${PORT}`);
console.log('📋 Scheduled Jobs:');
console.log('   - Daily portfolio valuation: 9:00 AM UTC');
console.log('   - Hourly portfolio valuation: Every hour');
console.log('   - Historical data cache: Every 6 hours');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing queue...');
  await queue.close();
  await mongoose.connection.close();
  process.exit(0);
});

