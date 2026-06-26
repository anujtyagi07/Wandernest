import api from './api';

export const hotelService = {
  getAll: (params = {}) => api.get('/hotels', { params }),
  getById: (id) => api.get(`/hotels/${id}`),
};
