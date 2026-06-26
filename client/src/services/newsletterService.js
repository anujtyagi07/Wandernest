import api from './api';

export const newsletterService = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
};
