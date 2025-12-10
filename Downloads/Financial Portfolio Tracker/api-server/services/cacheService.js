const redis = require('redis');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected && this.client) {
      return;
    }

    try {
      this.client = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected');
        this.isConnected = true;
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      // Continue without cache if Redis is unavailable
      this.isConnected = false;
    }
  }

  async get(key) {
    try {
      await this.connect();
      if (!this.isConnected || !this.client) {
        return null;
      }
      return await this.client.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 300) {
    try {
      await this.connect();
      if (!this.isConnected || !this.client) {
        return;
      }
      await this.client.setEx(key, ttlSeconds, value);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key) {
    try {
      await this.connect();
      if (!this.isConnected || !this.client) {
        return;
      }
      await this.client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async flush() {
    try {
      await this.connect();
      if (!this.isConnected || !this.client) {
        return;
      }
      await this.client.flushAll();
    } catch (error) {
      console.error('Cache flush error:', error);
    }
  }
}

module.exports = new CacheService();

