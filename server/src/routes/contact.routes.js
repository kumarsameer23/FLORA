const express = require('express');
const router = express.Router();
const { submitContact, getContacts, markRead } = require('../controllers/contact.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.post('/', submitContact);
router.get('/', protect, adminOnly, getContacts);
router.put('/:id/read', protect, adminOnly, markRead);

module.exports = router;
