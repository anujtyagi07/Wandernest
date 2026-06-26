import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  MapPin, Star, Wifi, Car, Utensils, Waves, ArrowUpRight,
  Mountain, TreePine, Landmark, BedDouble, Filter
} from 'lucide-react';
import { hotelService } from '../services/hotelService';

/* ================================================
   DATA (fallback)
   ================================================ */
const fallbackHotels = [
  { _id: '1', name: 'The Serenity River Resort', location: 'Rishikesh', slug: 'rishikesh', pricePerNight: 4999, rating: 4.8, reviewCount: 320, images: [{ url: 'https://images.unsplash.com/photo-1701358736212-6593deb47fc3?w=600&h=800&fit=crop' }], amenities: ['Wifi', 'Parking', 'Restaurant', 'Pool'], description: 'Riverside luxury resort with Ganga views, spa & yoga decks', type: 'Resort' },
  { _id: '2', name: 'Himalayan View Retreat', location: 'Manali', slug: 'manali', pricePerNight: 5499, rating: 4.7, reviewCount: 280, images: [{ url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&h=800&fit=crop' }], amenities: ['Wifi', 'Parking', 'Restaurant', 'Mountain View'], description: 'Snow-view rooms with heated pools and mountain trails', type: 'Resort' },
  { _id: '3', name: 'Casa de Goa Beach Resort', location: 'Goa', slug: 'goa', pricePerNight: 3999, rating: 4.6, reviewCount: 450, images: [{ url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=800&fit=crop' }], amenities: ['Wifi', 'Parking', 'Restaurant', 'Beach'], description: 'Beachfront property with infinity pool and beach shacks', type: 'Resort' },
];

const locations = ['All', 'Rishikesh', 'Manali', 'Goa', 'Kerala', 'Jaipur', 'Darjeeling'];

const reveal = { hidden: { opacity: 0, y: 40 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] } }) };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

/* ================================================
   AMENITY ICON MAP
   ================================================ */
const amenityIconMap = {
  'Wifi': Wifi, 'Parking': Car, 'Car': Car, 'Restaurant': Utensils, 'Pool': Waves,
  'Beach': Waves, 'Mountain View': Mountain, 'Garden': TreePine, 'Heritage': Landmark,
  'default': BedDouble,
};
const getAmenityIcon = (amenity) => amenityIconMap[amenity] || amenityIconMap['default'];

/* ================================================
   HOTELS PAGE
   ================================================ */
const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('location') || 'All';
  const [activeLocation, setActiveLocation] = useState(preselected);
  const [sortBy, setSortBy] = useState('rating');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await hotelService.getAll();
        // Axios interceptor unwraps response.data, so res = { success, data: [...], pagination }
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        if (list.length > 0) {
          setHotels(list);
        } else {
          setHotels(fallbackHotels);
        }
      } catch {
        setHotels(fallbackHotels);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // Extract unique locations from hotels
  const locations = useMemo(() => {
    const locs = [...new Set(hotels.map(h => h.location || h.slug))];
    return ['All', ...locs.filter(Boolean)];
  }, [hotels]);

  const filtered = useMemo(() => {
    let result = activeLocation === 'All' ? hotels : hotels.filter((h) => (h.location || h.slug) === activeLocation);
    if (sortBy === 'price-low') result = [...result].sort((a, b) => (a.pricePerNight || a.price) - (b.pricePerNight || b.price));
    if (sortBy === 'price-high') result = [...result].sort((a, b) => (b.pricePerNight || b.price) - (a.pricePerNight || a.price));
    if (sortBy === 'rating') result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return result;
  }, [activeLocation, sortBy, hotels]);

  return (
    <div className={`pt-24 pb-24 relative overflow-hidden min-h-screen bg-surface-dim`} ref={heroRef}>
      <div className="absolute inset-0 grain pointer-events-none z-0" />
      <motion.div style={{ y: heroY }} className="pointer-events-none absolute inset-0">
        <div className={`absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-primary-100/30`} />
        <div className={`absolute bottom-40 left-[5%] w-[400px] h-[400px] rounded-full blur-[100px] bg-accent-100/20`} />
      </motion.div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
          <motion.div variants={reveal} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 mb-6">
            <BedDouble className="w-3.5 h-3.5 text-primary-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Handpicked Stays</span>
          </motion.div>
          <motion.h1 variants={reveal} className={`text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[0.95] mb-6 text-heading`}>
            Hotels &<br /><span className="italic font-normal text-gradient-warm">Resorts</span>
          </motion.h1>
          <motion.p variants={reveal} className={`max-w-xl mx-auto text-sm text-gray-400`}>
            Handpicked luxury stays across India's most beautiful destinations — from riverside retreats to heritage havelis.
          </motion.p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setActiveLocation(loc)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  activeLocation === loc
                    ? 'gradient-primary text-white shadow-md shadow-primary-500/20'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Filter className={`w-4 h-4 text-gray-400`} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`text-xs rounded-lg px-3 py-2 border bg-white border-gray-200 text-gray-600`}
            >
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </motion.div>

        <p className={`text-sm mb-6 text-gray-400`}>
          Showing <span className={`font-semibold text-heading`}>{filtered.length}</span> hotels
        </p>

        {/* Hotel Grid */}
        <motion.div initial="hidden" animate="visible" variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-gray-200 animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 text-lg">No hotels found for the selected location.</p>
            </div>
          ) : filtered.map((hotel) => {
            const img = hotel.images?.[0]?.url || hotel.images?.[0] || hotel.img || '';
            const price = hotel.pricePerNight || hotel.price || 0;
            const reviews = hotel.reviewCount || hotel.reviews || 0;
            const desc = hotel.description || hotel.desc || '';
            const amenities = (hotel.amenities || []).slice(0, 4).map(a => typeof a === 'string' ? a : 'default');

            return (
              <motion.div key={hotel._id || hotel.id} variants={scaleIn}>
                <Link to={`/hotels/${hotel._id || hotel.id}`} className={`group block rounded-2xl overflow-hidden border transition-all hover:shadow-xl bg-white border-gray-100`}>
                  <div className="relative h-52 overflow-hidden">
                    <img src={img} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] font-semibold border border-white/10">
                      {hotel.type}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md flex items-center gap-1 border border-white/10">
                      <Star className="w-3 h-3 text-accent-400 fill-accent-400" />
                      <span className="text-white text-xs font-medium">{hotel.rating || 4.5}</span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white/60 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> {hotel.location}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className={`font-heading font-bold text-base mb-1 group-hover:text-primary-500 transition-colors text-heading`}>{hotel.name}</h3>
                    <p className={`text-xs mb-3 text-gray-400`}>{desc}</p>
                    <div className="flex items-center gap-2 mb-4">
                      {amenities.map((amenity, i) => {
                        const Icon = getAmenityIcon(amenity);
                        return (
                          <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100`}>
                            <Icon className={`w-3.5 h-3.5 text-gray-500`} />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-lg font-heading font-bold text-heading`}>₹{price.toLocaleString('en-IN')}</p>
                        <p className={`text-[10px] text-gray-400`}>per night (twin sharing)</p>
                      </div>
                      <motion.div whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:shadow-lg transition-shadow">
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Hotels;
