import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { FaWhatsapp } from 'react-icons/fa';
import { getWAEnquiryLink } from '../utils/helpers';

export default function WishlistPage() {
  const { user, isAuthenticated } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist', user?._id],
    queryFn: () => authAPI.getMe().then(r => r.data.user.wishlist),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });

  const wishlist = data || [];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center pt-20 px-4" style={{ background: 'var(--color-cream)' }}>
        <div className="text-6xl mb-4">💚</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-3xl mb-3">Your Wishlist Awaits</h1>
        <p style={{ color: 'var(--color-sage)' }} className="mb-6 max-w-sm">Login to save your favourite plants and access them anytime.</p>
        <Link to="/login" className="btn btn-forest">Login to Continue</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>My Wishlist — FLORA</title></Helmet>
      <div className="min-h-screen pt-20" style={{ background: 'var(--color-cream)' }}>
        <div className="section-pad-sm" style={{ background: 'var(--color-forest)' }}>
          <div className="container-flora">
            <p className="text-label text-white/50 mb-2">My Collection</p>
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-4xl font-bold text-white">
              My <em className="italic font-normal" style={{ color: 'var(--color-mint)' }}>Wishlist</em>
            </h1>
          </div>
        </div>
        <div className="container-flora py-10">
          {isLoading ? (
            <div className="text-center py-20" style={{ color: 'var(--color-sage)' }}>Loading your wishlist...</div>
          ) : wishlist.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌱</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-2xl mb-2">Your wishlist is empty</h2>
              <p style={{ color: 'var(--color-sage)' }} className="mb-6">Browse our collection and save plants you love!</p>
              <Link to="/shop" className="btn btn-gold">Browse Plants</Link>
            </div>
          ) : (
            <>
              <p className="text-sm mb-6" style={{ color: 'var(--color-sage)' }}>{wishlist.length} plants saved</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {wishlist.map((product, i) => (
                  <motion.div key={product._id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <motion.a href={getWAEnquiryLink()} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-white animate-wa-pulse"
        style={{ background: 'var(--color-whatsapp)' }}
        whileHover={{ scale: 1.1 }}
      ><FaWhatsapp size={26} /></motion.a>
    </>
  );
}
