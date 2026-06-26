import api from './api';

export const packageService = {
  getAll: (params = {}) => api.get('/packages', { params }),
  getFeatured: () => api.get('/packages/featured'),
  getById: (id) => api.get(`/packages/${id}`),
  getRelated: (id) => api.get(`/packages/${id}/related`),
};
