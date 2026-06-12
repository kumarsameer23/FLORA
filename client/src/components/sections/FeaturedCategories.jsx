import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoryAPI } from '../../services/api';
import { HiArrowRight } from 'react-icons/hi';
import { getOptimizedImageUrl } from '../../utils/helpers';

// Real plant images — one representative per category
const CATEGORY_IMAGES = {
  'indoor-plants':    '/uploads/monstera-deliciosa.jpg',
  'outdoor-plants':   '/uploads/areca-palm.jpg',
  'flowering-plants': '/uploads/hibiscus.jpg',
  'succulents':       '/uploads/aloe-vera.jpg',
};

const fallbackCategories = [
  { _id: '1', name: 'Indoor Plants',    slug: 'indoor-plants',    icon: '🏠', productCount: 5 },
  { _id: '2', name: 'Outdoor Plants',   slug: 'outdoor-plants',   icon: '🌳', productCount: 2 },
  { _id: '3', name: 'Flowering Plants', slug: 'flowering-plants', icon: '🌸', productCount: 2 },
  { _id: '4', name: 'Succulents',       slug: 'succulents',       icon: '🌵', productCount: 3 },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

function CategoryCard({ category }) {
  const imgSrc = getOptimizedImageUrl(
    CATEGORY_IMAGES[category.slug] || category.image?.url || '/uploads/monstera-deliciosa.jpg'
  );

  return (
    <motion.div variants={itemVariants}>
      <Link
        to={`/shop?category=${category.slug}`}
        className="group block relative overflow-hidden rounded-2xl"
        style={{ height: 'clamp(220px, 30vw, 340px)', boxShadow: '0 8px 40px rgba(13,26,15,0.15)' }}
      >
        {/* Image */}
        <img
          src={imgSrc}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80';
          }}
        />

        {/* Gradient — stronger at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/88 via-ink/20 to-transparent transition-opacity duration-400 group-hover:from-ink/75" />

        {/* Top icon */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-lg transition-transform duration-300 group-hover:scale-110">
          {category.icon}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-white font-semibold text-lg md:text-xl mb-1 group-hover:text-gold transition-colors duration-300"
          >
            {category.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-xs">{category.productCount || 0} plants</span>
            <span
              className="flex items-center gap-1 text-xs font-medium transition-all duration-300 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              style={{ color: 'var(--color-gold)' }}
            >
              Shop now <HiArrowRight size={11} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedCategories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll().then(r => r.data.categories),
    staleTime: 5 * 60 * 1000,
  });

  const categories = data?.length ? data : fallbackCategories;

  return (
    <section className="section-pad" style={{ background: 'var(--color-cream)' }} ref={ref}>
      <div className="container-flora">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-12 gap-4">
          <div>
            <p className="text-label mb-3" style={{ color: 'var(--color-sage)' }}>Browse by Type</p>
            <h2 className="text-heading" style={{ color: 'var(--color-ink)', lineHeight: 1.2 }}>
              Find Your <em className="italic font-normal" style={{ color: 'var(--color-moss)' }}>Perfect</em> Plant
            </h2>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-2 text-sm font-medium group self-start sm:self-auto"
            style={{ color: 'var(--color-moss)' }}
          >
            View All
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
