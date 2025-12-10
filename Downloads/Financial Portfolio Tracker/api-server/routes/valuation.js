const express = require('express');
const router = express.Router();
const PortfolioValuation = require('../models/PortfolioValuation');
const Queue = require('bull');

// Create queue connection (same as worker)
const queue = new Queue(process.env.QUEUE_NAME || 'portfolio-jobs', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});

// Get latest valuation for a portfolio
router.get('/portfolio/:portfolioId', async (req, res) => {
  try {
    const valuation = await PortfolioValuation.findOne({ portfolioId: req.params.portfolioId })
      .sort({ timestamp: -1 });

    if (!valuation) {
      return res.status(404).json({ error: 'No valuation found for this portfolio' });
    }

    res.json(valuation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get valuation history
router.get('/portfolio/:portfolioId/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const valuations = await PortfolioValuation.find({ portfolioId: req.params.portfolioId })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json(valuations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trigger manual valuation
router.post('/portfolio/:portfolioId/calculate', async (req, res) => {
  try {
    const job = await queue.add('portfolio-valuation', {
      portfolioId: req.params.portfolioId,
      type: 'manual',
    });

    res.json({
      message: 'Valuation job queued',
      jobId: job.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

