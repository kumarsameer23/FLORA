const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  // Guest order info
  guestName: String,
  guestPhone: String,
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, default: 1 },
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: {
    name: String,
    phone: String,
    line1: String,
    line2: String,
    city: { type: String, default: 'Lucknow' },
    state: { type: String, default: 'Uttar Pradesh' },
    pincode: String,
  },
  waMessageSent: {
    type: Boolean,
    default: false,
  },
  waMessage: String,
  notes: String,
  statusHistory: [{
    status: String,
    note: String,
    updatedAt: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

// Auto-generate order number
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'FLR-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
