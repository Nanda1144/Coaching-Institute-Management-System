import api from '../api';

const holidayService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/holidays', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/holidays/${id}`);
    return data;
  },

  async create(holidayData: Record<string, unknown>) {
    const { data } = await api.post('/holidays', holidayData);
    return data;
  },

  async update(id: string, holidayData: Record<string, unknown>) {
    const { data } = await api.patch(`/holidays/${id}`, holidayData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/holidays/${id}`);
    return data;
  },

  async bulkDelete(ids: string[]) {
    const { data } = await api.post('/holidays/bulk-delete', { ids });
    return data;
  },

  async bulkUpdate(ids: string[], updateData: Record<string, unknown>) {
    const { data } = await api.post('/holidays/bulk-update', { ids, ...updateData });
    return data;
  },

  async importData(records: Record<string, unknown>[]) {
    const { data } = await api.post('/holidays/import', { records });
    return data;
  },

  async exportData(params?: Record<string, unknown>) {
    const { data } = await api.get('/holidays/export', { params, responseType: 'blob' });
    return data;
  },

  async getStats() {
    const { data } = await api.get('/holidays/stats');
    return data;
  },

  async getSpecialEvents() {
    const { data } = await api.get('/holidays/special-events');
    return data;
  },
};

export default holidayService;
