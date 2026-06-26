import { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Star, ArrowLeft, Calendar, Mountain, ArrowUpRight, Clock, Users, Compass, TreePine, Thermometer, Sunrise, Loader2 } from 'lucide-react';
import { destinationService } from '../services/destinationService';

/* ---- Animation Variants ---- */
const reveal = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const defaultQuickInfo = [
  { label: 'Best Time', value: 'Apr - Nov', icon: Calendar },
  { label: 'Altitude', value: '3,300m', icon: Mountain },
  { label: 'Climate', value: '5°C to 20°C', icon: Thermometer },
  { label: 'Group Size', value: 'Max 20', icon: Users },
];

const defaultPackages = [
  { id: 1, name: 'Standard Package', days: 4, price: '12,999', desc: 'Budget-friendly with comfortable stays and guided tours' },
  { id: 2, name: 'Premium Package', days: 5, price: '15,999', desc: 'Enhanced experience with premium hotels and private guides' },
  { id: 3, name: 'Luxury Package', days: 7, price: '22,999', desc: 'Ultimate luxury with helicopter transfers and 5-star resorts' },
];

const defaultHighlights = [
  'Ancient temple architecture dating back to 8th century',
  'Breathtaking panoramic views of snow-capped Himalayan peaks',
  'Sacred morning rituals and evening Aarti ceremonies',
  'Guided trekking through pristine alpine meadows',
  'Authentic local cuisine and cultural immersion experiences',
];

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const [highlights, setHighlights] = useState(defaultHighlights);
  const [quickInfo, setQuickInfo] = useState(defaultQuickInfo);
  const [packages, setPackages] = useState(defaultPackages);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await destinationService.getBySlug(id);
        const data = res?.data || res;
        if (data) {
          setDestination(data);
          // Use linked packages if available
          if (data.linkedPackages?.length > 0) {
            setPackages(data.linkedPackages.map((pkg, i) => ({
              id: pkg._id || i + 1,
              name: pkg.title || `Package ${i + 1}`,
              days: parseInt(pkg.duration) || 5,
              price: typeof pkg.basePrice === 'number' ? pkg.basePrice.toLocaleString('en-IN') : (pkg.basePrice || '15,999'),
              desc: pkg.description || '',
            })));
          }
        }
      } catch {
        // Will use default data
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id]);

  return (
    <div className="pt-24 pb-24 bg-surface-dim relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 grain pointer-events-none z-0" />
      <div className="absolute top-40 right-[5%] w-[500px] h-[500px] rounded-full bg-primary-100/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 left-[5%] w-[400px] h-[400px] rounded-full bg-accent-100/15 blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Back Link */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link to="/destinations" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary-600 mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="border-b border-gray-300 group-hover:border-primary-400 pb-0.5 transition-colors">Back to Destinations</span>
          </Link>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Hero with Parallax */}
          <motion.div ref={heroRef} variants={scaleIn} className="relative h-[320px] md:h-[440px] rounded-3xl overflow-hidden mb-12">
            <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2B3A52] via-primary-900 to-primary-600" />
              <img
                src={destination?.images?.[0] || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1400&h=600&fit=crop'}
                alt={destination?.name || 'Destination'}
                className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]">
              <Mountain className="w-64 h-64 text-white" />
            </div>

            <div className="absolute bottom-8 left-8 right-8 z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-end justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/70 text-xs font-medium uppercase tracking-wider mb-4">
                      <Compass className="w-3.5 h-3.5" />
                      {destination?.category || 'Chardham'}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
                      {destination?.name || `Destination #${id}`}
                    </h1>
                    <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-white/60">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> India</span>
                      <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-accent-400 fill-accent-400" /> {destination?.rating || 4.9} (200 reviews)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <motion.div variants={reveal}>
                <div className="flex items-center gap-3 mb-6">
                  <motion.div animate={{ width: [0, 48] }} transition={{ duration: 0.8, delay: 0.5 }} className="h-[2px] bg-primary-500" />
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">About</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-heading mb-6">
                  A sacred journey<br />
                  <span className="italic font-normal text-gradient-warm">through the Himalayas</span>
                </h2>
                <div className="space-y-4 text-gray-500 leading-relaxed">
                  <p>
                    {destination?.description || `Nestled among the snow-capped peaks of the Garhwal Himalayas, this destination is one of the most
                    revered pilgrimage sites in India. The ancient temple, perched at an altitude of 3,300 meters,
                    attracts millions of devotees every year seeking spiritual solace and divine blessings.`}
                  </p>
                  <p>
                    The journey to this sacred shrine is as transformative as the destination itself. Winding mountain roads,
                    pristine rivers, lush forests of rhododendron and deodar, and the ever-present sound of temple bells
                    create an atmosphere of serenity that stays with you long after the journey ends.
                  </p>
                  <p>
                    Whether you're a devout pilgrim or a curious traveler, the combination of natural beauty, ancient
                    architecture, and profound spirituality makes this one of India's most unforgettable experiences.
                  </p>
                </div>
              </motion.div>

              {/* Highlights */}
              <motion.div variants={reveal}>
                <h3 className="font-heading font-bold text-xl text-heading mb-6">Highlights</h3>
                <div className="space-y-3">
                  {highlights.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Sunrise className="w-4 h-4 text-primary-500" />
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Info Grid */}
              <motion.div variants={reveal}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickInfo.map((info, i) => (
                    <motion.div
                      key={info.label}
                      whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl p-5 border border-gray-100 text-center transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center mx-auto mb-3">
                        <info.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{info.label}</p>
                      <p className="font-heading font-bold text-heading">{info.value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Available Packages */}
              <motion.div variants={reveal}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-[2px] bg-primary-500" />
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Packages</span>
                </div>
                <h2 className="text-3xl font-heading font-bold text-heading mb-8">
                  Available <span className="italic font-normal">tour packages</span>
                </h2>
                <div className="space-y-4">
                  {packages.map((pkg, i) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                    >
                      <Link
                        to={`/packages/${pkg.id}`}
                        className="group flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center shrink-0 group-hover:from-primary-100 group-hover:to-accent-100 transition-all">
                            <span className="text-lg font-heading font-bold text-primary-600">0{i + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-heading font-semibold text-lg text-heading group-hover:text-primary-600 transition-colors">
                              {pkg.name}
                            </h3>
                            <p className="text-sm text-gray-400 mt-0.5">{pkg.desc}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                              <Calendar className="w-3.5 h-3.5" /> {pkg.days} Days
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-xs text-gray-400">from</span>
                            <p className="text-xl font-heading font-bold text-primary-600">₹{pkg.price}</p>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 45 }}
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-300"
                          >
                            <ArrowUpRight className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <motion.div variants={reveal} className="space-y-6">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-[#2B3A52] rounded-3xl p-8 sticky top-28 overflow-hidden relative"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary-500/10 blur-[60px]" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-accent-500/10 blur-[50px]" />

                <div className="relative z-10">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Starting from</p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                    className="text-4xl font-heading font-bold text-white mb-1"
                  >
                    ₹{destination?.priceFrom ? destination.priceFrom.toLocaleString('en-IN') : '15,999'}
                  </motion.p>
                  <p className="text-sm text-white/30 mb-8">per person (twin sharing)</p>

                  <div className="space-y-4 mb-8">
                    {[
                      { icon: Calendar, text: 'Flexible dates available' },
                      { icon: Users, text: 'Small groups (max 20)' },
                      { icon: TreePine, text: 'Expert local guides' },
                    ].map((item) => (
                      <motion.div
                        key={item.text}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 text-sm text-white/50"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-primary-400" />
                        </div>
                        {item.text}
                      </motion.div>
                    ))}
                  </div>

                  <Link
                    to="/packages"
                    className="group flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300"
                  >
                    View All Packages
                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                  </Link>

                  <p className="text-center text-xs text-white/20 mt-4">No payment required today</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationDetail;
