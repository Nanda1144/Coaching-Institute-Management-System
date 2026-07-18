import api, { refreshApi } from '../api';

const authService = {
  async login(credentials: { email: string; password: string }) {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  async register(registrationData: Record<string, unknown>) {
    const { data } = await api.post('/auth/register', registrationData);
    return data;
  },

  async refreshToken() {
    const { data } = await refreshApi.post('/auth/refresh-token', {});
    return data;
  },

  async logout() {
    const { data } = await api.post('/auth/logout', {});
    return data;
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

export default authService;
