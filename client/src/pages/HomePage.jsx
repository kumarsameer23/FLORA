import { Helmet } from 'react-helmet-async';
import Hero from '../components/sections/Hero';
import FeaturedCategories from '../components/sections/FeaturedCategories';
import AboutSection from '../components/sections/AboutSection';
import SocialProofSection from '../components/sections/SocialProofSection';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getWAEnquiryLink } from '../utils/helpers';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>FLORA — Premium Plants for Every Home | Lucknow</title>
        <meta name="description" content="Discover rare and beautiful plants at FLORA Lucknow. Indoor plants, outdoor plants, succulents, air purifying plants and more. Order on WhatsApp for same-day delivery." />
        <meta property="og:title" content="FLORA — Premium Plants for Every Home" />
        <meta property="og:description" content="Premium plant varieties. Same-day delivery in Lucknow. Order on WhatsApp." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://floraplants.in" />
      </Helmet>

      <Hero />
      <FeaturedCategories />
      <AboutSection />
      <SocialProofSection />

      {/* WhatsApp FAB */}
      <motion.a
        href={getWAEnquiryLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-white animate-wa-pulse"
        style={{ background: 'var(--color-whatsapp)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat on WhatsApp"
        title="Order on WhatsApp"
      >
        <FaWhatsapp size={26} />
      </motion.a>
    </>
  );
}
