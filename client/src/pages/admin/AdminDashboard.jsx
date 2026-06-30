import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Users, Package, Building2, MapPin,
  Star, MessageSquare, Mail, LogOut, ChevronLeft, ChevronRight,
  TrendingUp, DollarSign, Clock, CheckCircle, XCircle, Archive,
  Search, Filter, RefreshCw, IndianRupee, Loader2, Eye, Menu, X,
  Trash2, Download, CreditCard, Plus, Pencil
} from 'lucide-react';
import useAdminAuthStore from '../../store/adminAuthStore';
import { adminService } from '../../services/adminService';
import { packageService } from '../../services/packageService';
import { hotelService } from '../../services/hotelService';
import { destinationService } from '../../services/destinationService';
import { env } from '../../config/env.js';

const API_URL = env.API_URL;

/* ── Nav Items ── */
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'packages', label: 'Packages', icon: Package },
  { id: 'hotels', label: 'Hotels', icon: Building2 },
  { id: 'destinations', label: 'Destinations', icon: MapPin },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  { id: 'subscribers', label: 'Subscribers', icon: Mail },
];

const statusColor = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
  new: 'bg-sky-100 text-sky-800',
  'in-progress': 'bg-violet-100 text-violet-800',
  resolved: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-gray-200 text-gray-700',
};

/* ── Small Helpers ── */
const Badge = ({ status }) => (
  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColor[status] || 'bg-gray-100 text-gray-700'}`}>
    {status}
  </span>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const Pagination = ({ page, total, limit, onChange }) => {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center gap-2 mt-4 justify-center">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}
        className="p-1.5 rounded border disabled:opacity-30 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
      <span className="text-sm text-gray-600">Page {page} of {pages}</span>
      <button disabled={page >= pages} onClick={() => onChange(page + 1)}
        className="p-1.5 rounded border disabled:opacity-30 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
    </div>
  );
};

const TableHeader = ({ children }) => (
  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{children}</th>
);
const TableCell = ({ children, className = '' }) => (
  <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>{children}</td>
);

/* ================================================================
   TAB: Dashboard
   ================================================================ */
const DashboardTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  if (!stats) return <p className="text-gray-500 py-10 text-center">Failed to load stats.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-blue-600" />
        <StatCard icon={Calendar} label="Total Bookings" value={stats.totalBookings} color="bg-emerald-600" />
        <StatCard icon={IndianRupee} label="Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} color="bg-amber-600" />
        <StatCard icon={Clock} label="Pending Bookings" value={stats.pendingBookings} color="bg-orange-500" />
        <StatCard icon={Package} label="Packages" value={stats.totalPackages} color="bg-violet-600" />
        <StatCard icon={Building2} label="Hotels" value={stats.totalHotels} color="bg-rose-600" />
      </div>
      {stats.recentBookings?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Recent Bookings</h3></div>
          <table className="w-full">
            <thead className="bg-gray-50"><tr>
              <TableHeader>Traveler</TableHeader><TableHeader>Package/Hotel</TableHeader>
              <TableHeader>Date</TableHeader><TableHeader>Status</TableHeader>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentBookings.map(b => (
                <tr key={b._id} className="hover:bg-gray-50/50">
                  <TableCell>{b.traveler?.name || b.user?.name || '—'}</TableCell>
                  <TableCell>{b.package?.title || b.hotel?.name || '—'}</TableCell>
                  <TableCell>{new Date(b.createdAt).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell><Badge status={b.status} /></TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ================================================================
   TAB: Bookings
   ================================================================ */
const BookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    adminService.getAllBookings({ page, limit: 10, status: statusFilter || undefined })
      .then(r => { setBookings(r.data || []); setTotal(r.total || 0); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id, status) => {
    await adminService.updateBooking(id, { status });
    fetch();
  };

  const confirmPayment = async (id) => {
    try {
      await adminService.confirmBookingPayment(id);
      fetch();
    } catch (err) {
      alert(err.message || 'Failed to confirm payment');
    }
  };

  const downloadReceipt = async (bookingId) => {
    try {
      // Use the regular API (user token) to get receipt URL
      const token = localStorage.getItem('wn-admin-token');
      const receiptRes = await fetch(`${API_URL}/bookings/${bookingId}/receipt`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!receiptRes.ok) throw new Error('Failed to get receipt URL');
      const receiptJson = await receiptRes.json();
      const receiptPath = receiptJson?.receiptUrl;
      if (!receiptPath) throw new Error('No receipt URL available');

      // Fetch the actual PDF from the static URL
      const serverOrigin = API_URL.replace(/\/api\/v1\/?$/, '');
      const pdfUrl = `${serverOrigin}${receiptPath}`;
      const pdfRes = await fetch(pdfUrl);
      if (!pdfRes.ok) throw new Error('Failed to download PDF');

      const blob = await pdfRes.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `booking-receipt-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback: open in new tab
      const serverOrigin = API_URL.replace(/\/api\/v1\/?$/, '');
      window.open(`${serverOrigin}/uploads/receipts/booking-${bookingId}.pdf`, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none">
            <option value="">All Status</option>
            <option value="pending">Pending</option><option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>
            <TableHeader>Traveler</TableHeader><TableHeader>Type</TableHeader><TableHeader>Item</TableHeader>
            <TableHeader>Date</TableHeader><TableHeader>Guests</TableHeader><TableHeader>Status</TableHeader><TableHeader>Actions</TableHeader>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="7" className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan="7" className="py-10 text-center text-gray-400">No bookings found.</td></tr>
            ) : bookings.map(b => (
              <tr key={b._id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium">{b.traveler?.name || '—'}<br /><span className="text-xs text-gray-400">{b.traveler?.email}</span></TableCell>
                <TableCell className="capitalize">{b.bookingType}</TableCell>
                <TableCell>{b.package?.title || b.hotel?.name || '—'}</TableCell>
                <TableCell>{b.travelDate ? new Date(b.travelDate).toLocaleDateString('en-IN') : '—'}</TableCell>
                <TableCell>{(b.adults || 0) + (b.children || 0)}</TableCell>
                <TableCell><Badge status={b.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {b.status === 'pending' && (
                      <button onClick={() => confirmPayment(b._id)} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-colors" title="Confirm Payment">
                        <CreditCard className="w-3.5 h-3.5" /> Confirm Payment
                      </button>
                    )}
                    {(b.status === 'confirmed' || b.status === 'completed') && (
                      <button onClick={() => downloadReceipt(b._id)} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors" title="Download Receipt">
                        <Download className="w-3.5 h-3.5" /> Receipt
                      </button>
                    )}
                    {b.status === 'confirmed' && (
                      <button onClick={() => updateStatus(b._id, 'completed')} className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600" title="Mark Complete"><CheckCircle className="w-4 h-4" /></button>
                    )}
                    {b.status !== 'cancelled' && b.status !== 'completed' && (
                      <button onClick={() => updateStatus(b._id, 'cancelled')} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Cancel"><XCircle className="w-4 h-4" /></button>
                    )}
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} limit={10} onChange={setPage} />
    </div>
  );
};

/* ================================================================
   TAB: Users
   ================================================================ */
const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    adminService.getUsers({ page, limit: 10, search: search || undefined, role: roleFilter || undefined })
      .then(r => { setUsers(r.data || []); setTotal(r.total || 0); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [page, search, roleFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await adminService.updateUser(user._id, { role: newRole });
    fetch();
  };

  const deleteUser = async (user) => {
    if (!confirm(`Delete user "${user.name || user.email}"? This cannot be undone.`)) return;
    try {
      await adminService.deleteUser(user._id);
      fetch();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search..." className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none">
            <option value="">All Roles</option><option value="user">User</option><option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>
            <TableHeader>Name</TableHeader><TableHeader>Email</TableHeader><TableHeader>Phone</TableHeader>
            <TableHeader>Role</TableHeader><TableHeader>Joined</TableHeader><TableHeader>Actions</TableHeader>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="6" className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" className="py-10 text-center text-gray-400">No users found.</td></tr>
            ) : users.map(u => (
              <tr key={u._id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium">{u.name || '—'}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone || '—'}</TableCell>
                <TableCell><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${u.role === 'admin' ? 'bg-violet-100 text-violet-800' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></TableCell>
                <TableCell>{new Date(u.createdAt).toLocaleDateString('en-IN')}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button onClick={() => toggleRole(u)}
                      className={`text-xs font-medium px-3 py-1 rounded-lg border ${u.role === 'admin' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-violet-200 text-violet-600 hover:bg-violet-50'}`}>
                      {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </button>
                    <button onClick={() => deleteUser(u)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Delete user">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} limit={10} onChange={setPage} />
    </div>
  );
};

/* ================================================================
   Reusable: Form Modal for Add / Edit
   ================================================================ */
const FormModal = ({ open, onClose, title, fields, initialData, onSave, saving }) => {
  const [form, setForm] = useState({});
  useEffect(() => {
    if (open) {
      const defaults = {};
      fields.forEach(f => { defaults[f.name] = f.type === 'number' ? 0 : f.type === 'boolean' ? false : ''; });
      setForm(initialData ? { ...defaults, ...initialData } : defaults);
    }
  }, [open, initialData, fields]);

  if (!open) return null;

  const handleChange = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert comma-separated strings back to arrays for array fields
    const payload = {};
    fields.forEach(f => {
      let val = form[f.name];
      if (f.isArray && typeof val === 'string') val = val.split(',').map(s => s.trim()).filter(Boolean);
      if (f.type === 'number') val = Number(val) || 0;
      if (f.type === 'boolean') val = !!val;
      payload[f.name] = val;
    });
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto z-10">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">{f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}</label>
              {f.type === 'textarea' ? (
                <textarea value={form[f.name] || ''} onChange={e => handleChange(f.name, e.target.value)}
                  rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-400 outline-none bg-white" />
              ) : f.type === 'boolean' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!form[f.name]} onChange={e => handleChange(f.name, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-gray-700">{f.checkboxLabel || 'Yes'}</span>
                </label>
              ) : f.options ? (
                <select value={form[f.name] || ''} onChange={e => handleChange(f.name, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-400 outline-none bg-white">
                  <option value="">Select...</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type === 'number' ? 'number' : 'text'} value={form[f.name] ?? ''} onChange={e => handleChange(f.name, e.target.value)}
                  placeholder={f.placeholder || ''} step={f.type === 'number' ? 'any' : undefined}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-400 outline-none bg-white" />
              )}
              {f.hint && <p className="text-xs text-gray-400 mt-1">{f.hint}</p>}
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ================================================================
   Reusable: CRUD Tab (List + Add/Edit/Archive)
   ================================================================ */
const CrudTab = ({ title, fetchFn, createFn, updateFn, deleteFn, columns, renderItem, fields, singular }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(() => {
    setLoading(true);
    fetchFn({ limit: 100 })
      .then(r => {
        const data = r.data?.packages || r.data?.hotels || r.data?.destinations || r.data || [];
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {}).finally(() => setLoading(false));
  }, [title]);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (item) => {
    // Pre-fill form with item data; convert arrays to comma-separated strings
    const prefill = {};
    fields.forEach(f => {
      const val = item[f.name];
      prefill[f.name] = f.isArray && Array.isArray(val) ? val.join(', ') : (val ?? '');
    });
    setEditItem({ ...item, _prefill: prefill });
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editItem) {
        await updateFn(editItem._id, payload);
      } else {
        await createFn(payload);
      }
      setModalOpen(false);
      fetch();
    } catch (err) {
      alert(err.message || `Failed to ${editItem ? 'update' : 'create'} ${singular}`);
    } finally {
      setSaving(false);
    }
  };

  const archive = async (id) => {
    if (!confirm(`Archive this ${singular}?`)) return;
    await deleteFn(id);
    fetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex gap-2">
          <button onClick={fetch} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:shadow-lg transition-shadow">
            <Plus className="w-4 h-4" /> Add {singular}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>
            {columns.map(c => <TableHeader key={c}>{c}</TableHeader>)}
            <TableHeader>Actions</TableHeader>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={columns.length + 1} className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="py-10 text-center text-gray-400">No {title.toLowerCase()} found.</td></tr>
            ) : items.map((item, i) => (
              <tr key={item._id || i} className="hover:bg-gray-50/50">
                {renderItem(item)}
                <TableCell>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title="Edit"><Pencil className="w-4 h-4" /></button>
                    {item.isActive !== false ? (
                      <button onClick={() => archive(item._id)} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Archive"><Archive className="w-4 h-4" /></button>
                    ) : (
                      <span className="text-xs text-gray-400">Archived</span>
                    )}
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editItem ? `Edit ${singular}` : `Add ${singular}`}
        fields={fields} initialData={editItem?._prefill || editItem}
        onSave={handleSave} saving={saving} />
    </div>
  );
};

/* ── Field Definitions ── */
const packageFields = [
  { name: 'title', label: 'Title', required: true, placeholder: 'e.g. Kerala Backwater Retreat' },
  { name: 'subtitle', label: 'Subtitle', placeholder: 'Short tagline' },
  { name: 'location', label: 'Location', required: true, placeholder: 'e.g. Kerala, India' },
  { name: 'duration', label: 'Duration', required: true, placeholder: 'e.g. 5 Days / 4 Nights' },
  { name: 'basePrice', label: 'Base Price (₹)', type: 'number', required: true, placeholder: '18999' },
  { name: 'category', label: 'Category', options: ['Hill Station', 'Beach', 'Heritage', 'Adventure', 'Spiritual', 'Pilgrimage', 'Backwater', 'Wildlife'] },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Detailed description...' },
  { name: 'images', label: 'Image URLs', isArray: true, placeholder: 'url1, url2, url3', hint: 'Comma-separated URLs' },
  { name: 'inclusions', label: 'Inclusions', isArray: true, placeholder: 'Hotel, Meals, Transport', hint: 'Comma-separated items' },
  { name: 'exclusions', label: 'Exclusions', isArray: true, placeholder: 'Flights, Insurance', hint: 'Comma-separated items' },
  { name: 'group', label: 'Group Size', type: 'number', placeholder: '12' },
  { name: 'isFeatured', label: 'Featured', type: 'boolean', checkboxLabel: 'Show on homepage' },
];

const hotelFields = [
  { name: 'name', label: 'Hotel Name', required: true, placeholder: 'e.g. Taj Lake Palace' },
  { name: 'location', label: 'Location', required: true, placeholder: 'e.g. Udaipur, Rajasthan' },
  { name: 'type', label: 'Type', options: ['Luxury', 'Resort', 'Villa', 'Heritage', 'Boutique', 'Lodge', 'Homestay', 'Budget'] },
  { name: 'pricePerNight', label: 'Price Per Night (₹)', type: 'number', required: true, placeholder: '8999' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Hotel description...' },
  { name: 'amenities', label: 'Amenities', isArray: true, placeholder: 'Wifi, Pool, Restaurant, Parking', hint: 'Comma-separated amenities' },
  { name: 'features', label: 'Features', isArray: true, placeholder: 'Lake View, Spa, Garden', hint: 'Comma-separated features' },
];

const destinationFields = [
  { name: 'name', label: 'Destination Name', required: true, placeholder: 'e.g. Rishikesh' },
  { name: 'category', label: 'Category', options: ['Hill Station', 'Beach', 'Heritage', 'Adventure', 'Spiritual', 'Pilgrimage', 'Backwater', 'Wildlife'] },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'About this destination...' },
  { name: 'priceFrom', label: 'Price From (₹)', type: 'number', placeholder: '9999' },
  { name: 'images', label: 'Image URLs', isArray: true, placeholder: 'url1, url2, url3', hint: 'Comma-separated URLs' },
];

const PackagesTab = () => (
  <CrudTab title="Packages" singular="Package"
    fetchFn={packageService.getAll} createFn={adminService.createPackage}
    updateFn={adminService.updatePackage} deleteFn={adminService.deletePackage}
    columns={['Title', 'Location', 'Price', 'Duration', 'Rating']}
    fields={packageFields}
    renderItem={p => (<>
      <TableCell className="font-medium">{p.title}</TableCell>
      <TableCell>{p.location}</TableCell>
      <TableCell>₹{(p.basePrice || 0).toLocaleString('en-IN')}</TableCell>
      <TableCell>{p.duration}</TableCell>
      <TableCell>{p.rating ? `${p.rating}/5` : '—'}</TableCell>
    </>)}
  />
);

const HotelsTab = () => (
  <CrudTab title="Hotels" singular="Hotel"
    fetchFn={hotelService.getAll} createFn={adminService.createHotel}
    updateFn={adminService.updateHotel} deleteFn={adminService.deleteHotel}
    columns={['Name', 'Location', 'Price/Night', 'Rating', 'Type']}
    fields={hotelFields}
    renderItem={h => (<>
      <TableCell className="font-medium">{h.name}</TableCell>
      <TableCell>{h.location}</TableCell>
      <TableCell>₹{(h.pricePerNight || 0).toLocaleString('en-IN')}</TableCell>
      <TableCell>{h.rating ? `${h.rating}/5` : '—'}</TableCell>
      <TableCell className="capitalize">{h.type || '—'}</TableCell>
    </>)}
  />
);

const DestinationsTab = () => (
  <CrudTab title="Destinations" singular="Destination"
    fetchFn={destinationService.getAll} createFn={adminService.createDestination}
    updateFn={adminService.updateDestination} deleteFn={adminService.deleteDestination}
    columns={['Name', 'Category', 'Price From', 'Rating']}
    fields={destinationFields}
    renderItem={d => (<>
      <TableCell className="font-medium">{d.name}</TableCell>
      <TableCell>{d.category || '—'}</TableCell>
      <TableCell>₹{(d.priceFrom || 0).toLocaleString('en-IN')}</TableCell>
      <TableCell>{d.rating ? `${d.rating}/5` : '—'}</TableCell>
    </>)}
  />
);

/* ================================================================
   TAB: Reviews
   ================================================================ */
const ReviewsTab = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    adminService.getPendingReviews()
      .then(r => setReviews(r.data || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const moderate = async (id, approved) => {
    await adminService.moderateReview(id, { isApproved: approved, adminNote: approved ? 'Approved' : 'Rejected by admin' });
    fetch();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Pending Reviews</h2>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></div>
        ) : reviews.length === 0 ? (
          <div className="py-10 text-center text-gray-400">No pending reviews.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {reviews.map(r => (
              <div key={r._id} className="p-5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{r.user?.name || 'Anonymous'}</span>
                    <span className="text-xs text-gray-400">on</span>
                    <span className="text-sm text-gray-600">{r.package?.title || r.hotel?.name || '—'}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  {r.title && <p className="font-medium text-gray-800 text-sm">{r.title}</p>}
                  {r.comment && <p className="text-gray-600 text-sm mt-1">{r.comment}</p>}
                  <p className="text-xs text-gray-400 mt-2">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => moderate(r._id, true)} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100">Approve</button>
                  <button onClick={() => moderate(r._id, false)} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================================================================
   TAB: Inquiries
   ================================================================ */
const InquiriesTab = () => {
  const [inquiries, setInquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    adminService.getInquiries({ page, limit: 10, status: statusFilter || undefined })
      .then(r => { setInquiries(r.data || []); setTotal(r.total || 0); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id, status) => {
    await adminService.updateInquiry(id, { status });
    fetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Inquiries</h2>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none">
          <option value="">All</option><option value="new">New</option>
          <option value="in-progress">In Progress</option><option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>
            <TableHeader>Name</TableHeader><TableHeader>Email</TableHeader><TableHeader>Subject</TableHeader>
            <TableHeader>Date</TableHeader><TableHeader>Status</TableHeader><TableHeader>Actions</TableHeader>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="6" className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></td></tr>
            ) : inquiries.length === 0 ? (
              <tr><td colSpan="6" className="py-10 text-center text-gray-400">No inquiries found.</td></tr>
            ) : inquiries.map(inq => (
              <tr key={inq._id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium">{inq.name}</TableCell>
                <TableCell>{inq.email}</TableCell>
                <TableCell className="max-w-[200px] truncate">{inq.subject || '—'}</TableCell>
                <TableCell>{new Date(inq.createdAt).toLocaleDateString('en-IN')}</TableCell>
                <TableCell><Badge status={inq.status} /></TableCell>
                <TableCell>
                  <select value={inq.status} onChange={e => updateStatus(inq._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-primary-500 outline-none">
                    <option value="new">New</option><option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option><option value="closed">Closed</option>
                  </select>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} limit={10} onChange={setPage} />
    </div>
  );
};

/* ================================================================
   TAB: Subscribers
   ================================================================ */
const SubscribersTab = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getSubscribers().then(r => setSubs(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h2>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></div>
        ) : subs.length === 0 ? (
          <div className="py-10 text-center text-gray-400">No subscribers yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50"><tr>
              <TableHeader>Email</TableHeader><TableHeader>Subscribed</TableHeader><TableHeader>Status</TableHeader>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {subs.map(s => (
                <tr key={s._id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">{s.email}</TableCell>
                  <TableCell>{new Date(s.createdAt).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell><Badge status={s.isSubscribed ? 'confirmed' : 'cancelled'} /></TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

/* ================================================================
   MAIN: AdminDashboard
   ================================================================ */
const TABS = {
  dashboard: DashboardTab,
  bookings: BookingsTab,
  users: UsersTab,
  packages: PackagesTab,
  hotels: HotelsTab,
  destinations: DestinationsTab,
  reviews: ReviewsTab,
  inquiries: InquiriesTab,
  subscribers: SubscribersTab,
};

export default function AdminDashboard() {
  const { user, logout } = useAdminAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Role guard
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login', { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (!user || user.role !== 'admin') return null;

  const ActiveComponent = TABS[activeTab] || DashboardTab;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-40 flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">WanderNest <span className="text-primary-600">Admin</span></h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${activeTab === id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
              {(user.name || 'A')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'Admin'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/')} className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              View Site
            </button>
            <button onClick={handleLogout} className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center gap-1">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar (mobile) */}
        <div className="lg:hidden sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100"><Menu className="w-5 h-5" /></button>
          <h1 className="text-lg font-bold text-gray-900">Admin</h1>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}>
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
