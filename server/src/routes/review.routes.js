const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteReview } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/:productId', getReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
