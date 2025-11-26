const express = require('express');
const cors = require('cors');
const config = require('../config/env');
const { connectDB } = require('../config/database');

// Routes
const authRoutes = require('./auth/authRoutes');
const orderRoutes = require('./orders/orderRoutes');
const paymentRoutes = require('./payments/paymentRoutes');
const analyticsRoutes = require('./analytics/analyticsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Initialize and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`✓ Server running on http://localhost:${config.port}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;