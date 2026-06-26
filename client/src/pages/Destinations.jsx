import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowUpRight, Mountain, TreePine, Landmark, Waves, Compass, Flame } from 'lucide-react';
import { destinationService } from '../services/destinationService';

/* ---- Animation Variants ---- */
const reveal = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/* ---- Data ---- */
const categoryTabs = [
  { label: 'All', icon: Compass },
  { label: 'Chardham', icon: Flame },
  { label: 'Hill Stations', icon: TreePine },
  { label: 'Spiritual', icon: Landmark },
  { label: 'Heritage', icon: Landmark },
  { label: 'Adventure', icon: Mountain },
  { label: 'Beaches', icon: Waves },
];

const iconMap = {
  'Chardham': Landmark, 'Hill Stations': TreePine, 'Spiritual': Flame,
  'Heritage': Landmark, 'Adventure': Mountain, 'Beaches': Waves,
};

const gradients = [
  'from-[#2B3A52] via-orange-900 to-orange-600',
  'from-[#2B3A52] via-amber-900 to-amber-600',
  'from-[#2B3A52] via-emerald-900 to-emerald-600',
  'from-[#2B3A52] via-green-900 to-green-600',
  'from-[#2B3A52] via-yellow-900 to-yellow-600',
  'from-[#2B3A52] via-rose-900 to-rose-600',
  'from-[#2B3A52] via-teal-900 to-teal-600',
  'from-[#2B3A52] via-cyan-900 to-cyan-600',
  'from-[#2B3A52] via-lime-900 to-lime-600',
];

const sampleDestinations = [
  { _id: '1', name: 'Badrinath', category: 'Chardham', location: 'Uttarakhand', rating: 4.9, priceFrom: 15999, description: 'Sacred abode of Lord Vishnu nestled between Nar and Narayan mountains', gradient: gradients[0], icon: Landmark, images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=800&fit=crop'] },
  { _id: '2', name: 'Kedarnath', category: 'Chardham', location: 'Uttarakhand', rating: 4.9, priceFrom: 14999, description: 'Ancient Shiva temple perched at 3,583m amid snow-clad Himalayan peaks', gradient: gradients[1], icon: Mountain, images: ['https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&h=800&fit=crop'] },
  { _id: '3', name: 'Manali', category: 'Hill Stations', location: 'Himachal Pradesh', rating: 4.8, priceFrom: 12499, description: 'Enchanting valley of gods with snow-capped peaks, pine forests and adventure sports', gradient: gradients[2], icon: TreePine, images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=800&fit=crop'] },
];

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationService.getAll();
        // Axios interceptor unwraps response.data, so res = { success, data: [...] }
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        if (list.length > 0) {
          setDestinations(list);
        } else {
          setDestinations(sampleDestinations);
        }
      } catch {
        setDestinations(sampleDestinations);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Get unique categories from fetched destinations
  const categories = useMemo(() => {
    const cats = [...new Set(destinations.map(d => d.category).filter(Boolean))];
    return ['All', ...cats];
  }, [destinations]);

  const filtered = active === 'All'
    ? destinations
    : destinations.filter((d) => d.category === active);

  return (
    <div className="pt-24 pb-24 bg-surface-dim relative overflow-hidden min-h-screen" ref={heroRef}>
      {/* Grain overlay */}
      <div className="absolute inset-0 grain pointer-events-none z-0" />

      {/* Background orbs with parallax */}
      <motion.div style={{ y: heroY }} className="pointer-events-none">
        <div className="absolute top-40 right-[10%] w-[500px] h-[500px] rounded-full bg-primary-100/20 blur-[120px]" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] rounded-full bg-accent-100/15 blur-[100px]" />
      </motion.div>

      <motion.div style={{ opacity: heroOpacity }} className="container-custom relative z-10">
        {/* Hero Section */}
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="pt-8 mb-16"
        >
          <motion.div variants={reveal} className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ width: [0, 48] }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-[2px] bg-primary-500"
            />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">
              Discover India
            </span>
          </motion.div>

          <motion.h1 variants={reveal} className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-heading leading-[0.95] mb-6">
            Explore our<br />
            <span className="italic font-normal text-gradient-warm">destinations</span>
          </motion.h1>

          <motion.p variants={reveal} className="text-gray-400 text-lg max-w-xl leading-relaxed font-light">
            From sacred pilgrimage sites to serene hill stations, discover incredible
            places across India curated for unforgettable journeys.
          </motion.p>

          {/* Result count */}
          <motion.p variants={reveal} className="text-sm text-gray-400 mt-4">
            Showing <span className="font-semibold text-heading">{filtered.length}</span> destinations
          </motion.p>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          initial="hidden" animate="visible" variants={reveal}
          className="mb-14"
        >
          <div className="flex flex-wrap gap-2.5">
            {categoryTabs.map((tab) => {
              const isActive = active === tab.label;
              return (
                <motion.button
                  key={tab.label}
                  onClick={() => setActive(tab.label)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white shadow-lg shadow-primary-500/20'
                      : 'bg-white/70 text-gray-500 hover:bg-white hover:text-gray-800 border border-gray-100'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="dest-active-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <tab.icon className="relative z-10 w-4 h-4" />
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Destination Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.95, y: -20 }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[420px] rounded-2xl bg-gray-200 animate-pulse" />
              ))
            ) : filtered.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400 text-lg">No destinations found for this category.</p>
              </div>
            ) : filtered.map((dest, i) => {
              const gradient = dest.gradient || gradients[i % gradients.length];
              const Icon = iconMap[dest.category] || Compass;
              const image = dest.images?.[0] || dest.image || '';
              const price = dest.priceFrom ? `₹${dest.priceFrom.toLocaleString('en-IN')}` : (dest.price || 'Contact for price');
              const desc = dest.description || dest.desc || '';

              return (
                <motion.div
                  key={dest._id || dest.id}
                  variants={scaleIn}
                  layout
                  custom={i}
                >
                  <Link
                    to={`/destinations/${dest.slug || dest._id || dest.id}`}
                    className="group relative block h-[420px] rounded-2xl overflow-hidden"
                  >
                    {/* Background gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    />

                    {/* Image overlay with hover reveal */}
                    {image && (
                      <motion.img
                        src={image}
                        alt={dest.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity group-hover:opacity-50 group-hover:mix-blend-normal"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}

                    {/* Rating badge */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="absolute top-5 right-5 z-20 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10"
                    >
                      <Star className="w-3 h-3 text-accent-400 fill-accent-400" />
                      <span className="text-white text-xs font-medium">{dest.rating || 4.5}</span>
                    </motion.div>

                    {/* Category pill */}
                    <div className="absolute top-5 left-5 z-20 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
                      <span className="text-white/80 text-xs font-medium">{dest.category}</span>
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Icon watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-700">
                      <Icon className="w-40 h-40 text-white" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-7 text-white z-10">
                      <div>
                        <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-3">
                          <MapPin className="w-3 h-3" />
                          {dest.location}
                        </div>
                        <h3 className="font-heading text-2xl font-bold leading-tight group-hover:text-accent-200 transition-colors duration-300">
                          {dest.name}
                        </h3>
                        <p className="text-white/40 text-sm mt-2 leading-relaxed max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                          {desc}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-end justify-between">
                          <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            <span className="text-white/50 text-xs">Starting from</span>
                            <p className="text-2xl font-heading font-bold">{price}</p>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 45 }}
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-heading transition-all duration-300"
                          >
                            <ArrowUpRight className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Compass className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              </motion.div>
              <p className="text-gray-400 text-lg">No destinations found in this category.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Destinations;
