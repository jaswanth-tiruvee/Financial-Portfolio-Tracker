const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { body, validationResult } = require('express-validator');

// Get all portfolios
router.get('/', async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate('holdings.assetId');
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get portfolio by ID
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id).populate('holdings.assetId');
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create portfolio
router.post('/', [
  body('name').notEmpty().withMessage('Portfolio name is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const portfolio = new Portfolio(req.body);
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add holding to portfolio
router.post('/:id/holdings', [
  body('assetId').notEmpty().withMessage('Asset ID is required'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('assetType').isIn(['crypto', 'stock']).withMessage('Asset type must be crypto or stock'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    portfolio.holdings.push(req.body);
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update holding
router.put('/:id/holdings/:holdingId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const holding = portfolio.holdings.id(req.params.holdingId);
    if (!holding) {
      return res.status(404).json({ error: 'Holding not found' });
    }

    Object.assign(holding, req.body);
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete holding
router.delete('/:id/holdings/:holdingId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    portfolio.holdings.id(req.params.holdingId).remove();
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

