import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { GiWaterDrop } from 'react-icons/gi';
import { BsSunFill } from 'react-icons/bs';
import { getWAOrderLink, getFinalPrice, getOptimizedImageUrl } from '../../utils/helpers';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? 'fill-gold text-gold' : 'text-white/20 fill-current'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-white/40 ml-1">({rating?.toFixed(1) || '—'})</span>
    </div>
  );
}

/** Inline quantity picker modal — appears above the card */
function QtyModal({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const finalPrice = getFinalPrice(product.price, product.discount);
  const total = finalPrice * qty;

  const confirm = (e) => {
    e.preventDefault();
    window.open(getWAOrderLink(product, qty), '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* backdrop */}
        <div className="absolute inset-0" style={{ background: 'rgba(13,26,15,0.72)' }} />

        <motion.div
          key="modal"
          className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl"
          style={{ background: '#fff', zIndex: 1 }}
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-label mb-1" style={{ color: 'var(--color-sage)' }}>Order via WhatsApp</p>
          <h4
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
            className="text-lg font-bold mb-1"
          >
            {product.name}
          </h4>
          <p className="text-sm mb-5" style={{ color: 'var(--color-sage)' }}>
            ₹{finalPrice} / plant — How many would you like?
          </p>

          {/* Quantity stepper */}
          <div className="flex items-center justify-center gap-5 mb-5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-full border-2 text-xl font-bold flex items-center justify-center transition-all hover:scale-110"
              style={{ borderColor: 'var(--color-moss)', color: 'var(--color-moss)' }}
            >
              −
            </button>
            <span
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
              className="text-3xl font-bold min-w-[3rem] text-center"
            >
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 rounded-full border-2 text-xl font-bold flex items-center justify-center transition-all hover:scale-110"
              style={{ borderColor: 'var(--color-moss)', color: 'var(--color-moss)' }}
            >
              +
            </button>
          </div>

          {/* Total */}
          <div
            className="text-center py-2 px-4 rounded-lg mb-5"
            style={{ background: 'var(--color-mist)' }}
          >
            <span className="text-sm" style={{ color: 'var(--color-sage)' }}>Total: </span>
            <span
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-forest)' }}
              className="text-xl font-bold"
            >
              ₹{total}
            </span>
          </div>

          <button onClick={confirm} className="btn btn-wa w-full justify-center mb-3">
            <FaWhatsapp size={16} />
            Order {qty} {qty === 1 ? 'plant' : 'plants'} on WhatsApp
          </button>
          <button
            onClick={onClose}
            className="w-full text-xs text-center py-2 transition-colors"
            style={{ color: 'var(--color-sage)' }}
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProductCard({ product, dark = false }) {
  const [imgError, setImgError] = useState(false);
  const [qtyModalOpen, setQtyModalOpen] = useState(false);
  const finalPrice = getFinalPrice(product.price, product.discount);

  const bg = dark ? 'rgba(255,255,255,0.04)' : '#fff';
  const textColor = dark ? 'text-white' : 'text-ink';
  const subTextColor = dark ? 'text-white/50' : 'text-sage';

  return (
    <>
      {qtyModalOpen && (
        <QtyModal product={product} onClose={() => setQtyModalOpen(false)} />
      )}

      <motion.article
        className="group relative rounded-xl overflow-hidden border transition-all duration-400 h-full flex flex-col"
        style={{ background: bg, borderColor: dark ? 'rgba(255,255,255,0.08)' : '#e8f2eb', boxShadow: 'var(--shadow-card)' }}
        whileHover={{ y: -6, boxShadow: 'var(--shadow-card-hover)' }}
        transition={{ duration: 0.3 }}
      >
        {/* Image */}
        <Link to={`/product/${product.slug}`} className="block relative overflow-hidden" style={{ height: '220px' }}>
          <img
            src={imgError ? FALLBACK_IMG : getOptimizedImageUrl(product.thumbnail || product.images?.[0]?.url || FALLBACK_IMG)}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {product.badges?.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="badge text-ink text-xs"
                style={{ background: 'var(--color-gold)' }}
              >
                {badge}
              </span>
            ))}
            {product.discount > 0 && (
              <span className="badge bg-red-500 text-white">{product.discount}% OFF</span>
            )}
          </div>

          {/* Feature tags top-right */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
            {product.specs?.airPurifying === true && (
              <span className="glass text-blue-300 text-xs px-2 py-0.5 rounded">💨 Air</span>
            )}
            {product.specs?.petFriendly === true && (
              <span className="glass text-green-300 text-xs px-2 py-0.5 rounded">🐾 Pet</span>
            )}
          </div>

          {/* Placement tag */}
          <div className="absolute bottom-3 right-3">
            <span className="glass text-mint text-xs px-2 py-1 rounded">
              {product.specs?.placement || 'Indoor'}
            </span>
          </div>
        </Link>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <Link to={`/product/${product.slug}`}>
            <h3
              style={{ fontFamily: 'var(--font-serif)' }}
              className={`text-base font-bold mb-0.5 group-hover:text-gold transition-colors leading-snug ${textColor}`}
            >
              {product.name}
            </h3>
          </Link>
          <p className={`text-xs italic mb-2 ${subTextColor}`}>{product.scientificName}</p>

          {/* Rating */}
          {product.avgRating > 0 && (
            <div className="mb-3">
              <StarRating rating={product.avgRating} />
            </div>
          )}

          {/* Care chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.specs?.waterRequirement && (
              <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${dark ? 'bg-white/8 text-white/60' : 'bg-mist text-moss'}`}>
                <GiWaterDrop size={10} /> {product.specs.waterRequirement}
              </span>
            )}
            {product.specs?.sunlight && (
              <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${dark ? 'bg-white/8 text-white/60' : 'bg-mist text-moss'}`}>
                <BsSunFill size={10} /> {product.specs.sunlight}
              </span>
            )}
            {product.specs?.difficulty && (
              <span className={`text-xs px-2 py-1 rounded-full ${dark ? 'bg-white/8 text-white/60' : 'bg-mist text-moss'}`}>
                {product.specs.difficulty}
              </span>
            )}
          </div>

          {/* Footer */}
          <div
            className="mt-auto pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2"
            style={{ borderColor: dark ? 'rgba(255,255,255,0.08)' : '#e8f2eb' }}
          >
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-forest)' }}
                  className="text-xl font-bold"
                >
                  ₹{finalPrice}
                </span>
                {product.originalPrice && product.originalPrice > finalPrice && (
                  <span className={`text-xs line-through ${subTextColor}`}>₹{product.originalPrice}</span>
                )}
              </div>
              <div className={`text-xs ${subTextColor}`}>/ plant</div>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQtyModalOpen(true); }}
              className="btn btn-wa text-xs px-3 py-2.5 w-full sm:w-auto shrink-0 justify-center"
              aria-label={`Order ${product.name} on WhatsApp`}
            >
              <FaWhatsapp size={14} />
              Order
            </button>
          </div>
        </div>
      </motion.article>
    </>
  );
}
