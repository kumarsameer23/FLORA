import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiX, HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { formatPrice, getFinalPrice } from '../../utils/helpers';

const popularSearches = ['Monstera', 'Snake Plant', 'Aloe Vera', 'Money Plant', 'Tulsi'];

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }
    clearTimeout(timerRef.current);
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await productAPI.search(query);
        setResults(res.data.products || []);
      } catch (_) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-ink/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 z-[61] glass-dark shadow-2xl"
          >
            <div className="container-flora py-5">
              {/* Search Input */}
              <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                <HiOutlineSearch className="text-gold shrink-0" size={22} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search plants, e.g. Monstera, Snake Plant..."
                  className="flex-1 bg-transparent text-white placeholder-white/40 text-lg outline-none font-light"
                />
                <button onClick={onClose} className="text-white/50 hover:text-white transition-colors p-1">
                  <HiX size={22} />
                </button>
              </div>

              {/* Results / Popular */}
              <div className="py-4 max-h-[60vh] overflow-y-auto">
                {query.length < 2 && (
                  <div>
                    <p className="text-white/40 text-xs tracking-widest uppercase mb-3">Popular Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 text-sm rounded-full transition-colors border border-white/10"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="flex items-center gap-2 text-white/50 py-4">
                    <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </div>
                )}

                {!loading && query.length >= 2 && results.length === 0 && (
                  <div className="text-white/50 py-4 text-center">
                    <p>No plants found for "<span className="text-gold">{query}</span>"</p>
                    <p className="text-sm mt-1">Try searching by common name or scientific name</p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="space-y-2">
                    {results.map((product) => {
                      const finalPrice = getFinalPrice(product.price, product.discount);
                      return (
                        <Link
                          key={product._id}
                          to={`/product/${product.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate group-hover:text-gold transition-colors">{product.name}</p>
                            <p className="text-white/40 text-sm">{product.category?.name}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-gold font-semibold">₹{finalPrice}</p>
                          </div>
                          <HiArrowRight className="text-white/30 group-hover:text-gold transition-colors" />
                        </Link>
                      );
                    })}
                    <Link
                      to={`/shop?search=${query}`}
                      onClick={onClose}
                      className="block text-center text-gold text-sm py-3 hover:underline"
                    >
                      View all results for "{query}"
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
