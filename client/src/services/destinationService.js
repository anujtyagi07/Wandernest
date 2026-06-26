import api from './api';

export const destinationService = {
  getAll: (params = {}) => api.get('/destinations', { params }),
  getBySlug: (slug) => api.get(`/destinations/${slug}`),
};
