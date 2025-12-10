const mongoose = require('mongoose');

const portfolioValuationSchema = new mongoose.Schema({
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true,
  },
  totalValue: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  totalGainLoss: {
    type: Number,
    required: true,
  },
  totalGainLossPercent: {
    type: Number,
    required: true,
  },
  holdings: [{
    symbol: String,
    assetType: String,
    quantity: Number,
    currentPrice: Number,
    currentValue: Number,
    costBasis: Number,
    gainLoss: Number,
    gainLossPercent: Number,
  }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
portfolioValuationSchema.index({ portfolioId: 1, timestamp: -1 });

module.exports = mongoose.model('PortfolioValuation', portfolioValuationSchema);

