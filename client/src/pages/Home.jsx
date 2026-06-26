import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  MapPin, Star, Clock, ArrowUpRight, Compass,
  Mountain, TreePine, Landmark, Waves, ShieldCheck,
  Headphones, IndianRupee, ChevronRight, Send, Quote
} from 'lucide-react';
import { packageService } from '../services/packageService';

/* ========================================
   ANIMATION VARIANTS
   ======================================== */
const reveal = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/* ========================================
   HERO SECTION
   ======================================== */
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-surface-dim grain">
      {/* Background elements */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute top-32 right-[10%] w-[500px] h-[500px] rounded-full bg-primary-100/30 blur-[100px]" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] rounded-full bg-secondary-100/25 blur-[80px]" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-accent-100/20 blur-[60px]" />
      </motion.div>

      <motion.div style={{ opacity }} className="container-custom relative z-10 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial="hidden" animate="visible" variants={stagger}
            className="lg:col-span-7"
          >
            <motion.div variants={reveal} className="flex items-center gap-3 mb-8">
              <div className="w-12 h-[2px] bg-primary-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">
                India's Premier Travel Experience
              </span>
            </motion.div>

            <motion.h1 variants={reveal} className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold leading-[0.95] mb-8 text-heading">
              Journey to the
              <br />
              <span className="italic font-normal text-gradient-warm">Sacred</span>{' '}
              Peaks of
              <br />
              <span className="italic font-normal text-gradient-warm">India</span>
            </motion.h1>

            <motion.p variants={reveal} className="text-gray-500 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light">
              Curated pilgrimage tours from Chardham Yatra to the serene hill stations
              of the Himalayas. Every journey, a story worth telling.
            </motion.p>

            <motion.div variants={reveal} className="flex flex-wrap items-center gap-5">
              <Link
                to="/packages"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#2B3A52] text-white font-medium rounded-full overflow-hidden transition-all duration-500 hover:bg-[#354862] hover:shadow-2xl hover:shadow-primary-500/20"
              >
                <span className="relative z-10">Explore Packages</span>
                <ArrowUpRight className="relative z-10 w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              <Link
                to="/destinations"
                className="inline-flex items-center gap-2 px-6 py-4 text-gray-600 font-medium hover:text-primary-600 transition-colors group"
              >
                <span className="border-b border-gray-300 group-hover:border-primary-400 transition-colors pb-1">
                  View All Destinations
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Stats Strip */}
            <motion.div variants={reveal} className="flex gap-12 mt-16 pt-10 border-t border-gray-200/60">
              {[
                { value: '10K+', label: 'Travelers' },
                { value: '50+', label: 'Destinations' },
                { value: '4.9', label: 'Avg Rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-heading font-bold text-heading">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Floating visual composition */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <div className="relative h-[600px]">
              {/* Main image card — Kedarnath */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 right-0 w-[320px] h-[420px] rounded-3xl overflow-hidden shadow-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=640&h=840&fit=crop"
                  alt="Kedarnath Temple surrounded by snow-capped Himalayan peaks"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = ''; e.currentTarget.style.background = 'linear-gradient(135deg, #FF6B35, #F5A623)'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Mountain className="w-8 h-8 text-white/70 mb-3" />
                  <p className="text-white font-heading text-xl font-semibold">Kedarnath Temple</p>
                  <p className="text-white/60 text-sm mt-1">Uttarakhand, India • 3,583m</p>
                </div>
              </motion.div>

              {/* Secondary card — Manali */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-0 left-0 w-[200px] h-[260px] rounded-2xl overflow-hidden shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1597074866923-dc0589150358?w=400&h=520&fit=crop"
                  alt="Lush green valleys and snow peaks of Manali"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = ''; e.currentTarget.style.background = 'linear-gradient(135deg, #34d399, #10b981)'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <TreePine className="w-5 h-5 text-white/60 mb-2" />
                  <p className="text-white text-sm font-medium">Manali, Himachal</p>
                </div>
              </motion.div>

              {/* Small accent card — Badrinath */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-16 left-8 w-[180px] h-[220px] rounded-2xl overflow-hidden shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=360&h=440&fit=crop"
                  alt="Sacred Badrinath Temple in the Himalayas"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = ''; e.currentTarget.style.background = 'linear-gradient(135deg, #fb923c, #ea580c)'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <Landmark className="w-5 h-5 text-white/60 mb-2" />
                  <p className="text-white text-sm font-medium">Badrinath Dham</p>
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-20 left-[55%] bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent-600 fill-accent-500" />
                </div>
                <div>
                  <p className="font-semibold text-heading text-sm">4.9 Rating</p>
                  <p className="text-[10px] text-gray-400">2,000+ reviews</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-gray-400 to-transparent" />
      </motion.div>
    </section>
  );
};

/* ========================================
   CATEGORY CARDS (Horizontal scroll feel)
   ======================================== */
const categories = [
  { icon: Mountain, name: 'Chardham Yatra', count: '12 Packages', img: 'https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=400&h=600&fit=crop', fallback: 'from-orange-400 to-primary-500', desc: 'Sacred pilgrimage to Badrinath, Kedarnath, Gangotri & Yamunotri' },
  { icon: TreePine, name: 'Hill Stations', count: '18 Packages', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=600&fit=crop', fallback: 'from-emerald-400 to-secondary-500', desc: 'Cool mountain retreats in Manali, Shimla, Darjeeling & more' },
  { icon: Landmark, name: 'Heritage Sites', count: '15 Packages', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=600&fit=crop', fallback: 'from-amber-400 to-accent-500', desc: 'Royal palaces, ancient temples & UNESCO World Heritage wonders' },
  { icon: Waves, name: 'Beaches', count: '8 Packages', img: 'https://images.unsplash.com/photo-1727193119592-b1a1201b84ce?w=400&h=600&fit=crop', fallback: 'from-cyan-400 to-blue-500', desc: 'Sun-soaked coastal getaways in Goa, Kerala & the Andamans' },
];

const CategorySection = () => (
  <section className="py-24 bg-white relative overflow-hidden">
    <div className="container-custom">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
        className="mb-16"
      >
        <motion.p variants={reveal} className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500 mb-4 line-decoration">
          Explore India
        </motion.p>
        <div className="flex items-end justify-between">
          <motion.h2 variants={reveal} className="text-4xl md:text-5xl font-heading font-bold text-heading">
            Browse by<br /><span className="italic font-normal">Category</span>
          </motion.h2>
          <motion.p variants={reveal} className="text-gray-400 max-w-sm text-right hidden md:block">
            From sacred pilgrimages to adventure getaways, find the perfect journey for your soul.
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="grid grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {categories.map((cat, i) => (
          <motion.div key={cat.name} variants={reveal}>
            <Link
              to="/destinations"
              className="group relative block h-[320px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_40px_rgba(255,107,53,0.25)] ring-1 ring-white/10 hover:ring-primary-400/40"
            >
              {/* Real image with gradient overlay */}
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.currentTarget.src = ''; e.currentTarget.style.background = `linear-gradient(135deg, var(--tw-gradient-stops))`; }}
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.fallback} opacity-60 group-hover:opacity-40 transition-opacity duration-500`} />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />

              {/* Bottom gradient for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6 text-white z-10">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/25 group-hover:border-white/40 transition-all duration-500">
                  <cat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wider mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">{cat.count}</p>
                  <h3 className="font-heading text-2xl font-bold mb-1 text-white [text-shadow:0_0_15px_rgba(255,255,255,0.5),0_0_30px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.5)] group-hover:[text-shadow:0_0_20px_rgba(255,255,255,0.7),0_0_40px_rgba(255,107,53,0.3),0_0_60px_rgba(255,107,53,0.15),0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-500">{cat.name}</h3>
                  <p className="text-white/80 text-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">{cat.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    Explore <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ========================================
   FEATURED PACKAGES (Hover-reveal cards)
   ======================================== */
const fallbackPackages = [
  { id: 1, title: 'Complete Chardham Yatra', duration: '12 Days', price: '45,999', rating: 4.9, location: 'Uttarakhand', img: 'https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=600&h=800&fit=crop', desc: 'Sacred pilgrimage covering Badrinath, Kedarnath, Gangotri & Yamunotri' },
  { id: 2, title: 'Manali & Shimla Escape', duration: '7 Days', price: '22,499', rating: 4.8, location: 'Himachal Pradesh', img: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&h=800&fit=crop', desc: 'Snow-capped peaks, pine forests & colonial charm in the hills' },
  { id: 3, title: 'Kerala Backwater Bliss', duration: '5 Days', price: '18,999', rating: 4.7, location: 'Kerala', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=800&fit=crop', desc: 'Cruise tranquil backwaters on a traditional houseboat through coconut groves' },
  { id: 4, title: 'Golden Triangle Tour', duration: '6 Days', price: '15,999', rating: 4.6, location: 'Delhi-Agra-Jaipur', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=800&fit=crop', desc: 'Iconic Taj Mahal, royal Jaipur palaces & the vibrant culture of Delhi' },
  { id: 5, title: 'Ladakh Adventure', duration: '8 Days', price: '35,499', rating: 4.9, location: 'Ladakh', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop', desc: 'High-altitude passes, Pangong Lake & ancient Buddhist monasteries' },
  { id: 6, title: 'Goa Beach Getaway', duration: '4 Days', price: '12,999', rating: 4.5, location: 'Goa', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=800&fit=crop', desc: 'Sun-kissed beaches, Portuguese heritage & legendary seafood cuisine' },
];

const FeaturedPackages = () => {
  const [packages, setPackages] = useState(fallbackPackages);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await packageService.getFeatured();
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        if (list.length > 0) {
          setPackages(list.map((pkg) => ({
            id: pkg._id || pkg.id,
            title: pkg.title,
            duration: pkg.duration,
            price: typeof pkg.basePrice === 'number' ? pkg.basePrice.toLocaleString('en-IN') : (pkg.basePrice || pkg.price),
            rating: pkg.rating || 4.5,
            location: pkg.location,
            img: pkg.images?.[0] || pkg.image || '',
            desc: pkg.description || pkg.desc || '',
          })));
        }
      } catch {
        // Use fallback data
      }
    };
    fetchFeatured();
  }, []);

  return (
  <section className="py-24 bg-surface-dim grain">
    <div className="container-custom relative z-10">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
        className="text-center mb-16"
      >
        <motion.p variants={reveal} className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500 mb-4">
          Popular Choices
        </motion.p>
        <motion.h2 variants={reveal} className="text-4xl md:text-5xl font-heading font-bold text-heading">
          Featured <span className="italic font-normal">Tour Packages</span>
        </motion.h2>
        <motion.div variants={reveal} className="w-[60px] h-[3px] bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto mt-5" />
      </motion.div>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {packages.map((pkg) => (
          <motion.div key={pkg.id} variants={scaleIn}>
            <Link
              to={`/packages/${pkg.id}`}
              className="group relative block h-[380px] rounded-2xl overflow-hidden"
            >
              {/* Real image */}
              <img
                src={pkg.img}
                alt={pkg.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.currentTarget.src = ''; e.currentTarget.style.background = 'linear-gradient(135deg, #2B3A52, #FF6B35)'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#2B3A52]/40 to-transparent" />

              {/* Rating badge */}
              <div className="absolute top-5 right-5 z-20 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10">
                <Star className="w-3 h-3 text-accent-400 fill-accent-400" />
                <span className="text-white text-xs font-medium">{pkg.rating}</span>
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="relative h-full flex flex-col justify-between p-7 text-white z-10">
                <div>
                  <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-3">
                    <MapPin className="w-3 h-3" />
                    {pkg.location}
                  </div>
                  <h3 className="font-heading text-2xl font-bold leading-tight group-hover:text-accent-200 transition-colors duration-300">
                    {pkg.title}
                  </h3>
                  <p className="text-white/50 text-xs mt-2 line-clamp-2 max-h-0 group-hover:max-h-10 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                    {pkg.desc}
                  </p>
                </div>

                {/* Bottom: reveal on hover */}
                <div>
                  <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-end justify-between opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500">
                    <div>
                      <span className="text-white/50 text-xs">Starting from</span>
                      <p className="text-2xl font-heading font-bold">₹{pkg.price}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-heading transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={reveal}
        className="text-center mt-14"
      >
        <Link
          to="/packages"
          className="group inline-flex items-center gap-3 text-heading font-medium hover:text-primary-600 transition-colors"
        >
          <span className="border-b-2 border-[#2B3A52] group-hover:border-primary-500 pb-1 transition-colors">
            View All Packages
          </span>
          <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
        </Link>
      </motion.div>
    </div>
  </section>
);
};

/* ========================================
   CHARDHAM BANNER (Immersive CTA)
   ======================================== */
const ChardhamBanner = () => (
  <section className="py-24 bg-white">
    <div className="container-custom">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={scaleIn}
        className="relative rounded-[2rem] overflow-hidden"
      >
        {/* Background — Chardham imagery */}
        <img
          src="https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=1400&h=700&fit=crop"
          alt="Sacred Chardham Yatra pilgrimage in the Himalayas"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          onError={(e) => { e.currentTarget.src = ''; e.currentTarget.style.background = '#2B3A52'; }}
        />
        <div className="absolute inset-0 bg-[#2B3A52]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-transparent to-accent-500/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 rounded-full blur-[80px]" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center p-10 md:p-16 lg:p-20">
          <div>
            <motion.div variants={reveal} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium uppercase tracking-wider mb-6">
              <Mountain className="w-3.5 h-3.5" />
              Sacred Journey 2026
            </motion.div>
            <motion.h2 variants={reveal} className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
              Chardham<br />
              <span className="italic font-normal text-gradient-warm">Yatra</span>
            </motion.h2>
            <motion.p variants={reveal} className="text-white/50 text-lg leading-relaxed mb-10 max-w-md">
              Embark on the most sacred pilgrimage covering all four divine dhams.
              Early bird discounts and premium accommodations available.
            </motion.p>
            <motion.div variants={reveal}>
              <Link
                to="/packages"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-heading font-semibold rounded-full hover:shadow-2xl hover:shadow-white/20 transition-all duration-300"
              >
                Book Your Yatra
                <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>

          <motion.div variants={reveal} className="grid grid-cols-2 gap-4">
            {[
              { name: 'Badrinath', sub: 'Lord Vishnu', gradient: 'from-primary-500/30 to-primary-600/10' },
              { name: 'Kedarnath', sub: 'Lord Shiva', gradient: 'from-secondary-500/30 to-secondary-600/10' },
              { name: 'Gangotri', sub: 'Goddess Ganga', gradient: 'from-blue-500/30 to-blue-600/10' },
              { name: 'Yamunotri', sub: 'Goddess Yamuna', gradient: 'from-accent-500/30 to-accent-600/10' },
            ].map((dham) => (
              <motion.div
                key={dham.name}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br ${dham.gradient} backdrop-blur-sm rounded-2xl p-6 border border-white/10 cursor-pointer`}
              >
                <Landmark className="w-7 h-7 text-white/60 mb-3" />
                <p className="text-white font-heading font-bold text-lg">{dham.name}</p>
                <p className="text-white/40 text-xs mt-1">{dham.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ========================================
   WHY CHOOSE US
   ======================================== */
const features = [
  { icon: ShieldCheck, title: 'Trusted & Safe', desc: 'Government-approved operator with 15+ years of experience across India.' },
  { icon: IndianRupee, title: 'Best Prices', desc: 'Competitive pricing with zero hidden costs. Value for every rupee spent.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock assistance before, during, and after your entire trip.' },
  { icon: Compass, title: 'Custom Tours', desc: 'Tailor-made itineraries crafted to your preferences and budget.' },
];

const WhyChooseUs = () => (
  <section className="py-24 bg-surface-dim grain">
    <div className="container-custom relative z-10">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
        className="mb-16"
      >
        <motion.p variants={reveal} className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500 mb-4 line-decoration">
          Why WanderNest
        </motion.p>
        <motion.h2 variants={reveal} className="text-4xl md:text-5xl font-heading font-bold text-heading">
          Why travelers<br /><span className="italic font-normal">choose us</span>
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feat, i) => (
          <motion.div
            key={feat.title}
            variants={reveal}
            whileHover={{ y: -8 }}
            className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-500"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center mb-6 group-hover:from-primary-100 group-hover:to-accent-100 transition-all duration-500">
              <feat.icon className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="font-heading font-bold text-lg text-heading mb-3">{feat.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ========================================
   TESTIMONIALS (Auto-scrolling marquee)
   ======================================== */
const testimonials = [
  { name: 'Priya Sharma', city: 'Delhi', text: 'The Chardham Yatra was absolutely life-changing. WanderNest handled everything with such care and precision. Every temple visit felt deeply spiritual.', rating: 5 },
  { name: 'Rajesh Kumar', city: 'Mumbai', text: 'Amazing Manali trip with the entire family. Great hotels, smooth transfers, and the kids loved every moment. Highly recommend WanderNest!', rating: 5 },
  { name: 'Anita Gupta', city: 'Bangalore', text: 'Kerala backwaters package was pure bliss. The houseboat experience was magical. Every detail was well taken care of by the team.', rating: 5 },
  { name: 'Vikram Singh', city: 'Jaipur', text: 'The Ladakh adventure was the trip of a lifetime. From Pangong Lake to Khardung La pass, every moment was breathtaking.', rating: 5 },
  { name: 'Meera Patel', city: 'Ahmedabad', text: 'Golden Triangle tour was perfectly organized. The Taj Mahal at sunrise was unforgettable. Great value for money.', rating: 4 },
  { name: 'Suresh Reddy', city: 'Hyderabad', text: 'Goa getaway was exactly what we needed. Beach parties, water sports, and amazing seafood. Will book again!', rating: 5 },
  { name: 'Kavita Joshi', city: 'Pune', text: 'Rishikesh yoga retreat was transformative. The combination of spirituality and adventure was perfect for our group.', rating: 5 },
  { name: 'Arun Nair', city: 'Chennai', text: 'Darjeeling toy train ride and the view of Kanchenjunga was surreal. WanderNest planned everything flawlessly.', rating: 4 },
  { name: 'Deepa Menon', city: 'Kochi', text: 'The Vaishno Devi pilgrimage was well organized. Helicopter booking, accommodation, everything was seamless.', rating: 5 },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialColumn = ({ items, speed }) => (
  <div className="flex flex-col overflow-hidden max-h-[700px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
    <div className={`flex flex-col gap-5 ${speed}`}>
      {[...items, ...items].map((t, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.04, y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm shrink-0 relative overflow-hidden cursor-pointer"
        >
          {/* Gradient accent line on hover */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 hover:opacity-100 transition-opacity duration-500" />
          <Quote className="w-8 h-8 text-primary-200 mb-4" />
          <p className="text-gray-600 leading-relaxed mb-6 text-sm">{t.text}</p>
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-sm"
            >
              {t.name.charAt(0)}
            </motion.div>
            <div>
              <p className="font-semibold text-heading text-sm">{t.name}</p>
              <p className="text-xs text-gray-400">{t.city}</p>
            </div>
            <div className="ml-auto flex gap-0.5">
              {Array.from({ length: t.rating }).map((_, j) => (
                <motion.div
                  key={j}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: j * 0.08, type: 'spring', stiffness: 300 }}
                >
                  <Star className="w-3 h-3 text-accent-400 fill-accent-400" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const Testimonials = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="container-custom">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
        className="text-center mb-16"
      >
        <motion.p variants={reveal} className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500 mb-4">
          Testimonials
        </motion.p>
        <motion.h2 variants={reveal} className="text-4xl md:text-5xl font-heading font-bold text-heading">
          Voices of our <span className="italic font-normal">travelers</span>
        </motion.h2>
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.8 }}
      className="flex justify-center gap-5 px-5 max-w-6xl mx-auto"
    >
      <TestimonialColumn items={firstColumn} speed="animate-marquee" />
      <TestimonialColumn items={secondColumn} speed="animate-marquee-reverse hidden md:flex" />
      <TestimonialColumn items={thirdColumn} speed="animate-marquee-slow hidden lg:flex" />
    </motion.div>
  </section>
);

/* ========================================
   NEWSLETTER
   ======================================== */
const Newsletter = () => (
  <section className="py-20 bg-surface-dim">
    <div className="container-custom">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={scaleIn}
        className="bg-gradient-to-r from-[#2B3A52] to-[#354862] rounded-3xl p-10 md:p-16 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-accent-500/10 rounded-full blur-[60px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
              Get exclusive travel deals
            </h3>
            <p className="text-white/40 text-sm">Subscribe for early bird discounts on Chardham Yatra and more.</p>
          </div>
          <form className="flex w-full md:w-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3.5 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-primary-400 transition-colors flex-1 md:w-72"
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center gap-2"
            >
              Subscribe <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ========================================
   HOME PAGE
   ======================================== */
const Home = () => (
  <>
    <Hero />
    <CategorySection />
    <FeaturedPackages />
    <ChardhamBanner />
    <WhyChooseUs />
    <Testimonials />
    <Newsletter />
  </>
);

export default Home;
