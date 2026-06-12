const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadCategory } = require('../middleware/upload.middleware');

router.get('/', getCategories);
router.post('/', protect, adminOnly, (req, res, next) => {
  uploadCategory(req, res, (err) => { if (err) return next(err); next(); });
}, createCategory);
router.put('/:id', protect, adminOnly, (req, res, next) => {
  uploadCategory(req, res, (err) => { if (err) return next(err); next(); });
}, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
