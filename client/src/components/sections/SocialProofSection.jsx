import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaHeart } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import { useState } from 'react';
import { getWAEnquiryLink } from '../../utils/helpers';

const faqItems = [
  { q: 'How do I order from FLORA?', a: 'Simply click the "Order on WhatsApp" button on any plant product page. A WhatsApp message will be pre-filled with the plant details and sent to us. We\'ll confirm availability and arrange delivery!' },
  { q: 'Do you deliver outside Lucknow?', a: 'Currently we primarily serve Lucknow and nearby areas for same-day delivery. For outstation orders, please WhatsApp us and we\'ll work out a delivery plan.' },
  { q: 'Are all your plants healthy and pest-free?', a: 'Absolutely! Every plant is individually inspected before dispatch. We guarantee pest-free, disease-free plants — or we replace them for free within 7 days.' },
  { q: 'What if my plant arrives damaged?', a: 'We have a hassle-free replacement policy. If your plant arrives damaged or in poor health, simply WhatsApp us a photo within 7 days of delivery and we\'ll send a replacement.' },
  { q: 'Do you provide care instructions?', a: 'Yes! Every plant comes with a care card. You can also WhatsApp us any time for ongoing support — our plant experts are always available to help your plants thrive.' },
];

const instaHighlights = [
  { emoji: '🌿', label: 'Plant Care', desc: 'Weekly tips for thriving greens' },
  { emoji: '🌸', label: 'New Arrivals', desc: 'Fresh drops every Friday' },
  { emoji: '📦', label: 'Unboxing', desc: 'See happy customer deliveries' },
  { emoji: '✨', label: 'Inspo', desc: 'Indoor styling ideas & setups' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(42,92,63,0.15)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 flex items-center justify-between gap-4"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <span
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)', lineHeight: 1.45 }}
          className="font-medium text-base pr-4"
        >
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22 }}
          className="text-2xl font-light leading-none flex-shrink-0"
          style={{ color: 'var(--color-moss)' }}
        >
          +
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm" style={{ color: 'var(--color-sage)', lineHeight: 1.85 }}>{a}</p>
      </motion.div>
    </div>
  );
}

export default function SocialProofSection() {
  return (
    <>
      {/* ── CTA Banner ── */}
      <div
        className="relative flex items-center justify-center text-center overflow-hidden"
        style={{ minHeight: '420px', padding: 'clamp(4rem, 8vw, 6rem) 1.5rem' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=85)',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(13,26,15,0.86)' }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto px-4"
        >
          <p className="text-label mb-4" style={{ color: 'var(--color-gold)' }}>Start Growing Today</p>
          <h2
            style={{ fontFamily: 'var(--font-serif)', lineHeight: 1.35, color: '#fff', fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
            className="font-normal italic mb-5"
          >
            "The best time to plant a tree was 20 years ago.
            <br className="hidden md:block" /> The second best time is{' '}
            <em className="not-italic font-semibold" style={{ color: 'var(--color-neon)' }}>now</em>."
          </h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
            Let us help you find the perfect plant for your space, lifestyle, and budget.
          </p>
          <a
            href={getWAEnquiryLink("Hi FLORA! 🌿\n\nI'd like to order some plants. Can you help me choose?")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa"
            style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', padding: '0.95rem 2rem' }}
          >
            <FaWhatsapp size={18} />
            Start Your Order on WhatsApp
          </a>
        </motion.div>
      </div>

      {/* ── Instagram Section — Redesigned ── */}
      <section
        className="section-pad"
        style={{ background: 'linear-gradient(180deg, #0d1a0f 0%, #163320 100%)' }}
      >
        <div className="container-flora">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left — text content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  boxShadow: '0 8px 30px rgba(220,39,67,0.35)',
                }}
              >
                <FaInstagram size={26} className="text-white" />
              </div>

              <p className="text-label mb-3" style={{ color: 'rgba(142,201,162,0.6)' }}>
                Find us on Instagram
              </p>
              <h2
                style={{ fontFamily: 'var(--font-serif)', color: '#fff', lineHeight: 1.2, fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                className="font-bold mb-4"
              >
                Follow{' '}
                <span
                  style={{
                    background: 'linear-gradient(90deg, #f09433, #dc2743, #bc1888)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  @flora.plants_
                </span>
              </h2>
              <p
                className="mb-8 text-sm md:text-base"
                style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.85 }}
              >
                Join our growing community of plant lovers. We share care tips, new arrivals,
                beautiful setups, and the occasional behind-the-scenes from our nursery.
              </p>

              <a
                href="https://www.instagram.com/flora.plants_"
                target="_blank"
                rel="noopener noreferrer"
                className="btn group inline-flex"
                style={{
                  background: 'linear-gradient(135deg, #f09433, #dc2743, #bc1888)',
                  color: '#fff',
                  boxShadow: '0 8px 30px rgba(220,39,67,0.3)',
                }}
              >
                <FaInstagram size={16} />
                Follow on Instagram
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
              </a>
            </motion.div>

            {/* Right — highlight cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="grid grid-cols-2 gap-3 md:gap-4"
            >
              {instaHighlights.map(({ emoji, label, desc }, i) => (
                <motion.a
                  key={label}
                  href="https://www.instagram.com/flora.plants_"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="rounded-2xl p-5 md:p-6 block group"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(240,148,51,0.2)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span className="text-3xl mb-3 block">{emoji}</span>
                  <h4
                    className="font-semibold mb-1.5 text-sm md:text-base"
                    style={{ color: '#fff', fontFamily: 'var(--font-serif)' }}
                  >
                    {label}
                  </h4>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                    {desc}
                  </p>
                  {/* Gradient border on hover */}
                  <div
                    className="mt-3 h-px w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: 'linear-gradient(90deg, #f09433, #bc1888)' }}
                  />
                </motion.a>
              ))}

              {/* Follower count / social proof pill */}
              <div
                className="col-span-2 rounded-2xl p-4 flex items-center gap-4"
                style={{
                  background: 'rgba(240,148,51,0.08)',
                  border: '1px solid rgba(240,148,51,0.25)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(240,148,51,0.2)' }}
                >
                  <FaHeart size={16} style={{ color: '#f09433' }} />
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                  Growing community of plant lovers in Lucknow & beyond.{' '}
                  <a
                    href="https://www.instagram.com/flora.plants_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold"
                    style={{ color: '#f09433' }}
                  >
                    Come join us →
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-pad" style={{ background: '#fff' }} id="faq">
        <div className="container-flora" style={{ maxWidth: '760px' }}>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-label mb-3" style={{ color: 'var(--color-sage)' }}>Got Questions?</p>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-ink)',
                lineHeight: 1.2,
                fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
                fontWeight: 700,
              }}
            >
              Frequently Asked{' '}
              <em className="italic font-normal" style={{ color: 'var(--color-moss)' }}>
                Questions
              </em>
            </h2>
          </div>
          <div>
            {faqItems.map((item) => (
              <FAQItem key={item.q} {...item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
