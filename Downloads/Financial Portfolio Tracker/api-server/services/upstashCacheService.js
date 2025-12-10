const axios = require('axios');

class UpstashCacheService {
  constructor() {
    this.restUrl = process.env.UPSTASH_REDIS_REST_URL;
    this.restToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    this.isConnected = !!(this.restUrl && this.restToken);
    
    if (this.isConnected) {
      console.log('✅ Upstash Redis connected');
    } else {
      console.log('⚠️  Upstash Redis not configured, using fallback');
    }
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
      console.error('Upstash cache get error:', error.message);
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
      console.error('Upstash cache set error:', error.message);
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
      console.error('Upstash cache delete error:', error.message);
    }
  }

  async flush() {
    // Upstash REST API doesn't support FLUSHALL
    // This is a no-op for Upstash
    console.log('Upstash: FLUSHALL not supported via REST API');
  }
}

module.exports = new UpstashCacheService();

