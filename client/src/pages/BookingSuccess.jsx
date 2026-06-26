import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Home, Package, ArrowUpRight, Mail, Sparkles } from 'lucide-react';

/* ---- Confetti Particles ---- */
const confettiColors = ['#FF6B35', '#F5A623', '#1A936F', '#33A682', '#FF8540', '#F7BF33'];
const ConfettiParticle = ({ delay, color, x, rotation }) => (
  <motion.div
    initial={{ opacity: 1, y: -20, x: 0, rotate: 0, scale: 0 }}
    animate={{
      opacity: [1, 1, 0],
      y: [0, 300, 600],
      x: x,
      rotate: rotation,
      scale: [0, 1, 0.5],
    }}
    transition={{ duration: 2.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="absolute w-2.5 h-2.5 rounded-sm"
    style={{ backgroundColor: color }}
  />
);

const BookingSuccess = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    delay: Math.random() * 0.8,
    color: confettiColors[i % confettiColors.length],
    x: (Math.random() - 0.5) * 400,
    rotation: Math.random() * 720 - 360,
  }));

  return (
    <div className="pt-24 pb-24 bg-surface-dim relative overflow-hidden min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 grain pointer-events-none z-0" />
      <div className="absolute top-1/3 left-[20%] w-[500px] h-[500px] rounded-full bg-secondary-100/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] rounded-full bg-accent-100/15 blur-[100px] pointer-events-none" />

      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <ConfettiParticle key={i} {...p} />
        ))}
      </div>

      <div className="container-custom max-w-lg text-center relative z-10">
        {/* Animated Check Circle */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative inline-block mb-8"
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-2xl shadow-secondary-500/30">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          {/* Pulse rings */}
          <motion.div
            animate={{ scale: [1, 1.5, 2], opacity: [0.3, 0.1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-secondary-400"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1.8], opacity: [0.2, 0.08, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            className="absolute inset-0 rounded-full bg-secondary-400"
          />
          {/* Floating sparkles */}
          <motion.div
            animate={{ y: [-5, -15, -5], rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -right-4"
          >
            <Sparkles className="w-6 h-6 text-accent-500" />
          </motion.div>
          <motion.div
            animate={{ y: [-3, -12, -3], rotate: [0, -180, -360] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -bottom-2 -left-4"
          >
            <Sparkles className="w-5 h-5 text-primary-500" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-heading mb-3">
            Booking <span className="italic font-normal text-gradient-warm">Confirmed!</span>
          </h1>
          <p className="text-gray-400 mb-2">Your trip has been successfully booked.</p>
          <p className="text-sm text-gray-400 mb-10">
            Booking ID:{' '}
            <span className="font-mono font-semibold text-heading bg-gray-100 px-2 py-0.5 rounded">
              WN-{Math.random().toString(36).substring(2, 8).toUpperCase()}
            </span>
          </p>

          {/* Confirmation Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            className="bg-[#2B3A52] rounded-3xl p-8 mb-10 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary-500/10 blur-[60px]" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-accent-500/10 blur-[50px]" />

            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5"
              >
                <Mail className="w-6 h-6 text-primary-400" />
              </motion.div>
              <p className="text-white/60 text-sm mb-6">
                A confirmation email has been sent to your registered email address with all the trip details and your detailed itinerary.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all"
              >
                <Download className="w-4 h-4" />
                Download Receipt
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              </motion.button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300"
              >
                <Home className="w-4 h-4" />
                Go Home
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:border-primary-200 hover:text-primary-600 transition-all"
              >
                <Package className="w-4 h-4" />
                More Packages
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingSuccess;
