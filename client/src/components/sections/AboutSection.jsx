import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getOptimizedImageUrl } from '../../utils/helpers';

const ABOUT_IMAGE = 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=900&q=85';

const whyItems = [
  { icon: '🌿', title: '100% Healthy Plants', desc: 'Every plant is inspected before dispatch. Pest-free, disease-free, or we replace it — no questions asked.' },
  { icon: '📦', title: 'Expert Packaging', desc: 'Plants are secured in eco-friendly packaging that protects roots, leaves, and pots through transit.' },
  { icon: '🚚', title: 'Same Day Delivery', desc: 'Order before noon and receive your plant the same day within Lucknow. Always fresh.' },
  { icon: '💬', title: 'Lifetime Care Support', desc: 'WhatsApp us anytime after purchase. Our plant experts keep your greens thriving.' },
  { icon: '💰', title: 'Nursery Direct Prices', desc: 'No middlemen, no markup. You pay nursery prices for premium quality plants.' },
  { icon: '🔄', title: 'Easy Returns', desc: 'If your plant arrives unhealthy, we replace it free within 7 days of delivery.' },
];

function SectionLabel({ children, color = 'var(--color-gold)' }) {
  return (
    <p className="text-label mb-3" style={{ color }}>
      {children}
    </p>
  );
}

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      <section id="about" style={{ background: 'var(--color-ink)' }} ref={ref}>
        <div className="relative grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: 'clamp(480px, 70vw, 560px)' }}>
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col justify-center w-full h-full bg-ink/15 lg:bg-transparent"
            style={{ padding: 'clamp(1.5rem, 6vw, 5rem)' }}
          >
            <SectionLabel>Our Story</SectionLabel>
            <h2
              style={{ fontFamily: 'var(--font-serif)', lineHeight: 1.25, color: '#fff' }}
              className="text-3xl md:text-4xl font-medium mb-6"
            >
              Grown with{' '}
              <em className="italic animate-neon" style={{ color: 'var(--color-neon)' }}>
                passion
              </em>
              ,<br />delivered with pride
            </h2>
            <p
              style={{ lineHeight: 1.9, letterSpacing: '0.01em', color: 'rgba(255,255,255,0.7)' }}
              className="text-sm md:text-base font-light max-w-md"
            >
              For over a year, FLORA has been bringing the beauty of nature into homes across
              Lucknow. Every plant we sell is hand-selected, nurtured in our nursery, and
              delivered at peak health.
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0 z-0 lg:relative lg:inset-auto lg:z-auto w-full h-full overflow-hidden group"
          >
            <img
              src={ABOUT_IMAGE}
              alt="FLORA nursery interior"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(13,26,15,0.45)_0%,rgba(13,26,15,0.65)_50%,rgba(13,26,15,0.85)_100%)] lg:bg-gradient-to-r lg:from-ink lg:to-transparent"
            />
            <div
              className="absolute bottom-6 left-6 px-4 py-2.5 rounded text-sm font-semibold tracking-widest uppercase hidden lg:block"
              style={{ background: 'var(--color-gold)', color: 'var(--color-ink)' }}
            >
              Est. 2024 · Lucknow
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How to Order ── */}
      <section style={{ background: 'var(--color-forest)' }} id="how-to-order">
        <div className="relative grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: 'clamp(520px, 75vw, 600px)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 z-0 lg:relative lg:inset-auto lg:z-auto w-full h-full overflow-hidden group"
          >
            <motion.img
              initial={{ scale: 1.12 }}
              whileInView={{ scale: 1 }}
              whileHover={{ scale: 1.06 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              src={getOptimizedImageUrl('/uploads/flora.jpeg')}
              alt="Beautiful plant arrangement"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(22,51,32,0.45)_0%,rgba(22,51,32,0.65)_50%,rgba(22,51,32,0.85)_100%)] lg:bg-gradient-to-r lg:from-transparent lg:to-forest/95 pointer-events-none"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col justify-center w-full h-full bg-forest/15 lg:bg-transparent"
            style={{ padding: 'clamp(1.5rem, 6vw, 4rem)' }}
          >
            <SectionLabel color="var(--color-gold)">Simple as a Message</SectionLabel>
            <h2
              style={{ fontFamily: 'var(--font-serif)', color: '#fff', lineHeight: 1.25 }}
              className="text-3xl md:text-4xl font-normal italic mb-4"
            >
              How to bring FLORA home
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}
            >
              No complicated checkout. No account needed. Just browse, pick your plants, and
              chat with us on WhatsApp — we handle the rest.
            </p>
            <div className="space-y-6">
              {[
                { n: '1', title: 'Browse the Collection', desc: 'Explore our curated plants with pricing, care info, and real photos.' },
                { n: '2', title: 'Tap "Order" on WhatsApp', desc: 'Each plant has a direct button that opens WhatsApp with your order pre-filled.' },
                { n: '3', title: 'We Confirm & Deliver', desc: "We'll confirm stock and arrange same-day or next-day delivery to your door in Lucknow." },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex gap-5 items-start">
                  <div
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', lineHeight: 1 }}
                    className="text-4xl font-bold w-8 shrink-0"
                  >
                    {n}
                  </div>
                  <div className="pt-1">
                    <h4 className="font-semibold text-sm mb-2" style={{ color: '#fff' }}>{title}</h4>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section id="returns" className="section-pad" style={{ background: 'var(--color-ink)' }}>
        <div className="container-flora">
          {/* Section header */}
          <div className="text-center mb-12 md:mb-16">
            <SectionLabel>Why FLORA</SectionLabel>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                color: '#ffffff',
                lineHeight: 1.2,
                fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
                fontWeight: 700,
              }}
            >
              Our Promise{' '}
              <em className="italic font-normal" style={{ color: 'var(--color-mint)' }}>
                to You
              </em>
            </h2>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {whyItems.map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative rounded-2xl overflow-hidden group"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(142,201,162,0.12)',
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
                }}
                whileHover={{ y: -6, background: 'rgba(255,255,255,0.08)', transition: { duration: 0.25 } }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: 'linear-gradient(90deg, var(--color-gold), var(--color-neon))' }}
                />
                <span className="text-3xl mb-5 block">{icon}</span>
                <h4
                  style={{ fontFamily: 'var(--font-serif)', color: '#ffffff', lineHeight: 1.3 }}
                  className="text-lg font-semibold mb-3"
                >
                  {title}
                </h4>
                <p
                  className="text-sm"
                  style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
