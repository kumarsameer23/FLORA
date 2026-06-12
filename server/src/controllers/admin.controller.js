const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const Review = require('../models/Review.model');
const Contact = require('../models/Contact.model');
const Newsletter = require('../models/Newsletter.model');

// @desc    Dashboard analytics
// @route   GET /api/admin/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalUsers, newUsersThisMonth,
      totalProducts, lowStockProducts,
      totalOrders, ordersThisMonth,
      pendingOrders, totalRevenue,
      totalReviews, unreadContacts,
      newsletterCount,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', createdAt: { $gte: thisMonth } }),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true, stock: { $lte: 5 } }),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: thisMonth } }),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Review.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Newsletter.countDocuments({ isActive: true }),
      Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(5).lean(),
      Product.find().sort({ orderCount: -1 }).limit(5).select('name thumbnail orderCount price').lean(),
    ]);

    // Monthly revenue for chart (last 6 months)
    const monthlyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        newUsersThisMonth,
        totalProducts,
        lowStockProducts,
        totalOrders,
        ordersThisMonth,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalReviews,
        unreadContacts,
        newsletterCount,
      },
      recentOrders,
      topProducts,
      monthlyRevenue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'user' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();
    const total = await User.countDocuments(query);
    res.json({ success: true, users, total });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Admin)
// @route   PUT /api/admin/users/:id/toggle
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, getUsers, toggleUserStatus };
