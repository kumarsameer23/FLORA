const Category = require('../models/Category.model');
const Product = require('../models/Product.model');

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Get product count per category
    const counts = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    counts.forEach(c => { countMap[c._id.toString()] = c.count; });

    const enriched = categories.map(cat => ({
      ...cat,
      productCount: countMap[cat._id.toString()] || 0,
    }));

    res.json({ success: true, categories: enriched });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category (Admin)
// @route   POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = { url: `/uploads/${req.file.filename}`, publicId: req.file.filename };
    }
    const category = await Category.create(data);
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = { url: `/uploads/${req.file.filename}`, publicId: req.file.filename };
    }
    const category = await Category.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete — ${productCount} products use this category`,
      });
    }

    // Delete image from disk
    if (category.image && category.image.publicId) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '../../uploads', category.image.publicId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
