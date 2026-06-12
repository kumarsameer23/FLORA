import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSearch, HiOutlineMenu, HiX, HiChevronDown,
} from 'react-icons/hi';
import { FaWhatsapp, FaLeaf } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { getWAEnquiryLink } from '../../utils/helpers';
import SearchModal from './SearchModal';

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/shop', hasDropdown: true },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/contact' },
];

const moreLinks = [
  { label: '❓ FAQs', href: '/#faq' },
  { label: '🌿 Our Promise', href: '/#returns' },
  { label: '📦 How to Order', href: '/#how-to-order' },
  { label: '🚚 Track Order', href: null, waMessage: "Hi FLORA! 🌿\n\nI'd like to track my order. Can you help me?" },
  { label: '💚 Care Support', href: null, waMessage: "Hi FLORA! 🌿\n\nI have some questions about caring for my plant. Can you guide me?" },
];

const categoryLinks = [
  { label: '🏠 Indoor Plants', href: '/shop?category=indoor-plants' },
  { label: '🌳 Outdoor Plants', href: '/shop?category=outdoor-plants' },
  { label: '🌸 Flowering Plants', href: '/shop?category=flowering-plants' },
  { label: '🌵 Succulents', href: '/shop?category=succulents' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setMoreOpen(false);
  }, [location]);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navBg = scrolled || !isHomePage
    ? 'bg-ink/95 backdrop-blur-xl border-b border-mint/10'
    : 'bg-transparent';

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container-flora flex items-center justify-between py-4 md:py-5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-mint to-moss flex items-center justify-center">
              <FaLeaf className="text-white text-xs" />
            </div>
            <span
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-xl font-black tracking-widest text-white"
            >
              FLORA<span style={{ color: 'var(--color-gold)' }}>.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.label} className="relative">
                {link.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-white/70 hover:text-gold transition-colors text-xs font-medium tracking-widest uppercase">
                      {link.label}
                      <HiChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-52 glass-dark rounded-lg py-2 shadow-2xl"
                        >
                          {categoryLinks.map((cat) => (
                            <Link
                              key={cat.href}
                              to={cat.href}
                              className="block px-4 py-2.5 text-white/70 hover:text-gold hover:bg-white/5 text-sm transition-colors"
                            >
                              {cat.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `text-xs font-medium tracking-widest uppercase transition-colors ${isActive ? 'text-gold' : 'text-white/70 hover:text-gold'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}

            {/* More dropdown — replaces the three-dot menu */}
            <li className="relative">
              <div
                className="relative"
                onMouseEnter={() => setMoreOpen(true)}
                onMouseLeave={() => setMoreOpen(false)}
              >
                <button className="flex items-center gap-1 text-white/70 hover:text-gold transition-colors text-xs font-medium tracking-widest uppercase">
                  More
                  <HiChevronDown className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-52 glass-dark rounded-lg py-2 shadow-2xl"
                    >
                      {moreLinks.map((item) =>
                        item.href ? (
                          <a
                            key={item.label}
                            href={item.href}
                            className="block px-4 py-2.5 text-white/70 hover:text-gold hover:bg-white/5 text-sm transition-colors"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <a
                            key={item.label}
                            href={getWAEnquiryLink(item.waMessage)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2.5 text-white/70 hover:text-gold hover:bg-white/5 text-sm transition-colors"
                          >
                            {item.label}
                          </a>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-white/70 hover:text-gold transition-colors"
              aria-label="Search"
            >
              <HiOutlineSearch size={20} />
            </button>

            {/* WhatsApp CTA */}
            <a
              href={getWAEnquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 btn-wa text-xs px-4 py-2.5"
            >
              <FaWhatsapp size={16} />
              <span>Order Now</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white/70 hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiX size={22} /> : <HiOutlineMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden glass-dark border-t border-mint/10"
            >
              <div className="container-flora py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-white/70 hover:text-gold py-3 px-2 text-sm font-medium tracking-wider uppercase border-b border-white/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* More links in mobile menu */}
                <div className="border-t border-white/10 mt-2 pt-2">
                  <p className="px-2 pt-1 pb-2 text-[10px] uppercase tracking-widest font-semibold text-white/30">Quick Links</p>
                  {moreLinks.map((item) =>
                    item.href ? (
                      <a
                        key={item.label}
                        href={item.href}
                        className="text-white/60 hover:text-gold py-2.5 px-2 text-sm font-medium tracking-wider transition-colors block"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <a
                        key={item.label}
                        href={getWAEnquiryLink(item.waMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-gold py-2.5 px-2 text-sm font-medium tracking-wider transition-colors block"
                      >
                        {item.label}
                      </a>
                    )
                  )}
                </div>

                <div className="pt-4 pb-2 flex flex-col gap-2">
                  <a
                    href={getWAEnquiryLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa w-full justify-center"
                  >
                    <FaWhatsapp /> Order on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
