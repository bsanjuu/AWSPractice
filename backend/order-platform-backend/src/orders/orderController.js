const { v4: uuidv4 } = require('uuid');
const { inMemoryStore } = require('../../config/database');

exports.createOrder = (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress } = req.body;

    if (!userId || !items || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newOrder = {
      orderId: uuidv4(),
      userId,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending',
      createdAt: Date.now(),
    };

    inMemoryStore.orders.push(newOrder);

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = (req, res) => {
  try {
    const { orderId } = req.params;
    const order = inMemoryStore.orders.find(o => o.orderId === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdersByUserId = (req, res) => {
  try {
    const { userId } = req.params;
    const orders = inMemoryStore.orders.filter(o => o.userId === userId);

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = inMemoryStore.orders.find(o => o.orderId === orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    order.updatedAt = Date.now();

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = (req, res) => {
  try {
    res.json(inMemoryStore.orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};