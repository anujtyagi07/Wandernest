import api from './api';

export const priceCalcService = {
  getConfig: () => api.get('/price-calculator/config'),
  calculate: (data) => api.post('/price-calculator/calculate', data),
};
