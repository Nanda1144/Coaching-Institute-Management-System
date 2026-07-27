import api from '../api';

const facultyTransferService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/faculty-transfers', { params });
    return data;
  },

  async getByFaculty(facultyId: string) {
    const { data } = await api.get(`/faculty-transfers/faculty/${facultyId}`);
    return data;
  },

  async create(transferData: Record<string, unknown>) {
    const { data } = await api.post('/faculty-transfers', transferData);
    return data;
  },

  async updateStatus(id: string, status: Record<string, unknown>) {
    const { data } = await api.patch(`/faculty-transfers/${id}/status`, status);
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/faculty-transfers/${id}`);
    return data;
  },

  async bulkDelete(ids: string[]) {
    const { data } = await api.post('/faculty-transfers/bulk-delete', { ids });
    return data;
  },

  async importData(records: Record<string, unknown>[]) {
    const { data } = await api.post('/faculty-transfers/import', { records });
    return data;
  },

  async exportData(params?: Record<string, unknown>) {
    const { data } = await api.get('/faculty-transfers/export', { params, responseType: 'blob' });
    return data;
  },
};

export default facultyTransferService;
