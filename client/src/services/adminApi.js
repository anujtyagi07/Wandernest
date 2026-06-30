import axios from 'axios';
import { env } from '../config/env.js';

const API_URL = env.API_URL;

const adminApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach admin JWT token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wn-admin-token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 errors (admin-specific)
adminApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('wn-admin-token');
      localStorage.removeItem('wn-admin-refresh');
      localStorage.removeItem('wn-admin-user');
      // Only redirect if not already on admin login page
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject({ message, status, errors: error.response?.data?.errors });
  }
);

export default adminApi;
