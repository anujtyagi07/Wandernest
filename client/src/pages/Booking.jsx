import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Calendar, CheckCircle, ArrowUpRight, ArrowRight, Check, Phone, Shield, Loader2 } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { authService } from '../services/authService';
import { packageService } from '../services/packageService';
import useAuthStore from '../store/authStore';

/* ---- Animation Variants ---- */
const reveal = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const stepVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 60 : -60, scale: 0.95 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -60 : 60, scale: 0.95 }),
};

const steps = [
  { id: 1, label: 'Traveler Info', icon: User },
  { id: 2, label: 'Date & Details', icon: Calendar },
  { id: 3, label: 'Verify & Pay', icon: Shield },
];

const inputClass = 'w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white outline-none transition-all duration-300 text-sm';
const labelClass = 'block text-xs font-medium uppercase tracking-wider text-gray-400 mb-2';

const Booking = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [resolvedPackageId, setResolvedPackageId] = useState(packageId);
  const [packageName, setPackageName] = useState('');
  const [packagePrice, setPackagePrice] = useState(15999);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', adults: 2, children: 0, date: '', requests: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Resolve packageId — if it's not a valid MongoDB ObjectId, look up the real package
  useEffect(() => {
    const resolvePackage = async () => {
      const isObjectId = /^[a-fA-F0-9]{24}$/.test(packageId);
      if (isObjectId) {
        // Try to fetch package details for display
        try {
          const res = await packageService.getById(packageId);
          const pkg = res?.data || res;
          if (pkg) {
            setPackageName(pkg.title || '');
            setPackagePrice(pkg.basePrice || 15999);
          }
        } catch {
          // Package not found with this ID, use as-is
        }
        return;
      }
      // Not a valid ObjectId — try to find by fetching all packages
      try {
        const res = await packageService.getAll();
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        // Try to match by numeric index (1-based) or by title
        const idx = parseInt(packageId) - 1;
        const matched = list[idx] || list.find(p => p.title?.toLowerCase().includes(packageId?.toLowerCase()));
        if (matched) {
          setResolvedPackageId(matched._id);
          setPackageName(matched.title || '');
          setPackagePrice(matched.basePrice || 15999);
        }
      } catch {
        // Could not resolve — will show error on submit
      }
    };
    resolvePackage();
  }, [packageId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const goStep = (newStep) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  const handleSendOtp = async () => {
    setError('');
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!form.phone) {
      setError('Please enter your phone number');
      return;
    }
    setSubmitting(true);
    try {
      await authService.generateOtp(form.phone);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setSubmitting(true);
    try {
      await authService.verifyOtp(form.phone, otp);
      setOtpVerified(true);
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const totalAmount = Number(form.adults || 2) * packagePrice;
      const bookingData = {
        bookingType: 'package',
        packageId: resolvedPackageId,
        traveler: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        travelDate: form.date,
        adults: Number(form.adults),
        children: Number(form.children),
        totalAmount,
        specialRequests: form.requests,
        otpPhone: form.phone,
        otpCode: otp,
      };
      const res = await bookingService.create(bookingData);
      const bookingId = res?._id || res?.booking?._id || res?.bookingId;
      navigate('/booking-success', { state: { bookingId } });
    } catch (err) {
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-24 bg-surface-dim relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 grain pointer-events-none z-0" />
      <div className="absolute top-40 right-[10%] w-[500px] h-[500px] rounded-full bg-primary-100/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 left-[5%] w-[400px] h-[400px] rounded-full bg-accent-100/15 blur-[100px] pointer-events-none" />

      <div className="container-custom max-w-3xl relative z-10">
        {/* Back Link */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link to={`/packages/${resolvedPackageId}`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary-600 mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="border-b border-gray-300 group-hover:border-primary-400 pb-0.5 transition-colors">Back to Package</span>
          </Link>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Hero */}
          <motion.div variants={reveal} className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <motion.div animate={{ width: [0, 48] }} transition={{ duration: 0.8, delay: 0.3 }} className="h-[2px] bg-primary-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Book Your Trip</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-heading leading-tight">
              Reserve your <span className="italic font-normal text-gradient-warm">journey</span>
            </h1>
          </motion.div>

          {/* Progress Bar */}
          <motion.div variants={reveal} className="mb-4">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${(step / steps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
              />
            </div>
          </motion.div>

          {/* Step Indicator */}
          <motion.div variants={reveal} className="mb-10">
            <div className="flex items-center gap-2 bg-white rounded-2xl p-2 border border-gray-100 inline-flex">
              {steps.map((s) => {
                const isActive = step === s.id;
                const isComplete = step > s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => { if (isComplete) goStep(s.id); }}
                    className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-white' : isComplete ? 'text-primary-600' : 'text-gray-400'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="booking-step"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    {isComplete ? (
                      <Check className="relative z-10 w-4 h-4 text-secondary-500" />
                    ) : (
                      <s.icon className="relative z-10 w-4 h-4" />
                    )}
                    <span className="relative z-10 hidden sm:block">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div variants={reveal} className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              {/* Step 1: Traveler Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  <h2 className="text-2xl font-heading font-bold text-heading mb-6">
                    Traveler <span className="italic font-normal">Details</span>
                  </h2>
                  {[
                    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                    { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
                    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
                  ].map((field, i) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <label className={labelClass}>{field.label}</label>
                      <input name={field.name} value={form[field.name]} onChange={handleChange} type={field.type} placeholder={field.placeholder} className={inputClass} />
                    </motion.div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    {['adults', 'children'].map((name, i) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.24 + i * 0.08 }}
                      >
                        <label className={labelClass}>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
                        <input name={name} value={form[name]} onChange={handleChange} type="number" min={name === 'children' ? 0 : 1} className={inputClass} />
                      </motion.div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goStep(2)}
                    className="group w-full py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 mt-6"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Date & Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  <h2 className="text-2xl font-heading font-bold text-heading mb-6">
                    Travel Date & <span className="italic font-normal">Preferences</span>
                  </h2>
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <label className={labelClass}>Preferred Travel Date</label>
                    <input name="date" value={form.date} onChange={handleChange} type="date" className={inputClass} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <label className={labelClass}>Special Requests</label>
                    <textarea name="requests" value={form.requests} onChange={handleChange} rows="4" placeholder="Dietary needs, accessibility requirements, celebrations..." className={`${inputClass} resize-none`} />
                  </motion.div>
                  <div className="flex gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => goStep(1)}
                      className="flex-1 py-4 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => goStep(3)}
                      className="group flex-1 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300"
                    >
                      Review Booking
                      <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Verify & Confirm */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-heading font-bold text-heading mb-6">
                    Verify & <span className="italic font-normal">Confirm</span>
                  </h2>

                  {/* Error message */}
                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-2xl p-6 space-y-0">
                    {[
                      { label: 'Name', value: form.name || 'N/A' },
                      { label: 'Email', value: form.email || 'N/A' },
                      { label: 'Phone', value: form.phone || 'N/A' },
                      { label: 'Travelers', value: `${form.adults} Adults, ${form.children} Children` },
                      { label: 'Travel Date', value: form.date || 'Not selected' },
                    ].map((row, i) => (
                      <motion.div
                        key={row.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex justify-between py-3 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-sm text-gray-400">{row.label}</span>
                        <span className="text-sm font-medium text-heading">{row.value}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* OTP Verification */}
                  <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Phone className="w-4 h-4 text-primary-500" />
                      <h3 className="font-semibold text-heading">Phone Verification</h3>
                    </div>
                    {!otpSent ? (
                      <div>
                        <p className="text-sm text-gray-500 mb-3">We'll send a 6-digit OTP to verify your phone number</p>
                        <button
                          onClick={handleSendOtp}
                          disabled={submitting}
                          className="px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
                        >
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                          Send OTP
                        </button>
                      </div>
                    ) : !otpVerified ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-500">Enter the 6-digit code sent to {form.phone}</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter OTP"
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-center text-lg tracking-widest font-mono focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                          />
                          <button
                            onClick={handleVerifyOtp}
                            disabled={submitting}
                            className="px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold disabled:opacity-60"
                          >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                          </button>
                        </div>
                        <button
                          onClick={handleSendOtp}
                          disabled={submitting}
                          className="text-xs text-primary-500 hover:text-primary-600"
                        >
                          Resend OTP
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Phone verified successfully!</span>
                      </div>
                    )}
                  </div>

                  {/* Price Summary */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="bg-[#2B3A52] rounded-2xl p-6 relative overflow-hidden"
                  >
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary-500/10 blur-[40px]" />
                    <div className="relative z-10 flex justify-between items-center">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/40 mb-1">{packageName || `Package`}</p>
                        <p className="text-sm text-white/60">Total Estimate</p>
                      </div>
                      <p className="text-3xl font-heading font-bold text-white">
                        ₹{(Number(form.adults || 2) * packagePrice).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>

                  <div className="flex gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => goStep(2)}
                      className="flex-1 py-4 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={submitting || !otpVerified}
                      className="group flex-1 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 disabled:opacity-60"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Confirm Booking
                          <CheckCircle className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
