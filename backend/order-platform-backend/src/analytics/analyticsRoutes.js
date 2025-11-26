const express = require('express');
const analyticsController = require('./analyticsController');

const router = express.Router();

router.get('/dashboard', (req, res) => analyticsController.getDashboardMetrics(req, res));
router.get('/trends', (req, res) => analyticsController.getOrderTrends(req, res));
router.get('/payments', (req, res) => analyticsController.getPaymentMetrics(req, res));
router.get('/users', (req, res) => analyticsController.getUserMetrics(req, res));

module.exports = router;