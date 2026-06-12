import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from '../product/ProductCard';
import ProductCardSkeleton from '../product/ProductCardSkeleton';
import { HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const tabs = [
  { key: 'featured', label: '⭐ Featured' },
  { key: 'newArrivals', label: '🆕 New Arrivals' },
  { key: 'bestSellers', label: '🔥 Best Sellers' },
];

export default function FeaturedCollection() {
  const [activeTab, setActiveTab] = useState('featured');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productAPI.getFeatured().then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.[activeTab] || [];

  return (
    <section className="section-pad" style={{ background: 'var(--color-ink)' }} ref={ref}>
      <div className="container-flora">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5"
        >
          <div>
            <p className="text-label mb-2" style={{ color: 'var(--color-gold)' }}>Curated for You</p>
            <h2 className="text-heading text-white">
              Our <em className="italic font-normal" style={{ color: 'var(--color-mint)' }}>Finest</em> Collection
            </h2>
          </div>
          <Link to="/shop" className="flex items-center gap-2 text-sm font-medium group" style={{ color: 'var(--color-sage)' }}>
            View Full Shop
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" style={{ color: 'var(--color-gold)' }} />
          </Link>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex gap-2 flex-wrap mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? 'text-ink'
                  : 'text-white/50 hover:text-white border border-white/15 hover:border-white/30'
              }`}
              style={activeTab === tab.key ? { background: 'var(--color-gold)' } : {}}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Product Swiper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} dark />)}
            </div>
          ) : products.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              spaceBetween={16}
              slidesPerView={1.2}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-12"
            >
              {products.map((product) => (
                <SwiperSlide key={product._id}>
                  <ProductCard product={product} dark />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center text-white/40 py-16">No products available yet</div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
