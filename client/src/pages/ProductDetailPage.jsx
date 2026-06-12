import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FaWhatsapp } from 'react-icons/fa';
import { HiShare, HiStar, HiChevronRight, HiArrowLeft } from 'react-icons/hi';
import { MdPets, MdAir } from 'react-icons/md';
import toast from 'react-hot-toast';
import { productAPI } from '../services/api';
import { getWAOrderLink, getFinalPrice, formatDate, getOptimizedImageUrl } from '../utils/helpers';
import ProductCard from '../components/product/ProductCard';

const FALLBACK = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80';

const tabs = ['Description', 'Specifications', 'Care Guide'];

function SpecBadge({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl text-center"
      style={{ background: 'var(--color-mist)' }}>
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-medium" style={{ color: 'var(--color-moss)' }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{value}</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Description');
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [qty, setQty] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productAPI.getBySlug(slug).then(r => r.data),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const product = data?.product;
  const related = data?.related || [];
  const finalPrice = product ? getFinalPrice(product.price, product.discount) : 0;
  const images = product?.images?.length ? product.images : [{ url: FALLBACK, alt: '' }];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 container-flora py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="skeleton rounded-2xl" style={{ height: '500px' }} />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-10 w-1/3 rounded" />
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🌱</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-3xl mb-2">Plant not found</h1>
        <p style={{ color: 'var(--color-sage)' }} className="mb-6">This plant may have been removed or the link is incorrect.</p>
        <Link to="/shop" className="btn btn-gold">Browse All Plants</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} — Rs.${finalPrice} | FLORA Lucknow`}</title>
        <meta name="description" content={product.shortDescription || product.description?.slice(0, 160)} />
        <meta property="og:title" content={`${product.name} — FLORA`} />
        <meta property="og:image" content={getOptimizedImageUrl(product.thumbnail)} />
        <link rel="canonical" href={`https://floraplants.in/product/${product.slug}`} />
      </Helmet>

      <div className="min-h-screen pt-20" style={{ background: 'var(--color-cream)' }}>
        {/* Breadcrumb + Back */}
        <div className="container-flora py-4">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-forest shrink-0"
              style={{ color: 'var(--color-moss)' }}
            >
              <HiArrowLeft size={18} />
              <span>Back</span>
            </button>
            <nav className="flex items-center gap-2 text-xs overflow-hidden" style={{ color: 'var(--color-sage)' }}>
              <Link to="/" className="hover:text-moss shrink-0">Home</Link>
              <HiChevronRight size={12} className="shrink-0" />
              <Link to="/shop" className="hover:text-moss shrink-0">Shop</Link>
              <HiChevronRight size={12} className="shrink-0" />
              <Link to={`/shop?category=${product.category?.slug}`} className="hover:text-moss shrink-0">{product.category?.name}</Link>
              <HiChevronRight size={12} className="shrink-0" />
              <span style={{ color: 'var(--color-moss)' }} className="truncate">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container-flora pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
            {/* ── Image Gallery ── */}
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden bg-white shadow-md" style={{ height: 'clamp(280px, 50vw, 480px)' }}>
                <Swiper
                  modules={[Navigation, Thumbs]}
                  navigation
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  className="h-full"
                >
                  {images.map((img, i) => (
                    <SwiperSlide key={i} className="flex items-center justify-center h-full bg-white">
                      <img
                        src={getOptimizedImageUrl(img.url)}
                        alt={img.alt || product.name}
                        className="w-full h-full object-cover cursor-zoom-in"
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              {images.length > 1 && (
                <Swiper
                  modules={[FreeMode, Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={5}
                  freeMode
                  watchSlidesProgress
                  className="thumb-swiper"
                >
                  {images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <div className="rounded-lg overflow-hidden aspect-square cursor-pointer border-2 border-transparent [.swiper-slide-thumb-active_&]:border-gold">
                        <img src={getOptimizedImageUrl(img.url)} alt="" className="w-full h-full object-cover" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* ── Product Info ── */}
            <div className="space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.badges?.map(badge => (
                  <span key={badge} className="badge text-ink text-xs" style={{ background: 'var(--color-gold)' }}>{badge}</span>
                ))}
                {product.discount > 0 && <span className="badge bg-red-500 text-white">{product.discount}% OFF</span>}
                {product.stock <= 5 && product.stock > 0 && <span className="badge bg-amber-500 text-white">Only {product.stock} left</span>}
                {product.stock === 0 && <span className="badge bg-gray-400 text-white">Out of Stock</span>}
              </div>

              {/* Name */}
              <div>
                <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-3xl md:text-4xl font-bold leading-tight mb-1">
                  {product.name}
                </h1>
                <p className="italic text-sm" style={{ color: 'var(--color-sage)' }}>{product.scientificName}</p>
              </div>

              {/* Rating */}
              {product.avgRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <HiStar key={s} className={s <= Math.round(product.avgRating) ? 'text-gold' : 'text-mist'} size={18} />
                    ))}
                  </div>
                  <span className="text-sm" style={{ color: 'var(--color-sage)' }}>{product.avgRating} ({product.reviewCount} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-forest)' }} className="text-4xl font-bold">₹{finalPrice}</span>
                {product.originalPrice && product.originalPrice > finalPrice && (
                  <span className="text-lg line-through" style={{ color: 'var(--color-sage)' }}>₹{product.originalPrice}</span>
                )}
                <span className="text-sm" style={{ color: 'var(--color-sage)' }}>/ plant</span>
              </div>

              {/* Short description */}
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-sage)' }}>{product.shortDescription}</p>

              {/* Quick specs */}
              <div className="grid grid-cols-3 gap-2">
                <SpecBadge icon="💧" label="Water" value={product.specs?.waterRequirement} />
                <SpecBadge icon="☀️" label="Light" value={product.specs?.sunlight} />
                <SpecBadge icon="📏" label="Height" value={product.specs?.height} />
                <SpecBadge icon="🪴" label="Pot Size" value={product.specs?.potSize} />
                <SpecBadge icon="🏠" label="Placement" value={product.specs?.placement} />
                <SpecBadge icon="🏷️" label="Level" value={product.specs?.difficulty} />
              </div>

              {/* Quantity + Order */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-mist)' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-3 hover:bg-mist transition-colors text-lg" style={{ color: 'var(--color-moss)' }}>−</button>
                  <span className="px-4 py-3 min-w-[48px] text-center font-medium" style={{ color: 'var(--color-ink)' }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-3 hover:bg-mist transition-colors text-lg" style={{ color: 'var(--color-moss)' }}>+</button>
                </div>
                <a
                  href={getWAOrderLink(product, qty)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa flex-1 justify-center text-sm py-3.5"
                >
                  <FaWhatsapp size={18} />
                  Order {qty > 1 ? `${qty} plants` : 'on WhatsApp'}
                </a>
              </div>

              {/* Share */}
              <button onClick={handleShare} className="btn btn-ghost-dark px-5 py-3 flex items-center gap-2 text-sm w-full justify-center" aria-label="Share">
                <HiShare size={18} />
                Share this plant
              </button>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {product.specs?.airPurifying === true && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    <MdAir size={14} /> Air Purifying
                  </span>
                )}
                {product.specs?.petFriendly === true && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    <MdPets size={14} /> Pet Friendly
                  </span>
                )}
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--color-mist)', color: 'var(--color-moss)' }}>
                  🚚 {product.deliveryInfo || 'Same-day delivery in Lucknow'}
                </span>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="mb-12">
            <div className="flex gap-0 border-b overflow-x-auto" style={{ borderColor: 'var(--color-mist)' }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-colors relative ${
                    activeTab === tab ? 'text-forest' : 'text-sage hover:text-moss'
                  }`}
                  style={activeTab === tab ? { color: 'var(--color-forest)' } : { color: 'var(--color-sage)' }}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: 'var(--color-forest)' }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="py-8 bg-white rounded-b-xl px-6 shadow-sm">
              <AnimatePresence mode="wait">
                {activeTab === 'Description' && (
                  <motion.div key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--color-sage)' }}>{product.description}</p>
                  </motion.div>
                )}
                {activeTab === 'Specifications' && (
                  <motion.div key="specs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                      {[
                        ['Height', product.specs?.height],
                        ['Pot Size', product.specs?.potSize],
                        ['Water', product.specs?.waterRequirement],
                        ['Sunlight', product.specs?.sunlight],
                        ['Difficulty', product.specs?.difficulty],
                        ['Humidity', product.specs?.humidity],
                        ['Temperature', product.specs?.temperature],
                        ['Placement', product.specs?.placement],
                        ['Air Purifying', product.specs?.airPurifying === true ? '✅ Yes' : product.specs?.airPurifying === false ? '❌ No' : null],
                        ['Pet Friendly', product.specs?.petFriendly === true ? '✅ Yes — Safe for pets' : product.specs?.petFriendly === false ? '⚠️ Not recommended' : null],
                      ].map(([key, val]) => val && (
                        <div key={key} className="flex justify-between py-2.5 border-b text-sm" style={{ borderColor: 'var(--color-mist)' }}>
                          <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{key}</span>
                          <span style={{ color: 'var(--color-sage)' }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'Care Guide' && (
                  <motion.div key="care" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {product.careInstructions?.length ? (
                      <div className="space-y-6 max-w-2xl">
                        <p className="text-sm mb-4 font-medium" style={{ color: 'var(--color-moss)' }}>
                          🌿 Follow these care tips to keep your {product.name} thriving:
                        </p>
                        {product.careInstructions.map(({ step, title, description }) => (
                          <div key={step} className="flex gap-5">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-ink font-bold shrink-0"
                              style={{ background: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
                              {step}
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1 text-sm" style={{ color: 'var(--color-ink)' }}>{title}</h4>
                              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-sage)' }}>{description}</p>
                            </div>
                          </div>
                        ))}
                        <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--color-mist)' }}>
                          <p className="text-sm" style={{ color: 'var(--color-moss)' }}>
                            💬 Need personalized care advice for your {product.name}?{' '}
                            <a
                              href={`https://wa.me/917054416071?text=${encodeURIComponent(`Hi FLORA! I need care tips for my ${product.name}. Can you help?`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold underline"
                              style={{ color: 'var(--color-forest)' }}
                            >
                              Ask us on WhatsApp →
                            </a>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p style={{ color: 'var(--color-sage)' }} className="mb-4">Care guide coming soon.</p>
                        <a
                          href={`https://wa.me/917054416071?text=${encodeURIComponent(`Hi FLORA! I need care tips for ${product.name}. Can you help?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-wa"
                        >
                          <FaWhatsapp size={16} /> Ask us on WhatsApp
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <section>
              <div className="mb-6">
                <p className="text-label mb-1" style={{ color: 'var(--color-sage)' }}>You might also like</p>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-2xl font-bold">Related Plants</h2>
              </div>
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={16}
                slidesPerView={1.5}
                breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
              >
                {related.map(p => (
                  <SwiperSlide key={p._id}>
                    <ProductCard product={p} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
