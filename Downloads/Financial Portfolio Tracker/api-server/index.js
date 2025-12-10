const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const portfolioRoutes = require('./routes/portfolio');
const priceRoutes = require('./routes/price');
const valuationRoutes = require('./routes/valuation');

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/price', priceRoutes);
app.use('/api/valuation', valuationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-server', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});

