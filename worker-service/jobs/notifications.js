const PortfolioValuation = require('../../api-server/models/PortfolioValuation');
const Portfolio = require('../../api-server/models/Portfolio');

module.exports = async (job) => {
  const { portfolioId, threshold, type = 'daily' } = job.data;
  
  try {
    console.log(`📧 Processing notification job (${type})...`);

    // Get latest valuations
    let portfolios;
    if (portfolioId) {
      portfolios = [await Portfolio.findById(portfolioId)];
      portfolios = portfolios.filter(p => p !== null);
    } else {
      portfolios = await Portfolio.find();
    }

    if (portfolios.length === 0) {
      return { message: 'No portfolios found' };
    }

    const notifications = [];

    for (const portfolio of portfolios) {
      // Get latest valuation
      const latestValuation = await PortfolioValuation.findOne({ portfolioId: portfolio._id })
        .sort({ timestamp: -1 });

      if (!latestValuation) {
        continue;
      }

      // Check for significant changes
      const significantLoss = latestValuation.totalGainLossPercent < -5; // 5% loss
      const significantGain = latestValuation.totalGainLossPercent > 10; // 10% gain

      if (significantLoss || significantGain) {
        const notification = {
          portfolioId: portfolio._id,
          portfolioName: portfolio.name,
          userId: portfolio.userId,
          type: significantLoss ? 'loss_alert' : 'gain_alert',
          message: significantLoss
            ? `⚠️ Portfolio "${portfolio.name}" has dropped ${Math.abs(latestValuation.totalGainLossPercent).toFixed(2)}%`
            : `🎉 Portfolio "${portfolio.name}" has gained ${latestValuation.totalGainLossPercent.toFixed(2)}%`,
          valuation: {
            totalValue: latestValuation.totalValue,
            totalGainLoss: latestValuation.totalGainLoss,
            totalGainLossPercent: latestValuation.totalGainLossPercent,
          },
          timestamp: new Date().toISOString(),
        };

        notifications.push(notification);
        
        // In a real application, you would send this via email, push notification, etc.
        console.log(`📧 Notification: ${notification.message}`);
      }
    }

    return {
      message: `Processed ${notifications.length} notification(s)`,
      notifications: notifications.length,
    };
  } catch (error) {
    console.error('Notification job error:', error);
    throw error;
  }
};

