const Order = require('../models/Order.model');
const Product = require('../models/Product.model');

// @desc    Create WhatsApp order record
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, notes, guestName, guestPhone } = req.body;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).lean();
      if (!product) continue;
      const price = product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

      subtotal += price * (item.quantity || 1);
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.thumbnail,
        price,
        quantity: item.quantity || 1,
      });

      // Increment order count on product
      await Product.findByIdAndUpdate(product._id, { $inc: { orderCount: 1 } });
    }

    const deliveryCharge = subtotal >= 999 ? 0 : 50;
    const total = subtotal + deliveryCharge;

    const order = await Order.create({
      user: req.user?._id || null,
      guestName,
      guestPhone,
      items: orderItems,
      subtotal,
      deliveryCharge,
      total,
      shippingAddress: shippingAddress || { city: 'Lucknow' },
      notes,
      waMessageSent: true,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed via WhatsApp',
      order,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name thumbnail slug')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();
    const total = await Order.countDocuments(query);
    res.json({ success: true, orders, total });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status, note });
    await order.save();

    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
