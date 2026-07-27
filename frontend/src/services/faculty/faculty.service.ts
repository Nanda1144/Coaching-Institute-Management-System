import api from '../api';

const facultyService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/faculty', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/faculty/${id}`);
    return data;
  },

  async create(facultyData: Record<string, unknown>) {
    const { data } = await api.post('/faculty', facultyData);
    return data;
  },

  async update(id: string, facultyData: Record<string, unknown>) {
    const { data } = await api.patch(`/faculty/${id}`, facultyData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/faculty/${id}`);
    return data;
  },

  async bulkDelete(ids: string[]) {
    const { data } = await api.post('/faculty/bulk-delete', { ids });
    return data;
  },

  async bulkUpdate(ids: string[], updateData: Record<string, unknown>) {
    const { data } = await api.post('/faculty/bulk-update', { ids, ...updateData });
    return data;
  },

  async importData(records: Record<string, unknown>[]) {
    const { data } = await api.post('/faculty/import', { records });
    return data;
  },

  async exportData(params?: Record<string, unknown>) {
    const { data } = await api.get('/faculty/export', { params, responseType: 'blob' });
    return data;
  },

  async getProfile() {
    const { data } = await api.get('/faculty/profile');
    return data;
  },

  async getDashboardStats() {
    const { data } = await api.get('/faculty/dashboard');
    return data;
  },
};

export default facultyService;
