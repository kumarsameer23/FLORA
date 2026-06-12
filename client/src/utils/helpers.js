// WhatsApp number (country code + number)
export const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || '917054416071';

/**
 * Generate WhatsApp order link for a single product
 */
export const getWAOrderLink = (product, qty = 1) => {
  const price = product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const message = `Hi FLORA! 🌿\n\nI'd like to order:\n\n*${product.name}*\n_(${product.scientificName || ''})_\n\nQty: ${qty}\nPrice: ₹${price} × ${qty} = ₹${price * qty}\n\nPlease confirm availability and delivery in Lucknow. Thank you!`;

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
};

/**
 * Generate WhatsApp link for general enquiry
 */
export const getWAEnquiryLink = (message = '') => {
  const text = message || `Hi FLORA! 🌿\n\nI'd like to know more about your plants and services.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
};

/**
 * Generate WhatsApp link for cart/multiple items
 */
export const getWACartLink = (items) => {
  const itemsList = items
    .map(item => {
      const price = item.discount > 0
        ? Math.round(item.price * (1 - item.discount / 100))
        : item.price;
      return `• *${item.name}* — ₹${price} × ${item.qty}`;
    })
    .join('\n');

  const total = items.reduce((sum, item) => {
    const price = item.discount > 0
      ? Math.round(item.price * (1 - item.discount / 100))
      : item.price;
    return sum + price * item.qty;
  }, 0);

  const message = `Hi FLORA! 🌿\n\nI'd like to order:\n\n${itemsList}\n\n*Total: ₹${total}*\n\nPlease confirm availability and delivery in Lucknow. Thank you!`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
};

/**
 * Format price in Indian Rupees
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Calculate final price after discount
 */
export const getFinalPrice = (price, discount = 0) => {
  if (discount <= 0) return price;
  return Math.round(price * (1 - discount / 100));
};

export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url) return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80';
  if (url.startsWith('/uploads')) {
    const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${backendUrl}${url}`;
  }
  return url;
};

/**
 * Truncate text
 */
export const truncate = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Slugify helper
 */
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Star rating display
 */
export const getStarArray = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push('full');
    else if (i - 0.5 <= rating) stars.push('half');
    else stars.push('empty');
  }
  return stars;
};

/**
 * Format date
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

/**
 * Difficulty color
 */
export const getDifficultyColor = (difficulty) => {
  const map = {
    Beginner: 'text-green-600 bg-green-50',
    Intermediate: 'text-amber-600 bg-amber-50',
    Expert: 'text-red-600 bg-red-50',
  };
  return map[difficulty] || 'text-sage bg-mist';
};
