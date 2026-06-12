const mongoose = require('mongoose');
const slugify = require('slugify');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
  alt: { type: String, default: '' },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  scientificName: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    default: 200,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  images: [imageSchema],
  thumbnail: {
    type: String,
    default: '',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  subcategory: {
    type: String,
    trim: true,
  },
  tags: [String],
  badges: [String],
  stock: {
    type: Number,
    required: true,
    default: 10,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  // Specifications
  specs: {
    height: { type: String, default: '' },          // e.g. "30-60 cm"
    potSize: { type: String, default: '' },          // e.g. "6 inch"
    waterRequirement: { type: String, default: '' }, // e.g. "Weekly"
    sunlight: { type: String, default: '' },         // e.g. "Indirect bright"
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert'],
      default: 'Beginner',
    },
    humidity: { type: String, default: '' },
    temperature: { type: String, default: '' },      // e.g. "15-30°C"
    airPurifying: { type: Boolean, default: false },
    petFriendly: { type: Boolean, default: false },
    placement: {
      type: String,
      enum: ['Indoor', 'Outdoor', 'Both'],
      default: 'Indoor',
    },
  },
  careInstructions: [{
    step: Number,
    title: String,
    description: String,
  }],
  deliveryInfo: {
    type: String,
    default: 'Delivered safely in eco-friendly packaging. Same-day delivery in Lucknow.',
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  orderCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  // Set thumbnail from first image
  if (this.images && this.images.length > 0 && !this.thumbnail) {
    this.thumbnail = this.images[0].url;
  }
  next();
});

// Virtual: discounted price
productSchema.virtual('finalPrice').get(function () {
  if (this.discount > 0) {
    return Math.round(this.price * (1 - this.discount / 100));
  }
  return this.price;
});

// Virtual: reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

module.exports = mongoose.model('Product', productSchema);
