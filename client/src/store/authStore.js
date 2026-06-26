import { create } from 'zustand';
import { authService } from '../services/authService';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('wn-user') || 'null'),
  isAuthenticated: !!localStorage.getItem('wn-token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.login({ email, password });
      const { user, accessToken, refreshToken } = res;
      localStorage.setItem('wn-token', accessToken);
      localStorage.setItem('wn-refresh', refreshToken);
      localStorage.setItem('wn-user', JSON.stringify(user));
      set({ user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  signup: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.register({ name, email, password });
      const { user, accessToken, refreshToken } = res;
      localStorage.setItem('wn-token', accessToken);
      localStorage.setItem('wn-refresh', refreshToken);
      localStorage.setItem('wn-user', JSON.stringify(user));
      set({ user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore errors on logout
    }
    localStorage.removeItem('wn-token');
    localStorage.removeItem('wn-refresh');
    localStorage.removeItem('wn-user');
    set({ user: null, isAuthenticated: false });
  },

  fetchProfile: async () => {
    try {
      const res = await authService.getProfile();
      const user = res.user;
      localStorage.setItem('wn-user', JSON.stringify(user));
      set({ user });
    } catch {
      // Ignore profile fetch errors
    }
  },

  updateProfile: async (updates) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.updateProfile(updates);
      const user = res.user;
      localStorage.setItem('wn-user', JSON.stringify(user));
      set({ user, loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ loading: true, error: null });
    try {
      await authService.changePassword({ currentPassword, newPassword });
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
