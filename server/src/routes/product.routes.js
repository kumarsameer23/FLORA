const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getFeatured, createProduct, updateProduct, deleteProduct, searchProducts } = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadProduct } = require('../middleware/upload.middleware');

router.get('/search', searchProducts);
router.get('/featured', getFeatured);
router.get('/', getProducts);
router.get('/:slug', getProduct);
router.post('/', protect, adminOnly, (req, res, next) => {
  uploadProduct(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, createProduct);
router.put('/:id', protect, adminOnly, (req, res, next) => {
  uploadProduct(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
