const Portfolio = require('../../api-server/models/Portfolio');
const PortfolioValuation = require('../../api-server/models/PortfolioValuation');
const priceService = require('../../api-server/services/priceService');
const cacheService = require('../../api-server/services/cacheService');

module.exports = async (job) => {
  const { portfolioId, type = 'scheduled' } = job.data;
  
  try {
    console.log(`📊 Processing portfolio valuation job (${type})...`);

    // Get portfolios to value
    let portfolios;
    if (portfolioId) {
      portfolios = [await Portfolio.findById(portfolioId)];
      portfolios = portfolios.filter(p => p !== null);
    } else {
      portfolios = await Portfolio.find();
    }

    if (portfolios.length === 0) {
      console.log('No portfolios found to value');
      return { message: 'No portfolios found' };
    }

    const valuations = [];

    for (const portfolio of portfolios) {
      let totalValue = 0;
      let totalCost = 0;
      const holdingsValuation = [];

      // Calculate value for each holding
      for (const holding of portfolio.holdings) {
        try {
          // Get current price (check cache first)
          const cacheKey = `price:${holding.assetType}:${holding.symbol}`;
          let currentPrice;
          
          const cachedPrice = await cacheService.get(cacheKey);
          if (cachedPrice) {
            currentPrice = JSON.parse(cachedPrice).price;
          } else {
            const priceData = await priceService.getCurrentPrice(holding.assetType, holding.symbol);
            currentPrice = priceData.price;
            await cacheService.set(cacheKey, JSON.stringify(priceData), 300);
          }

          const currentValue = holding.quantity * currentPrice;
          const costBasis = holding.quantity * (holding.purchasePrice || 0);
          const gainLoss = currentValue - costBasis;
          const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

          totalValue += currentValue;
          totalCost += costBasis;

          holdingsValuation.push({
            symbol: holding.symbol,
            assetType: holding.assetType,
            quantity: holding.quantity,
            currentPrice,
            currentValue,
            costBasis,
            gainLoss,
            gainLossPercent,
          });
        } catch (error) {
          console.error(`Error valuing holding ${holding.symbol}:`, error.message);
        }
      }

      const totalGainLoss = totalValue - totalCost;
      const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

      // Save valuation
      const valuation = new PortfolioValuation({
        portfolioId: portfolio._id,
        totalValue,
        totalCost,
        totalGainLoss,
        totalGainLossPercent,
        holdings: holdingsValuation,
        timestamp: new Date(),
      });

      await valuation.save();
      valuations.push(valuation);

      console.log(`✅ Portfolio ${portfolio.name} valued at $${totalValue.toFixed(2)}`);
    }

    return {
      message: `Valuated ${valuations.length} portfolio(s)`,
      valuations: valuations.length,
    };
  } catch (error) {
    console.error('Portfolio valuation error:', error);
    throw error;
  }
};

