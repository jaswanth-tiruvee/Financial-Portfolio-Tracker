const express = require('express');
const router = express.Router();
const priceService = require('../services/priceService');
// Use Upstash if available, otherwise fallback to Redis
const cacheService = process.env.UPSTASH_REDIS_REST_URL 
  ? require('../services/upstashCacheService')
  : require('../services/cacheService');

// Get current price for an asset
router.get('/:assetType/:symbol', async (req, res) => {
  try {
    const { assetType, symbol } = req.params;
    
    // Check cache first
    const cacheKey = `price:${assetType}:${symbol}`;
    const cachedPrice = await cacheService.get(cacheKey);
    
    if (cachedPrice) {
      return res.json({ ...JSON.parse(cachedPrice), cached: true });
    }

    // Fetch from external API
    const price = await priceService.getCurrentPrice(assetType, symbol);
    
    // Cache the result
    await cacheService.set(cacheKey, JSON.stringify(price), process.env.CACHE_TTL || 300);
    
    res.json({ ...price, cached: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get multiple prices
router.post('/batch', async (req, res) => {
  try {
    const { assets } = req.body; // [{ assetType: 'crypto', symbol: 'bitcoin' }, ...]
    
    const prices = await Promise.all(
      assets.map(async (asset) => {
        const cacheKey = `price:${asset.assetType}:${asset.symbol}`;
        const cachedPrice = await cacheService.get(cacheKey);
        
        if (cachedPrice) {
          return { ...JSON.parse(cachedPrice), cached: true };
        }

        const price = await priceService.getCurrentPrice(asset.assetType, asset.symbol);
        await cacheService.set(cacheKey, JSON.stringify(price), process.env.CACHE_TTL || 300);
        
        return { ...price, cached: false };
      })
    );

    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

