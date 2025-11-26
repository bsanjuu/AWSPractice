const { v4: uuidv4 } = require('uuid');
const { inMemoryStore } = require('../../config/database');

exports.processPayment = (req, res) => {
  try {
    const { orderId, amount, cardToken, cardLastFour } = req.body;

    if (!orderId || !amount || !cardToken) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = inMemoryStore.orders.find(o => o.orderId === orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const newPayment = {
      paymentId: uuidv4(),
      orderId,
      amount,
      cardLastFour,
      status: 'completed',
      method: 'credit_card',
      processedAt: Date.now(),
    };

    inMemoryStore.payments.push(newPayment);

    // Update order status
    order.status = 'paid';
    order.paymentId = newPayment.paymentId;

    res.status(201).json(newPayment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPaymentByOrderId = (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = inMemoryStore.payments.find(p => p.orderId === orderId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refundPayment = (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = inMemoryStore.payments.find(p => p.paymentId === paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    payment.status = 'refunded';
    payment.refundedAt = Date.now();

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPayments = (req, res) => {
  try {
    res.json(inMemoryStore.payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};