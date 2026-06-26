import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Menu, X, ArrowRight, Compass, Hotel, ChevronDown, User, LogOut, LogIn } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Destinations', path: '/destinations' },
  { name: 'Packages', path: '/packages' },
  { name: 'Hotels', path: '/hotels', hasDropdown: true },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const hotelLocations = [
  { name: 'Rishikesh', slug: 'rishikesh', desc: 'Riverside retreats & yoga ashrams', img: 'https://images.unsplash.com/photo-1701358736212-6593deb47fc3?w=100&h=100&fit=crop' },
  { name: 'Manali', slug: 'manali', desc: 'Mountain lodges & snow resorts', img: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=100&h=100&fit=crop' },
  { name: 'Goa', slug: 'goa', desc: 'Beachfront villas & heritage stays', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop' },
  { name: 'Kerala', slug: 'kerala', desc: 'Backwater houseboats & tea estates', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=100&h=100&fit=crop' },
  { name: 'Jaipur', slug: 'jaipur', desc: 'Heritage havelis & palace hotels', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=100&h=100&fit=crop' },
  { name: 'Darjeeling', slug: 'darjeeling', desc: 'Colonial bungalows & tea garden stays', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop' },
];

/* ================================================
   NAVBAR — Luxury editorial sticky navigation
   ================================================ */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hotelsOpen, setHotelsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setHotelsOpen(false); setAuthOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* ===== DESKTOP NAVIGATION ===== */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        role="banner"
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div
          className={`transition-all duration-500 ease-out ${
            scrolled
              ? 'bg-white/[0.88] backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_rgba(26,26,46,0.06)]'
              : 'bg-transparent'
          }`}
        >
          <div className={`container-custom flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16' : 'h-[76px]'}`}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="WanderNest — Go to homepage">
              <motion.div
                whileHover={{ scale: 1.08, rotate: -6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className={`w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-md shadow-primary-500/25 transition-all duration-300 ${scrolled ? '' : 'shadow-lg shadow-primary-500/30'}`}
              >
                <MapPin className="w-[18px] h-[18px] text-white" />
              </motion.div>
              <span className={`font-heading font-bold transition-all duration-300 ${scrolled ? 'text-lg text-heading' : 'text-xl text-heading'}`}>
                Wander<span className="text-gradient-warm">Nest</span>
              </span>
            </Link>

            {/* Nav Links */}
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.name} className="relative"
                  onMouseEnter={() => link.hasDropdown && setHotelsOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setHotelsOpen(false)}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `relative px-4 py-2 text-[13px] font-medium tracking-wide rounded-full transition-all duration-300 flex items-center gap-1 ${
                        isActive ? 'text-heading' : 'text-gray-500 hover:text-heading'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.name}
                        {link.hasDropdown && <ChevronDown className={`w-3 h-3 transition-transform ${hotelsOpen ? 'rotate-180' : ''}`} />}
                        {isActive && (
                          <motion.div
                            layoutId="active-pill"
                            className="absolute inset-0 -z-10 rounded-full bg-primary-50 border border-primary-100/50"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          >
                            <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-accent-400" />
                          </motion.div>
                        )}
                      </>
                    )}
                  </NavLink>

                  {/* Hotels Dropdown */}
                  {link.hasDropdown && (
                    <AnimatePresence>
                      {hotelsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl overflow-hidden shadow-2xl border z-50 bg-white/95 backdrop-blur-xl border-gray-100"
                        >
                          <div className="p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-2 text-primary-500">
                              Browse by destination
                            </p>
                            {hotelLocations.map((loc, i) => (
                              <motion.div
                                key={loc.slug}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                              >
                                <Link
                                  to={`/hotels?location=${loc.slug}`}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-gray-50"
                                >
                                  <img src={loc.img} alt={loc.name} className="w-9 h-9 rounded-lg object-cover" />
                                  <div>
                                    <p className="text-sm font-semibold text-[#2B3A52]">{loc.name}</p>
                                    <p className="text-[11px] text-gray-400">{loc.desc}</p>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                          <div className="px-3 py-3 border-t border-gray-100">
                            <Link to="/hotels" className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors text-primary-600 hover:bg-primary-50">
                              View All Hotels <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right: Auth + CTA + Hamburger */}
            <div className="flex items-center gap-2">
              {/* Auth Button / Profile */}
              <div className="relative hidden lg:block"
                onMouseEnter={() => setAuthOpen(true)}
                onMouseLeave={() => setAuthOpen(false)}
              >
                {isAuthenticated ? (
                  <button className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors bg-primary-50 text-primary-600">
                    {user?.avatar || 'U'}
                  </button>
                ) : (
                  <Link to="/auth" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-gray-100 hover:bg-gray-200 text-[#2B3A52]">
                    <User className="w-4 h-4" />
                  </Link>
                )}

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {authOpen && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-56 rounded-2xl overflow-hidden shadow-2xl border z-50 bg-white/95 backdrop-blur-xl border-gray-100"
                    >
                      <div className="p-4">
                        <p className="font-heading font-bold text-sm text-[#2B3A52]">{user?.name}</p>
                        <p className="text-xs mt-0.5 text-gray-400">{user?.email}</p>
                      </div>
                      <div className="border-t border-gray-100">
                        <Link to="/profile" className="flex items-center gap-2 px-4 py-3 text-sm transition-colors text-gray-600 hover:bg-gray-50">
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                        <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors text-red-500 hover:bg-red-50">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/packages"
                className="hidden lg:inline-flex group/btn relative items-center gap-2 px-5 py-2.5 rounded-full overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/25"
              >
                <div className="absolute inset-0 gradient-primary" />
                <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                <span className="relative text-[13px] font-semibold text-white tracking-wide">Book Now</span>
                <ArrowRight className="relative w-3.5 h-3.5 text-white/80 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-black/5"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-5 h-5 text-heading" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-5 h-5 text-heading" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ===== MOBILE DRAWER ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-[#2B3A52]/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

            <motion.div
              id="mobile-nav"
              role="navigation"
              aria-label="Mobile navigation"
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 36 }}
              className="relative backdrop-blur-2xl rounded-b-3xl shadow-2xl overflow-hidden bg-white/[0.97]"
            >
              <div className="absolute inset-0 grain pointer-events-none" />
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[70px] bg-primary-100/30" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full blur-[50px] bg-accent-100/20" />

              <div className="relative z-10 px-6 pt-24 pb-8">
                <nav aria-label="Mobile navigation links">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <NavLink
                        to={link.path}
                        onClick={() => !link.hasDropdown && setMobileOpen(false)}
                        className={({ isActive }) =>
                          `group flex items-center justify-between py-4 px-4 rounded-xl border-b last:border-0 transition-all duration-200 border-gray-100/80 ${isActive ? 'bg-primary-50/70' : 'hover:bg-gray-50'}`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div className="flex items-center gap-4">
                              <span className="text-[11px] font-mono tabular-nums text-gray-300">0{i + 1}</span>
                              <span className={`text-base font-heading font-semibold ${isActive ? 'text-primary-500' : 'text-heading'}`}>{link.name}</span>
                            </div>
                            {isActive && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}>
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                              </motion.div>
                            )}
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mt-6 pt-6 border-t border-gray-100 space-y-4"
                >
                  {!isAuthenticated && (
                    <Link
                      to="/auth"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold transition-all bg-gray-100 text-[#2B3A52]"
                    >
                      <LogIn className="w-4 h-4" /> Sign In
                    </Link>
                  )}
                  <Link
                    to="/packages"
                    onClick={() => setMobileOpen(false)}
                    className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-primary-500/20 hover:shadow-xl transition-shadow"
                  >
                    Start Your Journey
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Compass className="w-3.5 h-3.5 text-primary-400" />
                    <span>Need help?</span>
                    <span className="text-primary-500 font-medium">+91 98765 43210</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
