const Review = require('../models/Review.model');
const Product = require('../models/Product.model');

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
const getReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Review.countDocuments({ product: req.params.productId, isApproved: true });

    // Rating distribution
    const distribution = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId(req.params.productId), isApproved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]);

    res.json({ success: true, reviews, total, pages: Math.ceil(total / limit), distribution });
  } catch (error) {
    next(error);
  }
};

// @desc    Create review (Auth)
// @route   POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { product, rating, title, body } = req.body;

    const existing = await Review.findOne({ product, user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product,
      user: req.user._id,
      rating,
      title,
      body,
    });

    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, message: 'Review submitted', review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review (Admin or own)
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReviews, createReview, deleteReview };
