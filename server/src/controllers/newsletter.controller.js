const Newsletter = require('../models/Newsletter.model');

const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        return res.json({ success: true, message: 'Welcome back! You are now subscribed.' });
      }
      return res.status(400).json({ success: false, message: 'Already subscribed!' });
    }
    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Thank you for subscribing to FLORA! 🌿' });
  } catch (error) {
    next(error);
  }
};

const unsubscribe = async (req, res, next) => {
  try {
    await Newsletter.findOneAndUpdate({ email: req.params.email }, { isActive: false });
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    next(error);
  }
};

const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort({ subscribedAt: -1 }).lean();
    res.json({ success: true, subscribers, total: subscribers.length });
  } catch (error) {
    next(error);
  }
};

module.exports = { subscribe, unsubscribe, getSubscribers };
