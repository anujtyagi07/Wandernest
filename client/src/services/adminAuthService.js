import adminApi from './adminApi';

export const adminAuthService = {
  login: (data) => adminApi.post('/auth/login', data),
  logout: () => adminApi.post('/auth/logout'),
  getProfile: () => adminApi.get('/auth/profile'),
};
