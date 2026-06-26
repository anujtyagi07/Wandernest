import { create } from 'zustand';
import { adminAuthService } from '../services/adminAuthService';

const useAdminAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('wn-admin-user') || 'null'),
  isAuthenticated: !!localStorage.getItem('wn-admin-token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await adminAuthService.login({ email, password });
      const { user, accessToken, refreshToken } = res;

      // Enforce admin-only login
      if (user?.role !== 'admin') {
        set({ loading: false, error: 'Access denied. Admin privileges required.' });
        return { success: false, error: 'Access denied. Admin privileges required.' };
      }

      localStorage.setItem('wn-admin-token', accessToken);
      localStorage.setItem('wn-admin-refresh', refreshToken);
      localStorage.setItem('wn-admin-user', JSON.stringify(user));
      set({ user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  logout: async () => {
    try {
      await adminAuthService.logout();
    } catch {
      // Ignore errors on logout
    }
    localStorage.removeItem('wn-admin-token');
    localStorage.removeItem('wn-admin-refresh');
    localStorage.removeItem('wn-admin-user');
    set({ user: null, isAuthenticated: false });
  },

  fetchProfile: async () => {
    try {
      const res = await adminAuthService.getProfile();
      const user = res.user;
      if (user?.role === 'admin') {
        localStorage.setItem('wn-admin-user', JSON.stringify(user));
        set({ user });
      }
    } catch {
      // Ignore profile fetch errors
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAdminAuthStore;
