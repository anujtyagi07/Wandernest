import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download, Calendar, MapPin, User, Users, Phone, Mail,
  CreditCard, CheckCircle, ArrowLeft, FileText, Clock, Loader2
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { bookingService } from '../services/bookingService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/* ================================================
   BOOKING DETAIL / RECEIPT PAGE
   ================================================ */
const BookingReceipt = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    loadBooking();
  }, [id, isAuthenticated]);

  const loadBooking = async () => {
    try {
      const res = await bookingService.getById(id);
      setBooking(res.data?.booking || res.data);
    } catch (err) {
      setError(err.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    try {
      // Step 1: Get the receiptUrl from the API (returns JSON { success, receiptUrl })
      const receiptRes = await bookingService.getReceipt(id);
      const receiptPath = receiptRes?.receiptUrl || receiptRes?.data?.receiptUrl;
      if (!receiptPath) throw new Error('No receipt URL available');

      // Step 2: Build the full URL to the static PDF file
      // API_URL is http://localhost:5000/api/v1 — strip /api/v1 for static files
      const serverOrigin = API_URL.replace(/\/api\/v1\/?$/, '');
      const pdfUrl = `${serverOrigin}${receiptPath}`;

      // Step 3: Fetch the actual PDF binary
      const token = localStorage.getItem('wn-token');
      const response = await fetch(pdfUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) throw new Error('Failed to download PDF');

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `booking-receipt-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open the receipt URL directly in a new tab
      const serverOrigin = API_URL.replace(/\/api\/v1\/?$/, '');
      window.open(`${serverOrigin}/uploads/receipts/booking-${id}.pdf`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-24 min-h-screen flex items-center justify-center bg-surface-dim">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="pt-24 pb-24 min-h-screen flex items-center justify-center bg-surface-dim">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">{error || 'Booking not found'}</p>
          <Link to="/profile" className="text-primary-500 font-semibold">
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="pt-24 pb-24 bg-surface-dim relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-primary-100/30" />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </motion.div>

          {/* Receipt Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2B3A52] to-primary-800 p-8 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-heading font-bold mb-1">Booking Receipt</h1>
                  <p className="text-white/50 text-sm">
                    Booking ID: {(booking._id || booking.id)?.slice(-8)?.toUpperCase()}
                  </p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                  {booking.status?.charAt(0)?.toUpperCase() + booking.status?.slice(1)}
                </span>
              </div>

              {/* Brand */}
              <div className="mt-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-300" />
                <span className="font-heading font-bold text-lg">WanderNest</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Package/Hotel Info */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Booking Details</h3>
                <div className="p-4 rounded-xl bg-gray-50">
                  <h4 className="font-heading font-bold text-lg text-heading">
                    {booking.package?.title || booking.hotel?.name || 'Tour Package'}
                  </h4>
                  {booking.package?.location && (
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {booking.package.location}
                    </p>
                  )}
                  {booking.hotel?.location && (
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {booking.hotel.location}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {booking.adults} Adults{booking.children > 0 ? `, ${booking.children} Children` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Traveler Info */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Traveler Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {booking.traveler?.name && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Name</p>
                        <p className="font-medium text-heading text-sm">{booking.traveler.name}</p>
                      </div>
                    </div>
                  )}
                  {booking.traveler?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="font-medium text-heading text-sm">{booking.traveler.email}</p>
                      </div>
                    </div>
                  )}
                  {booking.traveler?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="font-medium text-heading text-sm">{booking.traveler.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Payment Summary</h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="p-4 flex items-center justify-between border-b border-gray-50">
                    <span className="text-sm text-gray-500">Subtotal</span>
                    <span className="font-medium text-heading">₹{(booking.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  {booking.specialRequests && (
                    <div className="p-4 flex items-start gap-3 border-b border-gray-50">
                      <span className="text-sm text-gray-500">Special Requests</span>
                      <span className="text-sm text-heading text-right">{booking.specialRequests}</span>
                    </div>
                  )}
                  <div className="p-4 bg-gray-50 flex items-center justify-between">
                    <span className="font-semibold text-heading">Total Paid</span>
                    <span className="text-xl font-heading font-bold text-primary-600">
                      ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                {booking.paymentStatus === 'paid' ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">Payment Confirmed</p>
                      <p className="text-xs text-emerald-600/60">
                        {booking.confirmedAt && `Confirmed on ${new Date(booking.confirmedAt).toLocaleDateString('en-IN')}`}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-semibold text-amber-700">Payment {booking.paymentStatus || 'Pending'}</p>
                      <p className="text-xs text-amber-600/60">Awaiting payment confirmation</p>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={downloadReceipt}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold hover:shadow-lg transition-shadow"
                >
                  <Download className="w-4 h-4" />
                  Download PDF Receipt
                </button>
                {booking.status === 'pending' && (
                  <Link
                    to={`/bookings/${booking._id || booking.id}/cancel`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    Cancel Booking
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingReceipt;
