import api from '../api';

const homeworkService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/homework', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/homework/${id}`);
    return data;
  },

  async getByFaculty(facultyId: string) {
    const { data } = await api.get(`/homework/faculty/${facultyId}`);
    return data;
  },

  async create(homeworkData: Record<string, unknown>) {
    const { data } = await api.post('/homework', homeworkData);
    return data;
  },

  async update(id: string, homeworkData: Record<string, unknown>) {
    const { data } = await api.patch(`/homework/${id}`, homeworkData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/homework/${id}`);
    return data;
  },

  async bulkDelete(ids: string[]) {
    const { data } = await api.post('/homework/bulk-delete', { ids });
    return data;
  },

  async bulkUpdate(ids: string[], updateData: Record<string, unknown>) {
    const { data } = await api.post('/homework/bulk-update', { ids, ...updateData });
    return data;
  },

  async importData(records: Record<string, unknown>[]) {
    const { data } = await api.post('/homework/import', { records });
    return data;
  },

  async exportData(params?: Record<string, unknown>) {
    const { data } = await api.get('/homework/export', { params, responseType: 'blob' });
    return data;
  },
};

export default homeworkService;
