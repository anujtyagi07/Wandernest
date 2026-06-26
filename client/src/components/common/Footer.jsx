import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Mail, MapPinned, Globe, Camera,
  MessageCircle, Play, ArrowUpRight
} from 'lucide-react';

/* ================================================
   DATA
   ================================================ */
const footerLinks = {
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/contact' },
    { name: 'Blog', path: '/destinations' },
  ],
  destinations: [
    { name: 'Chardham Yatra', path: '/destinations?category=chardham' },
    { name: 'Hill Stations', path: '/destinations?category=hill-stations' },
    { name: 'Spiritual Places', path: '/destinations?category=spiritual' },
    { name: 'Heritage Sites', path: '/destinations?category=heritage' },
  ],
  support: [
    { name: 'Contact Us', path: '/contact' },
    { name: 'FAQs', path: '/contact' },
    { name: 'Terms & Conditions', path: '/contact' },
    { name: 'Privacy Policy', path: '/contact' },
  ],
};

const socialLinks = [
  { Icon: Globe, label: 'Website', href: '#' },
  { Icon: Camera, label: 'Instagram', href: '#' },
  { Icon: MessageCircle, label: 'Twitter', href: '#' },
  { Icon: Play, label: 'YouTube', href: '#' },
];

/* ================================================
   ANIMATION VARIANTS
   ================================================ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ================================================
   FOOTER LINK — dot-indicator hover (21st.dev)
   ================================================ */
const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="group/fl flex items-center text-[13px] text-gray-400 hover:text-white transition-colors duration-250"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-400 mr-0 opacity-0 -translate-x-2 group-hover/fl:opacity-100 group-hover/fl:translate-x-0 transition-all duration-250 shrink-0" />
      <span className="ml-0 group-hover/fl:ml-2 transition-all duration-250">{children}</span>
    </Link>
  </li>
);

/* ================================================
   FOOTER HEADING
   ================================================ */
const FooterHeading = ({ children }) => (
  <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70 font-body mb-6">
    {children}
  </h4>
);

/* ================================================
   FOOTER
   ================================================ */
const Footer = () => {
  return (
    <footer className="relative bg-[#2B3A52] text-gray-300 overflow-hidden" role="contentinfo">

      {/* ===== ATMOSPHERIC BACKGROUND ===== */}
      {/* Grid pattern with radial fade */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)',
          }}
        />
      </div>

      {/* Ambient glow orbs */}
      <div className="absolute top-0 right-[15%] w-[500px] h-[500px] rounded-full bg-primary-500/[0.04] blur-[140px]" />
      <div className="absolute bottom-20 left-[8%] w-[350px] h-[350px] rounded-full bg-accent-500/[0.03] blur-[120px]" />
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[700px] h-[200px] rounded-full bg-primary-600/[0.02] blur-[100px]" />

      {/* Grain overlay */}
      <div className="absolute inset-0 grain pointer-events-none" />

      {/* ===== BRAND CENTERPIECE ===== */}
      <div className="relative z-10 pt-16 md:pt-20 pb-6">
        <div className="container-custom flex flex-col items-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col items-center"
          >
            {/* Logo mark */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="relative mb-6"
            >
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-xl shadow-primary-500/20">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              {/* Radial glow behind logo */}
              <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-primary-500/10 blur-2xl" />
            </motion.div>

            {/* Brand name */}
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
              Wander<span className="text-gradient-warm">Nest</span>
            </h2>

            {/* Tagline */}
            <p className="text-gray-400 text-sm text-center max-w-md leading-relaxed mb-8">
              Your trusted partner for sacred journeys and breathtaking adventures
              across India. From the holy Chardham Yatra to pristine hill stations.
            </p>

            {/* Social icons row */}
            <div className="flex items-center gap-3 mb-8">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`Follow us on ${label}`}
                  className="group/soc relative w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-transparent hover:shadow-lg hover:shadow-primary-500/10"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 opacity-0 group-hover/soc:opacity-100 transition-opacity duration-300" />
                  <Icon className="relative z-10 w-[18px] h-[18px] text-gray-500 group-hover/soc:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>

            {/* Contact pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { Icon: Phone, text: '+91 98765 43210' },
                { Icon: Mail, text: 'hello@wandernest.in' },
                { Icon: MapPinned, text: 'Rishikesh, Uttarakhand' },
              ].map(({ Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-gray-400"
                >
                  <Icon className="w-3.5 h-3.5 text-primary-400/80" />
                  {text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== GRADIENT SEPARATOR ===== */}
      <div className="relative z-10 my-4">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-primary-500/25 to-transparent" />
      </div>

      {/* ===== LINK COLUMNS ===== */}
      <div className="relative z-10 container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-16">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
          >
            <FooterHeading>Company</FooterHeading>
            <ul className="space-y-3.5">
              {footerLinks.company.map((link) => (
                <FooterLink key={link.name} to={link.path}>{link.name}</FooterLink>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0.08}
          >
            <FooterHeading>Destinations</FooterHeading>
            <ul className="space-y-3.5">
              {footerLinks.destinations.map((link) => (
                <FooterLink key={link.name} to={link.path}>{link.name}</FooterLink>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0.16}
          >
            <FooterHeading>Support</FooterHeading>
            <ul className="space-y-3.5">
              {footerLinks.support.map((link) => (
                <FooterLink key={link.name} to={link.path}>{link.name}</FooterLink>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* ===== GHOSTED BRAND TEXT ===== */}
      <div
        className="relative z-[1] select-none pointer-events-none text-center overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="block font-heading font-extrabold tracking-tighter leading-none bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-transparent bg-clip-text text-transparent"
          style={{ fontSize: 'clamp(3rem, 11vw, 9rem)' }}
        >
          WANDERNEST
        </span>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="relative z-10 border-t border-white/[0.05]">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-500/80 font-body tracking-wide">
            &copy; {new Date().getFullYear()} <span className="text-gray-400">WanderNest</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-gray-500/80">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <a href="#" className="hover:text-gray-300 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
