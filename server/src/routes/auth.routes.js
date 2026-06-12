const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword, toggleWishlist, addRecentlyViewed } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.post('/recently-viewed/:productId', protect, addRecentlyViewed);

module.exports = router;
