import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, ArrowUpRight, Compass, Mountain, Users } from 'lucide-react';
import { packageService } from '../services/packageService';

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

const fallbackPackages = [
  { id: 1, title: 'Complete Chardham Yatra', duration: '12 Days', basePrice: 45999, rating: 4.9, location: 'Uttarakhand', group: 20, description: 'Sacred pilgrimage covering all four divine dhams', gradient: 'from-[#2B3A52] via-primary-900 to-primary-700', icon: Mountain, images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=800&fit=crop'] },
  { id: 2, title: 'Do Dham Yatra', duration: '7 Days', basePrice: 28999, rating: 4.8, location: 'Uttarakhand', group: 15, description: 'Badrinath & Kedarnath — two of the most sacred Hindu shrines', gradient: 'from-[#2B3A52] via-orange-900 to-orange-600', icon: Mountain, images: ['https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&h=800&fit=crop'] },
  { id: 3, title: 'Manali & Shimla Escape', duration: '7 Days', basePrice: 22499, rating: 4.8, location: 'Himachal Pradesh', group: 25, description: 'Twin hill station getaway with snow activities', gradient: 'from-[#2B3A52] via-emerald-900 to-emerald-600', icon: Compass, images: ['https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&h=800&fit=crop'] },
];

const gradients = [
  'from-[#2B3A52] via-primary-900 to-primary-700',
  'from-[#2B3A52] via-orange-900 to-orange-600',
  'from-[#2B3A52] via-emerald-900 to-emerald-600',
  'from-[#2B3A52] via-teal-900 to-teal-600',
  'from-[#2B3A52] via-amber-900 to-amber-600',
  'from-[#2B3A52] via-blue-900 to-blue-600',
  'from-[#2B3A52] via-cyan-900 to-cyan-600',
  'from-[#2B3A52] via-purple-900 to-purple-600',
  'from-[#2B3A52] via-lime-900 to-lime-600',
];

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await packageService.getAll();
        // Axios interceptor unwraps response.data, so res = { success, data: [...], pagination }
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        if (list.length > 0) {
          setPackages(list);
        } else {
          setPackages(fallbackPackages);
        }
      } catch {
        setPackages(fallbackPackages);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="pt-24 pb-24 bg-surface-dim relative overflow-hidden min-h-screen" ref={heroRef}>
      <div className="absolute inset-0 grain pointer-events-none z-0" />

      <motion.div style={{ y: heroY }} className="pointer-events-none">
        <div className="absolute top-40 left-[10%] w-[500px] h-[500px] rounded-full bg-accent-100/15 blur-[120px]" />
        <div className="absolute bottom-20 right-[5%] w-[400px] h-[400px] rounded-full bg-primary-100/20 blur-[100px]" />
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
              Handcrafted Journeys
            </span>
          </motion.div>

          <motion.h1 variants={reveal} className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-heading leading-[0.95] mb-6">
            Tour <span className="italic font-normal text-gradient-warm">packages</span>
          </motion.h1>

          <motion.p variants={reveal} className="text-gray-400 text-lg max-w-xl leading-relaxed font-light">
            Carefully curated tour packages for every kind of traveler — from sacred pilgrimages
            to adventure getaways across India.
          </motion.p>
        </motion.div>

        {/* Package Grid */}
        <motion.div
          initial="hidden" animate="visible"
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[440px] rounded-2xl bg-gray-200 animate-pulse" />
            ))
          ) : packages.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 text-lg">No packages available at the moment.</p>
            </div>
          ) : (
            packages.map((pkg, i) => {
              const gradient = pkg.gradient || gradients[i % gradients.length];
              const Icon = pkg.category === 'pilgrimage' ? Mountain : Compass;
              const image = pkg.images?.[0] || pkg.image || '';
              const price = typeof pkg.basePrice === 'number' ? pkg.basePrice.toLocaleString('en-IN') : pkg.basePrice || pkg.price;
              const group = typeof pkg.group === 'number' ? `Max ${pkg.group}` : pkg.group || 'Max 20';
              const desc = pkg.description || pkg.desc || '';

              return (
                <motion.div key={pkg._id || pkg.id} variants={scaleIn} custom={i}>
                  <Link
                    to={`/packages/${pkg._id || pkg.id}`}
                    className="group relative block h-[440px] rounded-2xl overflow-hidden"
                  >
                    {/* Background */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    />

                    {/* Image overlay */}
                    {image && (
                      <motion.img
                        src={image}
                        alt={pkg.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity group-hover:opacity-45 group-hover:mix-blend-normal"
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
                      <span className="text-white text-xs font-medium">{pkg.rating || 4.5}</span>
                    </motion.div>

                    {/* Icon watermark */}
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] group-hover:opacity-[0.09] transition-opacity duration-700">
                      <Icon className="w-48 h-48 text-white" />
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-7 text-white z-10">
                      <div>
                        <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-3">
                          <MapPin className="w-3 h-3" />
                          {pkg.location}
                        </div>
                        <h3 className="font-heading text-xl font-bold leading-tight group-hover:text-accent-200 transition-colors duration-300">
                          {pkg.title}
                        </h3>
                        <p className="text-white/40 text-sm mt-2 leading-relaxed max-h-0 group-hover:max-h-16 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                          {desc}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-4 text-white/50 text-sm mb-4">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {pkg.duration}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {group}
                          </span>
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            <span className="text-white/50 text-xs">Starting from</span>
                            <p className="text-2xl font-heading font-bold">₹{price}</p>
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
            })
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Packages;
