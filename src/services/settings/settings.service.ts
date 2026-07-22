import api from '../api';

const settingsService = {
  async getSettings() {
    const { data } = await api.get('/settings');
    return data;
  },

  async updateSettings(section: string, values: Record<string, unknown>) {
    const { data } = await api.patch(`/settings/${section}`, values);
    return data;
  },
};

export default settingsService;
