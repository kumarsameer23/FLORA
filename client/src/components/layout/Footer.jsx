import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaLeaf } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { motion } from 'framer-motion';

const footerLinks = {
  Shop: [
    { label: 'Indoor Plants', href: '/shop?category=indoor-plants' },
    { label: 'Outdoor Plants', href: '/shop?category=outdoor-plants' },
    { label: 'Flowering Plants', href: '/shop?category=flowering-plants' },
    { label: 'Succulents', href: '/shop?category=succulents' },
    { label: 'Air Purifying', href: '/shop?airPurifying=true' },
    { label: 'All Collection', href: '/shop' },
  ],
  Company: [
    { label: 'About FLORA', href: '/#about' },
    { label: 'Our Story', href: '/#about' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Help: [
    { label: 'Plant Care Tips', href: 'https://wa.me/917054416071?text=Hi%20FLORA!%20🌿%20I%20need%20some%20care%20tips%20for%20my%20plants.' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-ink)' }} className="text-white/40">
      {/* Main Footer */}
      <div className="container-flora py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-mint), var(--color-moss))' }}>
                <FaLeaf className="text-white text-sm" />
              </div>
              <span style={{ fontFamily: 'var(--font-serif)' }} className="text-2xl font-black tracking-widest text-white">
                FLORA<span style={{ color: 'var(--color-gold)' }}>.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6">
              Premium plants curated from the finest nurseries in India. Delivered fresh with expert care guidance to every home in Lucknow.
            </p>
            {/* Contact */}
            <div className="space-y-2 text-sm mb-6">
              <div className="flex items-center gap-2 hover:text-gold transition-colors">
                <FaWhatsapp className="text-whatsapp shrink-0" />
                <a href="https://wa.me/917054416071" target="_blank" rel="noopener noreferrer">+91 70544 16071</a>
              </div>
              <div className="flex items-center gap-2">
                <HiLocationMarker className="shrink-0 text-gold" />
                <span>Lucknow, Uttar Pradesh, India</span>
              </div>
            </div>
            {/* Social */}
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/flora.plants_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold transition-all"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://wa.me/917054416071"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-whatsapp hover:text-whatsapp transition-all"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={16} />
              </a>

            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h5 className="text-xs tracking-widest uppercase text-white/70 mb-5">{title}</h5>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('http') || link.href.startsWith('wa.me') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-gold transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm hover:text-gold transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span>© 2024 <span style={{ color: 'var(--color-gold)' }}>FLORA</span> Nursery. All rights reserved.</span>
          <div className="flex items-center gap-1">
            Made with <FaLeaf className="mx-1" style={{ color: 'var(--color-mint)' }} /> in Lucknow
          </div>

        </div>
      </div>
    </footer>
  );
}
