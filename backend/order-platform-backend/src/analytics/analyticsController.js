const { inMemoryStore } = require('../../config/database');

exports.getDashboardMetrics = (req, res) => {
  try {
    const totalOrders = inMemoryStore.orders.length;
    const totalRevenue = inMemoryStore.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const paidOrders = inMemoryStore.orders.filter(o => o.status === 'paid').length;
    const pendingOrders = inMemoryStore.orders.filter(o => o.status === 'pending').length;

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
      totalOrders,
      totalRevenue,
      paidOrders,
      pendingOrders,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      timestamp: Date.now(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderTrends = (req, res) => {
  try {
    const trends = {
      byStatus: {
        pending: inMemoryStore.orders.filter(o => o.status === 'pending').length,
        paid: inMemoryStore.orders.filter(o => o.status === 'paid').length,
        shipped: inMemoryStore.orders.filter(o => o.status === 'shipped').length,
        delivered: inMemoryStore.orders.filter(o => o.status === 'delivered').length,
      },
      totalOrders: inMemoryStore.orders.length,
    };

    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPaymentMetrics = (req, res) => {
  try {
    const totalPayments = inMemoryStore.payments.length;
    const completedPayments = inMemoryStore.payments.filter(p => p.status === 'completed').length;
    const refundedPayments = inMemoryStore.payments.filter(p => p.status === 'refunded').length;
    const totalValue = inMemoryStore.payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({
      totalPayments,
      completedPayments,
      refundedPayments,
      totalValue,
      completionRate: totalPayments > 0 ? parseFloat(((completedPayments / totalPayments) * 100).toFixed(2)) : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserMetrics = (req, res) => {
  try {
    const totalUsers = inMemoryStore.users.length;

    res.json({
      totalUsers,
      totalOrders: inMemoryStore.orders.length,
      averageOrdersPerUser: totalUsers > 0 ? parseFloat((inMemoryStore.orders.length / totalUsers).toFixed(2)) : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};