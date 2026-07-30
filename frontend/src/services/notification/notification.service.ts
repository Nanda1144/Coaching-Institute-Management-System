import api from '../api';

const notificationService = {
  async getHistory() {
    const { data } = await api.get('/notifications/history');
    return data;
  },

  async send(notificationData: Record<string, unknown>) {
    const { data } = await api.post('/notifications', notificationData);
    return data;
  },
};

export default notificationService;
