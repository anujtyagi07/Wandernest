import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Calendar, Edit3, Save, X,
  Map, BedDouble, Clock, CreditCard, ChevronRight,
  ShieldCheck, Camera, LogOut, Key
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { bookingService } from '../services/bookingService';

/* ================================================
   PROFILE PAGE
   ================================================ */
const Profile = () => {
  const { user, isAuthenticated, updateProfile, changePassword, logout, fetchProfile } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [pwdForm, setPwdForm] = useState({ current: '', new: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Fetch profile and bookings
  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      loadBookings();
    }
  }, [isAuthenticated]);

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data?.bookings || res.data || []);
    } catch {
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    const result = await updateProfile(form);
    if (result?.success) {
      setMsg('Profile updated successfully!');
      setEditing(false);
    } else {
      setError(result?.error || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    if (pwdForm.new !== pwdForm.confirm) {
      setError('New passwords do not match');
      return;
    }
    if (pwdForm.new.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    const result = await changePassword(pwdForm.current, pwdForm.new);
    if (result?.success) {
      setMsg('Password changed successfully!');
      setPwdForm({ current: '', new: '', confirm: '' });
    } else {
      setError(result?.error || 'Failed to change password');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'bookings', label: 'My Bookings', icon: Map },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <div className="pt-24 pb-24 bg-surface-dim relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-primary-100/30" />
      <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] rounded-full blur-[100px] bg-accent-100/20" />

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-heading mb-2">
              My <span className="italic font-normal text-gradient-warm">Profile</span>
            </h1>
            <p className="text-gray-400">Manage your account and view your bookings</p>
          </motion.div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* User Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-heading font-bold text-white">
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-heading">{user.name || 'User'}</h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary-100 text-primary-600 text-xs font-semibold">
                    Admin
                  </span>
                )}
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMsg(''); setError(''); }}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors border-b border-gray-50 last:border-0 ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600 border-l-2 border-l-primary-500'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 min-h-[400px]"
            >
              {/* Messages */}
              {msg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-emerald-700 text-sm">{msg}</p>
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-heading font-bold text-heading">Personal Information</h2>
                    {!editing ? (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 text-primary-600 text-sm font-medium hover:bg-primary-100 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => { setEditing(false); setForm({ name: user.name || '', phone: user.phone || '' }); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    )}
                  </div>

                  {editing ? (
                    <form onSubmit={handleSaveProfile} className="space-y-5 max-w-md">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full px-5 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-400 text-sm cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white outline-none transition-all text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white text-sm font-semibold hover:shadow-lg transition-shadow"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      {[
                        { icon: User, label: 'Name', value: user.name || 'Not set' },
                        { icon: Mail, label: 'Email', value: user.email },
                        { icon: Phone, label: 'Phone', value: user.phone || 'Not set' },
                        { icon: ShieldCheck, label: 'Phone Verified', value: user.isPhoneVerified ? 'Yes' : 'No' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">{item.label}</p>
                            <p className="font-medium text-heading">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-2xl font-heading font-bold text-heading mb-8">My Bookings</h2>
                  {loadingBookings ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
                      ))}
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-16">
                      <Map className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">You haven't made any bookings yet</p>
                      <Link to="/packages" className="text-primary-500 font-semibold hover:text-primary-600">
                        Explore Packages →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <Link
                          key={booking._id || booking.id}
                          to={`/bookings/${booking._id || booking.id}`}
                          className="block p-5 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                booking.status === 'confirmed' ? 'bg-emerald-100' :
                                booking.status === 'pending' ? 'bg-amber-100' :
                                booking.status === 'completed' ? 'bg-blue-100' : 'bg-gray-100'
                              }`}>
                                {booking.bookingType === 'hotel' ? (
                                  <BedDouble className={`w-5 h-5 ${
                                    booking.status === 'confirmed' ? 'text-emerald-600' :
                                    booking.status === 'pending' ? 'text-amber-600' :
                                    booking.status === 'completed' ? 'text-blue-600' : 'text-gray-500'
                                  }`} />
                                ) : (
                                  <Map className={`w-5 h-5 ${
                                    booking.status === 'confirmed' ? 'text-emerald-600' :
                                    booking.status === 'pending' ? 'text-amber-600' :
                                    booking.status === 'completed' ? 'text-blue-600' : 'text-gray-500'
                                  }`} />
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-heading group-hover:text-primary-500 transition-colors">
                                  {booking.package?.title || booking.hotel?.name || 'Booking'}
                                </h4>
                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(booking.travelDate || booking.createdAt).toLocaleDateString('en-IN')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {(booking.adults || 0) + (booking.children || 0)} guests
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-heading font-bold text-heading">₹{(booking.totalAmount || 0).toLocaleString('en-IN')}</p>
                              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-heading font-bold text-heading mb-8">Change Password</h2>
                  <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Current Password</label>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          value={pwdForm.current}
                          onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                          placeholder="Enter current password"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">New Password</label>
                      <input
                        type="password"
                        value={pwdForm.new}
                        onChange={(e) => setPwdForm({ ...pwdForm, new: e.target.value })}
                        placeholder="Min. 8 characters"
                        className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={pwdForm.confirm}
                        onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                        placeholder="Repeat new password"
                        className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white outline-none transition-all text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white text-sm font-semibold hover:shadow-lg transition-shadow"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Update Password
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
