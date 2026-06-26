import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Baby, BedDouble, Utensils, Camera, MapPin,
  Mountain, Compass, Plus, Minus, Check, ArrowRight, IndianRupee
} from 'lucide-react';
import { priceCalcService } from '../services/priceCalcService';

/* ================================================
   FALLBACK DATA
   ================================================ */
const fallbackPackages = [
  { id: 1, name: 'Complete Chardham Yatra', base: 45999, duration: '12 Days' },
  { id: 2, name: 'Do Dham Yatra', base: 28999, duration: '7 Days' },
  { id: 3, name: 'Manali & Shimla Escape', base: 22499, duration: '7 Days' },
  { id: 4, name: 'Kerala Backwater Bliss', base: 18999, duration: '5 Days' },
  { id: 5, name: 'Golden Triangle Tour', base: 15999, duration: '6 Days' },
  { id: 6, name: 'Ladakh Adventure', base: 35499, duration: '8 Days' },
  { id: 7, name: 'Goa Beach Getaway', base: 12999, duration: '4 Days' },
  { id: 8, name: 'Rishikesh & Haridwar', base: 11499, duration: '4 Days' },
  { id: 9, name: 'Darjeeling & Gangtok', base: 19999, duration: '6 Days' },
];

const fallbackRoomTypes = [
  { id: 'standard', name: 'Standard Room', mult: 1, desc: 'Comfortable twin/double sharing' },
  { id: 'deluxe', name: 'Deluxe Room', mult: 1.3, desc: 'Premium room with valley views' },
  { id: 'suite', name: 'Luxury Suite', mult: 1.8, desc: 'Spacious suite with private balcony' },
  { id: 'camp', name: 'Premium Camp', mult: 0.85, desc: 'Luxury tent/camp accommodation' },
];

const fallbackAddons = [
  { id: 'meals', name: 'Premium Meal Plan', price: 3500, icon: Utensils, desc: 'All meals included (B/L/D + snacks)' },
  { id: 'excursion', name: 'Extra Excursions', price: 5000, icon: Compass, desc: 'Additional sightseeing spots beyond itinerary' },
  { id: 'photography', name: 'Photography Package', price: 7500, icon: Camera, desc: 'Professional photographer for 2 days' },
  { id: 'helicopter', name: 'Helicopter Transfer', price: 25000, icon: Mountain, desc: 'Helicopter ride for mountain segments' },
  { id: 'spa', name: 'Spa & Wellness', price: 4500, icon: BedDouble, desc: 'Ayurvedic spa sessions (2 sessions)' },
  { id: 'guide', name: 'Private Guide', price: 6000, icon: MapPin, desc: 'Dedicated English-speaking guide throughout' },
];

/* ================================================
   PRICE CALCULATOR
   ================================================ */
const PriceCalculator = () => {
  const [packages, setPackages] = useState(fallbackPackages);
  const [roomTypes, setRoomTypes] = useState(fallbackRoomTypes);
  const [addons, setAddons] = useState(fallbackAddons);
  const [selectedPkg, setSelectedPkg] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [room, setRoom] = useState('standard');
  const [selectedAddons, setSelectedAddons] = useState([]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await priceCalcService.getConfig();
        const config = res.data;
        if (config?.packages?.length) {
          setPackages(config.packages.map(p => ({
            id: p.packageId || p._id || p.id,
            name: p.title || p.name,
            base: p.basePrice || p.base,
            duration: p.duration,
          })));
        }
        if (config?.roomTypes?.length) {
          setRoomTypes(config.roomTypes.map(r => ({
            id: r.id,
            name: r.name,
            mult: r.multiplier || r.mult,
            desc: r.description || r.desc,
          })));
        }
        if (config?.addons?.length) {
          setAddons(config.addons.map(a => ({
            id: a.id,
            name: a.name,
            price: a.price,
            icon: BedDouble, // Default icon
            desc: a.description || a.desc,
          })));
        }
      } catch {
        // Use fallback data on error
      }
    };
    fetchConfig();
  }, []);

  const toggleAddon = (id) => {
    setSelectedAddons((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  };

  const total = useMemo(() => {
    const pkg = packages[selectedPkg];
    const roomMult = roomTypes.find((r) => r.id === room).mult;
    const basePerPerson = pkg.base * roomMult;
    const adultCost = basePerPerson * adults;
    const childCost = basePerPerson * 0.6 * children; // 60% for children
    const addonCost = selectedAddons.reduce((sum, id) => sum + (addons.find((a) => a.id === id)?.price || 0), 0) * (adults + children);
    return Math.round(adultCost + childCost + addonCost);
  }, [selectedPkg, adults, children, room, selectedAddons]);

  const perPerson = useMemo(() => {
    const pkg = packages[selectedPkg];
    const roomMult = roomTypes.find((r) => r.id === room).mult;
    return Math.round(pkg.base * roomMult);
  }, [selectedPkg, room]);

  return (
    <div className="pt-24 pb-24 relative overflow-hidden min-h-screen bg-surface-dim">
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-primary-100/30" />
      <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] rounded-full blur-[100px] bg-accent-100/20" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 mb-6">
            <IndianRupee className="w-3.5 h-3.5 text-primary-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Price Calculator</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 text-heading">
            Estimate your <span className="italic font-normal text-gradient-warm">trip cost</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm text-gray-400">
            Customize your package with traveler count, room preferences, and add-on services to get an instant price estimate.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — Configuration */}
          <div className="lg:col-span-2 space-y-6">

            {/* Package Selection */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl p-6 border bg-white border-gray-100">
              <h3 className="font-heading font-bold text-lg mb-4 text-heading">Select Package</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {packages.map((pkg, i) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPkg(i)}
                    className={`relative p-3 rounded-xl border text-left transition-all ${
                      selectedPkg === i
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selectedPkg === i && (
                      <motion.div layoutId="pkg-select" className="absolute inset-0 rounded-xl border-2 border-primary-500" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                    )}
                    <p className="text-sm font-semibold text-heading">{pkg.name}</p>
                    <p className="text-xs mt-0.5 text-gray-400">{pkg.duration} · ₹{pkg.base.toLocaleString()}/person</p>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Travelers */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="rounded-2xl p-6 border bg-white border-gray-100">
              <h3 className="font-heading font-bold text-lg mb-4 text-heading">Travelers</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[{ label: 'Adults', sub: '12+ years', val: adults, set: setAdults, min: 1, max: 20, icon: Users },
                  { label: 'Children', sub: '2-11 years (60% rate)', val: children, set: setChildren, min: 0, max: 10, icon: Baby }
                ].map(({ label, sub, val, set, min, max, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-50">
                        <Icon className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-heading">{label}</p>
                        <p className="text-xs text-gray-400">{sub}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => set(Math.max(min, val - 1))}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-gray-200 hover:bg-gray-300 text-gray-600">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <motion.span key={val} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-lg font-bold w-6 text-center text-heading">
                        {val}
                      </motion.span>
                      <button onClick={() => set(Math.min(max, val + 1))}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-gray-200 hover:bg-gray-300 text-gray-600">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Room Type */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl p-6 border bg-white border-gray-100">
              <h3 className="font-heading font-bold text-lg mb-4 text-heading">Room Preference</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {roomTypes.map((rt) => (
                  <button
                    key={rt.id}
                    onClick={() => setRoom(rt.id)}
                    className={`relative p-4 rounded-xl border text-left transition-all ${
                      room === rt.id
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-heading">{rt.name}</p>
                      {room === rt.id && <Check className="w-4 h-4 text-primary-500" />}
                    </div>
                    <p className="text-xs mt-1 text-gray-400">{rt.desc}</p>
                    <p className={`text-xs font-semibold mt-2 ${rt.mult > 1 ? 'text-amber-500' : rt.mult < 1 ? 'text-emerald-500' : 'text-primary-500'}`}>
                      {rt.mult === 1 ? 'Base rate' : rt.mult > 1 ? `+${Math.round((rt.mult - 1) * 100)}%` : `${Math.round((1 - rt.mult) * 100)}% off`}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Add-ons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="rounded-2xl p-6 border bg-white border-gray-100">
              <h3 className="font-heading font-bold text-lg mb-4 text-heading">Add-on Services</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {addons.map((addon) => {
                  const active = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`relative p-4 rounded-xl border text-left transition-all ${
                        active
                          ? 'border-primary-400 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <addon.icon className={`w-5 h-5 ${active ? 'text-primary-500' : 'text-gray-400'}`} />
                        <p className="text-sm font-semibold text-heading">{addon.name}</p>
                      </div>
                      <p className="text-xs text-gray-400">{addon.desc}</p>
                      <p className="text-xs font-semibold text-primary-500 mt-2">+₹{addon.price.toLocaleString()}/person</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right — Price Summary */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl p-6 border sticky top-28 bg-white border-gray-100">
              <h3 className="font-heading font-bold text-lg mb-6 text-heading">Price Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Package</span>
                  <span className="text-sm font-semibold text-heading">{packages[selectedPkg].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Travelers</span>
                  <span className="text-sm font-semibold text-heading">{adults} Adults{children > 0 ? `, ${children} Children` : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Room</span>
                  <span className="text-sm font-semibold text-heading">{roomTypes.find((r) => r.id === room).name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Per person</span>
                  <span className="text-sm font-semibold text-heading">₹{perPerson.toLocaleString()}</span>
                </div>
                {selectedAddons.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Add-ons ({selectedAddons.length})</span>
                    <span className="text-sm font-semibold text-primary-500">
                      +₹{selectedAddons.reduce((s, id) => s + (addons.find((a) => a.id === id)?.price || 0), 0).toLocaleString()}/person
                    </span>
                  </div>
                )}
                <div className="h-px bg-gray-200" />
              </div>

              {/* Total */}
              <div className="rounded-xl p-5 mb-6 bg-primary-50">
                <p className="text-xs uppercase tracking-wider mb-1 text-primary-600">Estimated Total</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={total}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-3xl font-heading font-bold text-heading"
                  >
                    ₹{total.toLocaleString()}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs mt-1 text-gray-400">Inclusive of all taxes</p>
              </div>

              <Link
                to={`/booking/${packages[selectedPkg].id}`}
                className="w-full py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-lg shadow-primary-500/20 hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
              >
                Book This Package <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-center text-xs mt-4 text-gray-400">
                * Final price may vary based on availability and season
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
