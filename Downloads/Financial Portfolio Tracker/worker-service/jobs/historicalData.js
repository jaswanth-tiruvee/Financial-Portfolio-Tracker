const Portfolio = require('../../api-server/models/Portfolio');
const priceService = require('../../api-server/services/priceService');
const cacheService = require('../../api-server/services/cacheService');

module.exports = async (job) => {
  const { type = 'cache-update' } = job.data;
  
  try {
    console.log(`📈 Processing historical data job (${type})...`);

    // Get all unique assets from all portfolios
    const portfolios = await Portfolio.find();
    const assetMap = new Map();

    portfolios.forEach(portfolio => {
      portfolio.holdings.forEach(holding => {
        const key = `${holding.assetType}:${holding.symbol}`;
        if (!assetMap.has(key)) {
          assetMap.set(key, {
            assetType: holding.assetType,
            symbol: holding.symbol,
          });
        }
      });
    });

    if (assetMap.size === 0) {
      console.log('No assets found for historical data caching');
      return { message: 'No assets found' };
    }

    const assets = Array.from(assetMap.values());
    let cached = 0;
    let errors = 0;

    // Fetch and cache historical data for each asset
    for (const asset of assets) {
      try {
        const historicalData = await priceService.getHistoricalData(
          asset.assetType,
          asset.symbol,
          30 // 30 days of history
        );

        // Cache the historical data
        const cacheKey = `historical:${asset.assetType}:${asset.symbol}:30d`;
        await cacheService.set(
          cacheKey,
          JSON.stringify(historicalData),
          process.env.HISTORICAL_CACHE_TTL || 3600
        );

        cached++;
        console.log(`✅ Cached historical data for ${asset.symbol}`);
      } catch (error) {
        console.error(`❌ Error caching historical data for ${asset.symbol}:`, error.message);
        errors++;
      }
    }

    return {
      message: `Historical data cache updated`,
      cached,
      errors,
      total: assets.length,
    };
  } catch (error) {
    console.error('Historical data job error:', error);
    throw error;
  }
};

