const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  assetId: {
    type: String,
    required: true,
  },
  assetType: {
    type: String,
    enum: ['crypto', 'stock'],
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  purchasePrice: {
    type: Number,
    default: 0,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  holdings: [holdingSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

portfolioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);

