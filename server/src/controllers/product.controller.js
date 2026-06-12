const mongoose = require('mongoose');
const Product = require('../models/Product.model');
const Category = require('../models/Category.model');

// @desc    Get all products (with filter/sort/paginate)
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 12, sort = '-createdAt',
      category, search, minPrice, maxPrice,
      placement, airPurifying, petFriendly, difficulty,
      isFeatured, isNewArrival, isBestSeller, badge,
    } = req.query;

    const query = { isActive: true };

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          query.category = new mongoose.Types.ObjectId();
        }
      }
    }
    if (placement) query['specs.placement'] = placement;
    if (airPurifying === 'true') query['specs.airPurifying'] = true;
    if (petFriendly === 'true') query['specs.petFriendly'] = true;
    if (difficulty) query['specs.difficulty'] = difficulty;
    if (isFeatured === 'true') query.isFeatured = true;
    if (isNewArrival === 'true') query.isNewArrival = true;
    if (isBestSeller === 'true') query.isBestSeller = true;
    if (badge) query.badges = badge;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { scientificName: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {
      '-createdAt': { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'rating': { avgRating: -1 },
      'popular': { orderCount: -1 },
      'name': { name: 1 },
    };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug icon')
        .sort(sortOptions[sort] || { createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug icon')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name avatar' },
        options: { sort: { createdAt: -1 }, limit: 10 },
      });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Increment view count
    await Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });

    // Related products (same category, excluding current)
    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .select('name slug thumbnail price originalPrice discount badges avgRating')
      .limit(8)
      .lean();

    res.json({ success: true, product, related });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
const getFeatured = async (req, res, next) => {
  try {
    const [featured, newArrivals, bestSellers] = await Promise.all([
      Product.find({ isFeatured: true, isActive: true }).limit(8).populate('category', 'name slug').lean(),
      Product.find({ isNewArrival: true, isActive: true }).sort({ createdAt: -1 }).limit(8).populate('category', 'name slug').lean(),
      Product.find({ isBestSeller: true, isActive: true }).sort({ orderCount: -1 }).limit(8).populate('category', 'name slug').lean(),
    ]);
    res.json({ success: true, featured, newArrivals, bestSellers });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const productData = JSON.parse(req.body.data || '{}');

    // Attach uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        publicId: file.filename,
        alt: productData.name || '',
      }));
      productData.thumbnail = `/uploads/${req.files[0].filename}`;
    }

    const product = await Product.create(productData);
    await product.populate('category', 'name slug');

    res.status(201).json({ success: true, message: 'Product created', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const productData = typeof req.body.data === 'string'
      ? JSON.parse(req.body.data)
      : req.body;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        publicId: file.filename,
        alt: productData.name || '',
      }));
      productData.images = [...(productData.existingImages || []), ...newImages];
      if (!productData.thumbnail && newImages[0]) productData.thumbnail = newImages[0].url;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete images from disk
    const fs = require('fs');
    const path = require('path');
    for (const img of product.images) {
      if (img.publicId) {
        const filePath = path.join(__dirname, '../../uploads', img.publicId);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products (instant search)
// @route   GET /api/products/search
const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ success: true, products: [] });
    }

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { scientificName: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name slug thumbnail price badges avgRating category')
      .populate('category', 'name')
      .limit(10)
      .lean();

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProduct, getFeatured, createProduct, updateProduct, deleteProduct, searchProducts };
