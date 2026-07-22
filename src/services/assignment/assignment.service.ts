import api from '../api';

const assignmentService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/assignments', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/assignments/${id}`);
    return data;
  },

  async create(assignmentData: Record<string, unknown>) {
    const { data } = await api.post('/assignments', assignmentData);
    return data;
  },

  async update(id: string, assignmentData: Record<string, unknown>) {
    const { data } = await api.patch(`/assignments/${id}`, assignmentData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/assignments/${id}`);
    return data;
  },

  async bulkDelete(ids: string[]) {
    const { data } = await api.post('/assignments/bulk-delete', { ids });
    return data;
  },

  async bulkUpdate(ids: string[], updateData: Record<string, unknown>) {
    const { data } = await api.post('/assignments/bulk-update', { ids, ...updateData });
    return data;
  },

  async importData(records: Record<string, unknown>[]) {
    const { data } = await api.post('/assignments/import', { records });
    return data;
  },

  async exportData(params?: Record<string, unknown>) {
    const { data } = await api.get('/assignments/export', { params, responseType: 'blob' });
    return data;
  },

  async getByFaculty(facultyId: string) {
    const { data } = await api.get(`/assignments/faculty/${facultyId}`);
    return data;
  },
};

export default assignmentService;
