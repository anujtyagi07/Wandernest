import { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Wifi, Car, Utensils, Waves, Mountain, TreePine, Landmark, BedDouble, ArrowUpRight, Check, Loader2 } from 'lucide-react';
import { hotelService } from '../services/hotelService';

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

/* ========================================
   HOTEL DATA
   ======================================== */
const hotelData = {
  1: {
    name: 'The Serenity River Resort',
    location: 'Rishikesh',
    type: 'Resort',
    rating: 4.8,
    reviews: 320,
    price: 4999,
    image: 'https://images.unsplash.com/photo-1701358736212-6593deb47fc3?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-teal-900 to-teal-600',
    desc: 'Riverside luxury resort with Ganga views, spa & yoga decks',
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Free Parking' },
      { icon: Utensils, label: 'Restaurant' },
      { icon: Waves, label: 'River View' },
    ],
    features: [
      'Private Ganga access with boat rides',
      'Full-service Ayurvedic spa',
      'Yoga deck with morning sessions',
      'Rooftop restaurant with mountain views',
      'Infinity pool overlooking the river',
    ],
  },
  2: {
    name: 'Himalayan View Retreat',
    location: 'Manali',
    type: 'Resort',
    rating: 4.7,
    reviews: 280,
    price: 5499,
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-emerald-900 to-emerald-600',
    desc: 'Snow-view rooms with heated pools and mountain trails',
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Free Parking' },
      { icon: Utensils, label: 'Restaurant' },
      { icon: Mountain, label: 'Mountain View' },
    ],
    features: [
      'Heated infinity pool with snow views',
      'Ski-in/ski-out access',
      'Bonfire area with live music',
      'Multi-cuisine restaurant',
      'Guided trekking excursions',
    ],
  },
  3: {
    name: 'Casa de Goa Beach Resort',
    location: 'Goa',
    type: 'Resort',
    rating: 4.6,
    reviews: 450,
    price: 3999,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-cyan-900 to-cyan-600',
    desc: 'Beachfront property with infinity pool and beach shacks',
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Free Parking' },
      { icon: Utensils, label: 'Restaurant' },
      { icon: Waves, label: 'Beach Access' },
    ],
    features: [
      'Private beach access',
      'Infinity pool with ocean views',
      'Beach shack dining',
      'Water sports center',
      'Sunset cruise arrangements',
    ],
  },
  4: {
    name: 'Kerala Backwater Villa',
    location: 'Kerala',
    type: 'Villa',
    rating: 4.9,
    reviews: 190,
    price: 6499,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-teal-900 to-teal-600',
    desc: 'Private villa on the backwaters with houseboat access',
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Free Parking' },
      { icon: Utensils, label: 'Restaurant' },
      { icon: Waves, label: 'Backwater View' },
    ],
    features: [
      'Private houseboat for day cruises',
      'Traditional Kerala architecture',
      'Ayurvedic treatment center',
      'Organic spice garden',
      'Cultural performances',
    ],
  },
  5: {
    name: 'Heritage Haveli Jaipur',
    location: 'Jaipur',
    type: 'Heritage',
    rating: 4.8,
    reviews: 340,
    price: 5999,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-amber-900 to-amber-600',
    desc: 'Restored 18th-century haveli with rooftop fort views',
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Free Parking' },
      { icon: Utensils, label: 'Restaurant' },
      { icon: Landmark, label: 'Heritage Site' },
    ],
    features: [
      '18th-century restored architecture',
      'Rooftop restaurant with fort views',
      'Traditional Rajasthani cuisine',
      'Cultural shows and puppet performances',
      'Guided heritage walks',
    ],
  },
  6: {
    name: 'Darjeeling Tea Garden Stay',
    location: 'Darjeeling',
    type: 'Boutique',
    rating: 4.7,
    reviews: 210,
    price: 3499,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-lime-900 to-lime-600',
    desc: 'Colonial bungalow amidst tea gardens with Kanchenjunga views',
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Free Parking' },
      { icon: Utensils, label: 'Restaurant' },
      { icon: TreePine, label: 'Garden View' },
    ],
    features: [
      'Working tea garden tours',
      'Kanchenjunga sunrise views',
      'Colonial-era architecture',
      'Tea tasting sessions',
      'Library with mountain views',
    ],
  },
  7: {
    name: 'Ganga Heritage Hotel',
    location: 'Rishikesh',
    type: 'Heritage',
    rating: 4.5,
    reviews: 180,
    price: 3499,
    image: 'https://images.unsplash.com/photo-1701358736212-6593deb47fc3?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-purple-900 to-purple-600',
    desc: 'Boutique heritage hotel near Triveni Ghat with rooftop dining',
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Free Parking' },
      { icon: Utensils, label: 'Restaurant' },
    ],
    features: [
      'Walking distance to Triveni Ghat',
      'Rooftop restaurant with Ganga views',
      'Heritage architecture',
      'Yoga and meditation classes',
      'Temple tour arrangements',
    ],
  },
  8: {
    name: 'Solang Valley Lodge',
    location: 'Manali',
    type: 'Lodge',
    rating: 4.6,
    reviews: 240,
    price: 4299,
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-blue-900 to-blue-600',
    desc: 'Adventure lodge near Solang with ski-in access and bonfire area',
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Free Parking' },
      { icon: Utensils, label: 'Restaurant' },
      { icon: Mountain, label: 'Mountain View' },
    ],
    features: [
      'Ski-in/ski-out access',
      'Adventure sports equipment rental',
      'Bonfire area with BBQ',
      'Multi-cuisine restaurant',
      'Guided trekking and skiing',
    ],
  },
  9: {
    name: 'Anjuna Beach House',
    location: 'Goa',
    type: 'Boutique',
    rating: 4.4,
    reviews: 380,
    price: 2999,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-orange-900 to-orange-600',
    desc: 'Portuguese-style beach house near Anjuna Flea Market',
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Utensils, label: 'Restaurant' },
      { icon: Waves, label: 'Beach Access' },
    ],
    features: [
      'Portuguese colonial architecture',
      'Walking distance to Anjuna Beach',
      'Near Anjuna Flea Market',
      'Café with ocean views',
      'Bicycle rental',
    ],
  },
  10: {
    name: 'Munnar Tea Estate Bungalow',
    location: 'Kerala',
    type: 'Villa',
    rating: 4.8,
    reviews: 160,
    price: 5499,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-green-900 to-green-600',
    desc: 'Colonial-era bungalow on a working tea estate with guided tours',
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Free Parking' },
      { icon: Utensils, label: 'Restaurant' },
      { icon: TreePine, label: 'Garden View' },
    ],
    features: [
      'Working tea estate',
      'Guided tea plantation tours',
      'Colonial-era bungalow',
      'Tea factory visits',
      'Bird watching trails',
    ],
  },
  11: {
    name: 'Pink City Palace Hotel',
    location: 'Jaipur',
    type: 'Luxury',
    rating: 4.9,
    reviews: 420,
    price: 7999,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-pink-900 to-pink-600',
    desc: '5-star palace hotel with Jantar Mantar views and royal spa',
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Free Parking' },
      { icon: Utensils, label: 'Restaurant' },
      { icon: Landmark, label: 'Heritage Site' },
    ],
    features: [
      '5-star luxury amenities',
      'Royal spa treatments',
      'Multiple fine-dining restaurants',
      'Infinity pool with city views',
      'Heritage walks and tours',
    ],
  },
  12: {
    name: 'Tiger Hill Resort',
    location: 'Darjeeling',
    type: 'Resort',
    rating: 4.6,
    reviews: 175,
    price: 4499,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-indigo-900 to-indigo-600',
    desc: 'Sunrise-view rooms facing Kanchenjunga with heated floors',
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Free Parking' },
      { icon: Utensils, label: 'Restaurant' },
      { icon: Mountain, label: 'Mountain View' },
    ],
    features: [
      'Tiger Hill sunrise views',
      'Kanchenjunga panorama',
      'Heated floors in rooms',
      'Multi-cuisine restaurant',
      'Toy Train ride arrangements',
    ],
  },
};

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await hotelService.getById(id);
        // Axios interceptor unwraps response.data, so res = { success, data: hotelDoc }
        const data = res?.data || res;
        if (data && data.name) {
          // Map amenities from strings (DB) to {icon, label} objects for rendering
          const amenityIconMap = {
            'Wifi': Wifi, 'Parking': Car, 'Car': Car, 'Restaurant': Utensils,
            'Pool': Waves, 'Beach': Waves, 'Beach Access': Waves,
            'Mountain View': Mountain, 'Garden View': TreePine,
            'Heritage': Landmark, 'Heritage Site': Landmark,
            'River View': Waves, 'Backwater View': Waves,
          };
          const mappedAmenities = (data.amenities || []).map(a => {
            if (typeof a === 'string') {
              return { icon: amenityIconMap[a] || BedDouble, label: a };
            }
            return a; // already an object
          });
          setHotel({
            name: data.name,
            location: data.location,
            type: data.type || 'Hotel',
            description: data.description || '',
            pricePerNight: data.pricePerNight || 0,
            rating: data.rating || 4.5,
            reviewCount: data.reviewCount || data.reviews || 0,
            image: data.images?.[0]?.url || data.images?.[0] || data.image || '',
            gradient: data.gradient || 'from-[#2B3A52] via-teal-900 to-teal-600',
            amenities: mappedAmenities,
            features: data.features || [],
          });
        } else {
          setHotel(hotelData[id] || null);
        }
      } catch {
        setHotel(hotelData[id] || null);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-24 pb-24 min-h-screen flex items-center justify-center bg-surface-dim">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className={`pt-24 pb-24 min-h-screen flex items-center justify-center bg-surface-dim`}>
        <div className="text-center">
          <p className="text-6xl font-heading font-bold text-gradient-warm mb-4">404</p>
          <p className={`mb-6 text-gray-400`}>Hotel not found</p>
          <Link to="/hotels" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold">
            <ArrowLeft className="w-4 h-4" /> Browse Hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`pt-24 pb-24 relative overflow-hidden min-h-screen bg-surface-dim`}>
      <div className="absolute inset-0 grain pointer-events-none z-0" />
      <div className={`absolute top-40 right-[5%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none bg-primary-100/20`} />
      <div className={`absolute bottom-40 left-[5%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none bg-accent-100/15`} />

      <div className="container-custom relative z-10">
        {/* Back Link */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link to="/hotels" className={`inline-flex items-center gap-2 text-sm mb-8 transition-colors group text-gray-400 hover:text-primary-600`}>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className={`border-b pb-0.5 transition-colors border-gray-300 group-hover:border-primary-400`}>Back to Hotels</span>
          </Link>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Hero with Parallax */}
          <motion.div ref={heroRef} variants={scaleIn} className="relative h-[320px] md:h-[440px] rounded-3xl overflow-hidden mb-12">
            <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
              <div className={`absolute inset-0 bg-gradient-to-br ${hotel.gradient}`} />
              <img
                src={hotel.image}
                alt={hotel.name}
                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]">
              <BedDouble className="w-64 h-64 text-white" />
            </div>

            <div className="absolute bottom-8 left-8 right-8 z-10">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/70 text-xs font-medium uppercase tracking-wider mb-4">
                  <BedDouble className="w-3.5 h-3.5" />
                  {hotel.type}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-4">
                  {hotel.name}
                </h1>
                <div className="flex flex-wrap items-center gap-5 text-sm text-white/60">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {hotel.location}</span>
                  <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-accent-400 fill-accent-400" /> {hotel.rating} ({hotel.reviewCount || hotel.reviews || 0} reviews)</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Overview */}
              <motion.div variants={reveal}>
                <div className="flex items-center gap-3 mb-6">
                  <motion.div animate={{ width: [0, 48] }} transition={{ duration: 0.8, delay: 0.5 }} className="h-[2px] bg-primary-500" />
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Overview</span>
                </div>
                <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-6 text-heading`}>
                  About this <span className="italic font-normal text-gradient-warm">property</span>
                </h2>
                <p className={`leading-relaxed text-gray-500`}>{hotel.description || hotel.desc}</p>
              </motion.div>

              {/* Amenities */}
              <motion.div variants={reveal}>
                <h3 className={`text-xl font-heading font-bold mb-6 text-heading`}>Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {hotel.amenities.map((amenity, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -4, scale: 1.05 }}
                      className={`rounded-2xl p-5 border transition-all bg-white border-gray-100 hover:border-primary-200 hover:shadow-lg`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-primary-50`}>
                        <amenity.icon className="w-6 h-6 text-primary-500" />
                      </div>
                      <p className={`text-sm font-medium text-heading`}>{amenity.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div variants={reveal}>
                <h3 className={`text-xl font-heading font-bold mb-6 text-heading`}>Property Features</h3>
                <div className={`rounded-3xl p-8 border bg-white border-gray-100`}>
                  <ul className="space-y-4">
                    {hotel.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-secondary-50`}>
                          <Check className="w-3.5 h-3.5 text-secondary-500" />
                        </div>
                        <span className="text-gray-600">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Sidebar — Booking Card */}
            <motion.div variants={reveal} className="space-y-6">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-[#2B3A52] rounded-3xl p-8 sticky top-28 overflow-hidden relative"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary-500/10 blur-[60px]" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-accent-500/10 blur-[50px]" />

                <div className="relative z-10">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Per Night</p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                    className="text-4xl font-heading font-bold text-white mb-1"
                  >
                    ₹{(hotel.pricePerNight || hotel.price || 0).toLocaleString('en-IN')}
                  </motion.p>
                  <p className="text-sm text-white/30 mb-8">Twin sharing basis</p>

                  <div className="space-y-4 mb-8">
                    {[
                      { icon: Check, text: 'Free cancellation (48 hrs)' },
                      { icon: Check, text: 'Pay at hotel available' },
                      { icon: Check, text: 'Best price guarantee' },
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
                    to={`/booking/hotel-${id}`}
                    className="group flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300"
                  >
                    Book This Hotel
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

export default HotelDetail;
