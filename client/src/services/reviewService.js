import api from './api';

export const reviewService = {
  create: (data) => api.post('/reviews', data),
  getPackageReviews: (id, params = {}) => api.get(`/reviews/package/${id}`, { params }),
  getHotelReviews: (id, params = {}) => api.get(`/reviews/hotel/${id}`, { params }),
};
