const express = require('express');
const orderController = require('./orderController');

const router = express.Router();

router.post('/', (req, res) => orderController.createOrder(req, res));
router.get('/', (req, res) => orderController.getAllOrders(req, res));
router.get('/:orderId', (req, res) => orderController.getOrderById(req, res));
router.get('/user/:userId', (req, res) => orderController.getOrdersByUserId(req, res));
router.patch('/:orderId/status', (req, res) => orderController.updateOrderStatus(req, res));

module.exports = router;