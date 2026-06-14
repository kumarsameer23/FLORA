import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaLeaf } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import { getWAEnquiryLink } from '../../utils/helpers';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=90';

const tickerItems = [
  'Free delivery on orders above ₹999',
  '100% Healthy Plant Guarantee',
  'Expert WhatsApp Support',
  'New arrivals every Friday',
  'Pots & Planters Available',
  'Same Day Delivery in Lucknow',
];

// ── Floating Leaf Particle ─────────────────────────────────────────────────
const LeafParticle = ({ style }) => (
  <motion.div
    className="absolute pointer-events-none select-none"
    style={{ ...style, color: 'rgba(142,201,162,0.12)' }}
    animate={{ y: [0, -35, 0], rotate: [0, 12, -8, 0], opacity: [0.12, 0.35, 0.12] }}
    transition={{ duration: style.duration || 6, repeat: Infinity, delay: style.delay || 0, ease: 'easeInOut' }}
  >
    <FaLeaf size={style.size || 24} />
  </motion.div>
);

const leaves = [
  { left: '8%', top: '22%', size: 18, duration: 7, delay: 0 },
  { left: '82%', top: '28%', size: 14, duration: 9, delay: 2 },
  { left: '62%', top: '68%', size: 24, duration: 8, delay: 1 },
  { left: '90%', top: '58%', size: 16, duration: 10, delay: 1.5 },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <>
      <section className="hero-section relative flex flex-col overflow-hidden h-[100svh] md:h-auto" style={{ minHeight: '100svh' }}>
        {/* Background */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: (typeof window !== 'undefined' && window.innerWidth < 768) ? 1.55 : 1.08 }}
          animate={{ scale: (typeof window !== 'undefined' && window.innerWidth < 768) ? 1.35 : 1.02 }}
          transition={{ duration: 14, ease: 'easeOut' }}
        >
          <img
            src={HERO_IMAGE}
            alt="FLORA — Premium plant nursery"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(13,26,15,0.45)_0%,rgba(13,26,15,0.65)_50%,rgba(13,26,15,0.85)_100%)] lg:bg-[linear-gradient(135deg,rgba(13,26,15,0.97)_0%,rgba(13,26,15,0.65)_55%,rgba(13,26,15,0.25)_100%)]"
        />

        {/* Floating leaves — hidden on mobile */}
        <div className="absolute inset-0 z-[2] overflow-hidden hidden md:block">
          {leaves.map((leaf, i) => <LeafParticle key={i} style={leaf} />)}
        </div>

        {/* Content */}
        <div className="relative z-[3] flex flex-col justify-center lg:justify-end flex-1 container-flora pt-20 pb-10 lg:pt-0 lg:pb-28">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4 md:mb-8">
              <div className="w-8 md:w-12 h-px" style={{ background: 'var(--color-gold)' }} />
              <span className="text-label" style={{ color: 'var(--color-gold)', letterSpacing: '0.32em' }}>
                Premium Nursery · Est. 2024 · Lucknow
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-display text-white mb-4 md:mb-8"
              style={{ lineHeight: 1.0, letterSpacing: '-0.02em' }}
            >
              Where Every
              <br />
              <em
                className="italic font-normal animate-neon"
                style={{ color: 'var(--color-neon)', lineHeight: 1.15, display: 'inline-block' }}
              >
                Leaf Tells
              </em>
              <br />
              a Story
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-white/65 font-light max-w-xl mb-6 md:mb-12"
              style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', lineHeight: 1.75 }}
            >
              Rare, beautiful plants curated from the finest nurseries.
              Delivered fresh to your home in Lucknow with expert care guidance.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 md:gap-4">
              <Link to="/shop" className="btn btn-gold group">
                <FaLeaf />
                Explore Collection
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={getWAEnquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <FaWhatsapp size={16} />
                WhatsApp Us
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator — desktop only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-24 right-6 md:right-10 z-[3] flex-col items-center gap-2 hidden md:flex"
        >
          <span className="text-white/30 text-[9px] tracking-[0.35em] uppercase">Scroll</span>
          <div className="w-px h-12 animate-scroll-pulse" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }} />
        </motion.div>

        {/* Ticker bar */}
        <div
          className="relative z-[3] border-t border-mint/10 py-3 overflow-hidden flex-shrink-0"
          style={{ background: 'var(--color-forest)' }}
        >
          <div className="flex gap-12 animate-ticker whitespace-nowrap">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="flex items-center gap-3 text-mint text-[10px] md:text-xs tracking-widest uppercase flex-shrink-0">
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--color-gold)' }} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
