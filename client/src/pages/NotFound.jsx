import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, ArrowUpRight, MapPin, Plane, Mountain } from 'lucide-react';

const floatingIcons = [
  { Icon: MapPin, x: -180, y: -120, delay: 0.2, dur: 6 },
  { Icon: Plane, x: 200, y: -80, delay: 0.5, dur: 7 },
  { Icon: Mountain, x: -140, y: 130, delay: 0.8, dur: 5.5 },
  { Icon: Compass, x: 170, y: 150, delay: 1.1, dur: 8 },
];

const NotFound = () => (
  <div className="pt-24 pb-24 bg-surface-dim grain relative overflow-hidden min-h-screen flex items-center justify-center">
    {/* Animated background orbs */}
    <motion.div
      animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-1/3 left-[15%] w-[500px] h-[500px] rounded-full bg-primary-100/20 blur-[120px] pointer-events-none"
    />
    <motion.div
      animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute bottom-1/4 right-[15%] w-[400px] h-[400px] rounded-full bg-accent-100/15 blur-[100px] pointer-events-none"
    />

    {/* Floating scattered icons */}
    {floatingIcons.map(({ Icon, x, y, delay, dur }, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ delay, duration: 0.8 }}
        className="absolute pointer-events-none"
        style={{ left: '50%', top: '50%' }}
      >
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}
        >
          <Icon className="w-10 h-10 text-primary-400" style={{ transform: `translate(${x}px, ${y}px)` }} />
        </motion.div>
      </motion.div>
    ))}

    <div className="container-custom text-center max-w-lg relative z-10">
      {/* Animated Compass with orbit */}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        className="relative inline-block mb-10"
      >
        {/* Outer pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-[-20px] rounded-[2.5rem] border border-primary-200/40"
        />

        <motion.div
          whileHover={{ rotate: [0, -15, 15, 0], scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-2xl shadow-primary-500/20 rotate-12 cursor-pointer"
        >
          <Compass className="w-16 h-16 text-white -rotate-12" />
        </motion.div>

        {/* Floating orbit ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-12px] rounded-[2rem] border border-dashed border-primary-200/50"
        />

        {/* Orbiting dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-12px]"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg shadow-primary-500/30" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated 404 number */}
        <motion.h1
          initial={{ letterSpacing: '0.3em', opacity: 0 }}
          animate={{ letterSpacing: '0em', opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-8xl font-heading font-bold text-gradient-warm mb-3"
        >
          404
        </motion.h1>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-heading mb-4">
          Lost Your <span className="italic font-normal">Way?</span>
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-gray-400 mb-10 max-w-sm mx-auto"
        >
          Looks like this destination doesn't exist on our map. Let's get you back on track to explore the world's most beautiful places!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              Go Home
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:border-primary-200 hover:text-primary-600 transition-all"
            >
              <Compass className="w-5 h-5" />
              Browse Packages
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  </div>
);

export default NotFound;
