const express = require('express');
const paymentController = require('./paymentController');

const router = express.Router();

router.post('/', (req, res) => paymentController.processPayment(req, res));
router.get('/', (req, res) => paymentController.getAllPayments(req, res));
router.get('/order/:orderId', (req, res) => paymentController.getPaymentByOrderId(req, res));
router.post('/:paymentId/refund', (req, res) => paymentController.refundPayment(req, res));

module.exports = router;