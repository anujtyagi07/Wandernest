import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

/* ================================================
   AUTH — Login / Signup with animated transitions
   ================================================ */
const Auth = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const { login, signup, error: authError, clearError } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (mode === 'signup' && name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email';
    if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (mode === 'signup' && password !== confirmPwd) errs.confirmPwd = 'Passwords do not match';
    return errs;
  };

  const pwdStrength = () => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwdStrength()];
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'][pwdStrength()];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    let result;
    if (mode === 'login') {
      result = await login(email, password);
    } else {
      result = await signup(name, email, password);
    }
    setLoading(false);

    if (result?.success) {
      navigate('/');
    } else {
      setErrors({ general: result?.error || 'Authentication failed' });
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setErrors({});
    setPassword('');
    setConfirmPwd('');
    clearError();
  };

  return (
    <div className="pt-24 pb-24 relative overflow-hidden min-h-screen bg-surface-dim">
      {/* Background */}
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-primary-100/30" />
      <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] rounded-full blur-[100px] bg-accent-100/20" />

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — Brand Panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            <div className="rounded-3xl p-10 relative overflow-hidden bg-[#2B3A52]">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary-500/10 blur-[80px]" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-accent-500/10 blur-[60px]" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-heading font-bold text-2xl text-white">
                    Wander<span className="text-gradient-warm">Nest</span>
                  </span>
                </div>

                <h2 className="text-3xl font-heading font-bold text-white mb-4">
                  Your journey<br />begins here
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  Join thousands of travelers who trust WanderNest for unforgettable journeys across India's most sacred and scenic destinations.
                </p>

                <div className="space-y-4">
                  {['Exclusive early-bird discounts on Chardham packages', 'Personalized itinerary planning with expert guides', '24/7 travel support throughout your journey'].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" />
                      <p className="text-white/60 text-sm">{item}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {['bg-primary-500', 'bg-accent-500', 'bg-secondary-500'].map((bg, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-[#2B3A52] flex items-center justify-center text-white text-xs font-bold`}>
                          {['A', 'R', 'S'][i]}
                        </div>
                      ))}
                    </div>
                    <p className="text-white/40 text-xs">
                      <span className="text-white/70 font-semibold">2,000+</span> travelers this month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-3xl p-8 md:p-10 border bg-white border-gray-100 shadow-xl">
              {/* Mode Toggle */}
              <div className="flex rounded-xl p-1 mb-8 bg-gray-100">
                {['login', 'signup'].map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setErrors({}); setPassword(''); setConfirmPwd(''); clearError(); }}
                    className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 ${
                      mode === m ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {mode === m && (
                      <motion.div
                        layoutId="auth-tab"
                        className="absolute inset-0 gradient-primary rounded-lg"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{m === 'login' ? 'Sign In' : 'Create Account'}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <h2 className="text-2xl font-heading font-bold mb-1 text-heading">
                    {mode === 'login' ? 'Welcome back' : 'Join WanderNest'}
                  </h2>
                  <p className="text-sm mb-6 text-gray-400">
                    {mode === 'login' ? 'Sign in to access your bookings and saved trips' : 'Create your account to start planning your next adventure'}
                  </p>

                  {/* Name (signup only) */}
                  {mode === 'signup' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors bg-gray-50 border-gray-200 text-[#2B3A52] placeholder:text-gray-400 focus:border-primary-400 focus:bg-white ${errors.name ? 'border-red-400' : ''}`}
                        />
                      </div>
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </motion.div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors bg-gray-50 border-gray-200 text-[#2B3A52] placeholder:text-gray-400 focus:border-primary-400 focus:bg-white ${errors.email ? 'border-red-400' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPwd ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm transition-colors bg-gray-50 border-gray-200 text-[#2B3A52] placeholder:text-gray-400 focus:border-primary-400 focus:bg-white ${errors.password ? 'border-red-400' : ''}`}
                      />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    {/* Password strength indicator */}
                    {password.length > 0 && (
                      <div className="mt-2">
                        <div className="flex gap-1.5 mb-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= pwdStrength() ? strengthColor : 'bg-gray-200'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400">Strength: <span className="font-medium">{strengthLabel}</span></p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password (signup) */}
                  {mode === 'signup' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">Confirm Password</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          value={confirmPwd}
                          onChange={(e) => setConfirmPwd(e.target.value)}
                          placeholder="Repeat your password"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors bg-gray-50 border-gray-200 text-[#2B3A52] placeholder:text-gray-400 focus:border-primary-400 focus:bg-white ${errors.confirmPwd ? 'border-red-400' : ''}`}
                        />
                      </div>
                      {errors.confirmPwd && <p className="text-red-400 text-xs mt-1">{errors.confirmPwd}</p>}
                    </motion.div>
                  )}

                  {/* General Error */}
                  {(errors.general || authError) && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                      <p className="text-red-600 text-sm">{errors.general || authError}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-lg shadow-primary-500/20 hover:shadow-xl transition-shadow disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <>
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Divider */}
                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400">or continue with</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-2 gap-3">
                    {['Google', 'Apple'].map((provider) => (
                      <button
                        key={provider}
                        type="button"
                        onClick={() => { login('user@google.com', ''); navigate('/'); }}
                        className="py-3 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center gap-2 bg-white border-gray-200 text-[#2B3A52] hover:bg-gray-50"
                      >
                        {provider === 'Google' ? (
                          <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        ) : (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                        )}
                        {provider}
                      </button>
                    ))}
                  </div>
                </motion.form>
              </AnimatePresence>

              {/* Switch mode */}
              <p className="text-center text-sm mt-6 text-gray-400">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button onClick={switchMode} className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
