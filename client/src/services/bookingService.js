import api from './api';

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  confirmPayment: (id, data) => api.post(`/bookings/${id}/confirm-payment`, data),
  getMyBookings: (params = {}) => api.get('/bookings/my', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getReceipt: (id) => api.get(`/bookings/${id}/receipt`),
};
