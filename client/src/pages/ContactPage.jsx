import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { HiLocationMarker, HiCheckCircle, HiMail } from 'react-icons/hi';
import { useState } from 'react';
import { getWAEnquiryLink } from '../utils/helpers';

/**
 * Email delivery via Formspree — a free, no-backend form service.
 * Replace "YOUR_FORM_ID" below with your actual Formspree form ID.
 *
 * HOW TO SET UP (one-time, ~2 minutes):
 *  1. Go to https://formspree.io/new (free account)
 *  2. Create a new form, set the email to singhshivam112002@gmail.com
 *  3. Copy your Form ID (looks like "xpwzgqab")
 *  4. Paste it below replacing YOUR_FORM_ID
 *
 * Until then, the form falls back to sending via WhatsApp.
 */
const FORMSPREE_ID = 'mdavwpzn'; // ✅ configured
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;
const isFormspreeConfigured = FORMSPREE_ID !== 'mdavwpzn';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formspreeError, setFormspreeError] = useState(false); // true = Formspree failed, use WA
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // If already failed or not configured, go straight to WhatsApp
    if (formspreeError || !isFormspreeConfigured) {
      sendViaWhatsApp(data);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          subject: data.subject || 'Message from FLORA website',
          message: data.message,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormspreeError(false);
        reset();
      } else {
        // Formspree returned error (e.g. form not yet activated) — fall back to WhatsApp
        setFormspreeError(true);
        sendViaWhatsApp(data);
      }
    } catch {
      // Network error — fall back to WhatsApp
      setFormspreeError(true);
      sendViaWhatsApp(data);
    } finally {
      setLoading(false);
    }
  };

  const sendViaWhatsApp = (data) => {
    const message =
      `Hi FLORA! 🌿\n\n*New Message from Website*\n\n` +
      `Name: ${data.name}\n` +
      `Email: ${data.email}\n` +
      (data.phone ? `Phone: ${data.phone}\n` : '') +
      (data.subject ? `Subject: ${data.subject}\n` : '') +
      `\nMessage:\n${data.message}`;
    window.open(getWAEnquiryLink(message), '_blank', 'noopener,noreferrer');
    reset();
  };

  return (
    <>
      <Helmet>
        <title>Contact FLORA — Lucknow Plant Nursery</title>
        <meta name="description" content="Contact FLORA Lucknow for plant orders, care advice, and queries. WhatsApp us for instant support or send us a message." />
        <meta property="og:title" content="Contact FLORA — Plant Nursery Lucknow" />
        <meta property="og:description" content="Reach out to FLORA nursery. WhatsApp for instant replies. Serving Lucknow." />
        <link rel="canonical" href="https://floraplants.in/contact" />
      </Helmet>

      <div className="min-h-screen pt-20" style={{ background: 'var(--color-cream)' }}>

        {/* ── Page header ── */}
        <div className="section-pad-sm" style={{ background: 'var(--color-forest)' }}>
          <div className="container-flora">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-label text-white/50 mb-3">Get in Touch</p>
              <h1
                style={{ fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                Contact{' '}
                <em className="italic font-normal" style={{ color: 'var(--color-mint)' }}>
                  FLORA
                </em>
              </h1>
              <p className="text-white/55 text-sm md:text-base max-w-lg" style={{ lineHeight: 1.8 }}>
                Have a question? Fill the form and we'll reply on email — or tap WhatsApp for an instant response!
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container-flora py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20" style={{ maxWidth: '1000px' }}>

            {/* ── Contact Info ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)', lineHeight: 1.3 }}
                className="text-2xl md:text-3xl font-bold mb-4"
              >
                We'd love to hear from you
              </h2>
              <p style={{ color: 'var(--color-sage)', lineHeight: 1.8 }} className="text-sm mb-8">
                Whether you're looking for a specific plant, need care advice, or want to place a bulk
                order — we're here to help. WhatsApp is the fastest way to reach us!
              </p>

              <div className="space-y-3">
                {/* WhatsApp */}
                <motion.a
                  href="https://wa.me/917054416071"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl border transition-all group"
                  style={{ borderColor: 'rgba(90,138,106,0.2)', background: '#fff' }}
                  whileHover={{ x: 4, boxShadow: '0 8px 30px rgba(13,26,15,0.1)' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: '#25d366' }}
                  >
                    <FaWhatsapp className="text-white text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--color-ink)' }}>
                      WhatsApp
                      <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{ background: 'rgba(37,211,102,0.1)', color: '#1da851' }}>
                        Fastest reply
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-sage)' }}>+91 70544 16071</div>
                  </div>
                </motion.a>

                {/* Location */}
                <div
                  className="flex items-center gap-4 p-4 rounded-2xl border"
                  style={{ borderColor: 'rgba(90,138,106,0.2)', background: '#fff' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--color-mist)' }}
                  >
                    <HiLocationMarker className="text-xl" style={{ color: 'var(--color-moss)' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>Location</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-sage)' }}>Lucknow, Uttar Pradesh, India</div>
                  </div>
                </div>

                {/* Instagram */}
                <motion.a
                  href="https://www.instagram.com/flora.plants_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl border transition-all"
                  style={{ borderColor: 'rgba(90,138,106,0.2)', background: '#fff' }}
                  whileHover={{ x: 4, boxShadow: '0 8px 30px rgba(13,26,15,0.1)' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                  >
                    <FaInstagram className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>Instagram</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-sage)' }}>@flora.plants_</div>
                  </div>
                </motion.a>
              </div>

              {/* Direct WA CTA */}
              <div
                className="mt-8 p-5 rounded-2xl"
                style={{ background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.18)' }}
              >
                <p className="text-sm mb-4" style={{ color: 'var(--color-ink)', lineHeight: 1.7 }}>
                  <strong>Prefer to chat directly?</strong> Skip the form and message us on WhatsApp — we usually reply within minutes.
                </p>
                <a
                  href={getWAEnquiryLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa w-full justify-center"
                >
                  <FaWhatsapp size={18} />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Email note */}
               <p className="mt-4 text-xs text-center" style={{ color: 'var(--color-sage)', lineHeight: 1.7 }}>
                 We typically reply within <strong style={{ color: 'var(--color-moss)' }}>24 hours</strong>
               </p>
            </motion.div>

            {/* ── Form ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className="bg-white rounded-3xl p-6 md:p-8 border"
                style={{ borderColor: 'rgba(90,138,106,0.15)', boxShadow: '0 4px 40px rgba(13,26,15,0.06)' }}
              >
                {submitted ? (
                  /* ── Success state ── */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <HiCheckCircle size={56} className="mx-auto mb-4" style={{ color: 'var(--color-moss)' }} />
                    <h3
                      style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
                      className="text-2xl font-bold mb-3"
                    >
                      Message Sent!
                    </h3>
                    <p style={{ color: 'var(--color-sage)', lineHeight: 1.8 }} className="text-sm mb-6">
                      Thank you for reaching out to us. We will reply within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn btn-ghost-dark px-6"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <h3
                      style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)', lineHeight: 1.3 }}
                      className="text-xl md:text-2xl font-bold mb-2"
                    >
                      Send us a message
                    </h3>
                    <p className="text-xs mb-6" style={{ color: 'var(--color-sage)', lineHeight: 1.7 }}>
                      {formspreeError
                        ? '📱 Email failed — your message will open in WhatsApp instead.'
                        : 'Your message will be delivered to our email inbox.'}
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-moss)' }}>
                            Name *
                          </label>
                          <input
                            className={`input-flora ${errors.name ? 'border-red-400' : ''}`}
                            placeholder="Your name"
                            {...register('name', { required: 'Name is required' })}
                          />
                          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-moss)' }}>
                            Email *
                          </label>
                          <input
                            type="email"
                            className={`input-flora ${errors.email ? 'border-red-400' : ''}`}
                            placeholder="you@example.com"
                            {...register('email', { required: 'Email is required' })}
                          />
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-moss)' }}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          className="input-flora"
                          placeholder="+91 98765 43210"
                          {...register('phone')}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-moss)' }}>
                          Subject
                        </label>
                        <input
                          className="input-flora"
                          placeholder="Plant enquiry, order help..."
                          {...register('subject')}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-moss)' }}>
                          Message *
                        </label>
                        <textarea
                          className={`input-flora resize-none ${errors.message ? 'border-red-400' : ''}`}
                          rows={4}
                          placeholder="Tell us what you're looking for..."
                          {...register('message', { required: 'Message is required' })}
                        />
                        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`btn w-full justify-center ${formspreeError ? 'btn-wa' : 'btn-forest'}`}
                        style={{ opacity: loading ? 0.7 : 1 }}
                      >
                        {formspreeError ? <FaWhatsapp size={16} /> : <HiMail size={16} />}
                        {loading ? 'Sending...' : formspreeError ? 'Send on WhatsApp' : 'Send'}
                      </button>

                      <p className="text-center text-xs" style={{ color: 'var(--color-sage)', lineHeight: 1.7 }}>
                        {formspreeError
                          ? <>Your message will be sent directly via WhatsApp.</>
                          : <>We’ll get back to you within 24 hours.</>}
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
