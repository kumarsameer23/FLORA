const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe, getSubscribers } = require('../controllers/newsletter.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.post('/', subscribe);
router.get('/unsubscribe/:email', unsubscribe);
router.get('/', protect, adminOnly, getSubscribers);

module.exports = router;
