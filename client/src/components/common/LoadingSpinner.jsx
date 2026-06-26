import { motion } from 'framer-motion';
import { Compass, Plane, MapPin, Mountain } from 'lucide-react';

const dots = [
  { Icon: Plane, delay: 0, x: -36 },
  { Icon: MapPin, delay: 0.15, x: 0 },
  { Icon: Mountain, delay: 0.3, x: 36 },
];

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] relative overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary-100/25 blur-[80px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-accent-100/20 blur-[60px] pointer-events-none"
      />

      {/* Orbiting ring behind compass */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute w-40 h-40 rounded-full border border-dashed border-primary-200/30 pointer-events-none"
        style={{ top: 'calc(50% - 80px - 40px)' }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-20 h-20 rounded-2xl bg-primary-300/30 top-0"
          style={{ marginTop: '0px' }}
        />

        {/* Spinning compass */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-xl shadow-primary-500/25"
          >
            <Compass className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>

        {/* Brand text with staggered reveal */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="font-heading text-xl font-bold text-heading">
            Wander<span className="text-gradient-warm">Nest</span>
          </p>
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-xs uppercase tracking-[0.25em] text-gray-400 mt-2"
          >
            Loading your journey...
          </motion.p>
        </motion.div>

        {/* Bouncing dot indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 mt-8"
        >
          {dots.map(({ Icon, delay, x }, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay }}
              className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center"
            >
              <Icon className="w-3.5 h-3.5 text-primary-400" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
