import api from '../api';

const evaluationService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/evaluations', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/evaluations/${id}`);
    return data;
  },

  async getByFaculty(facultyId: string) {
    const { data } = await api.get(`/evaluations/faculty/${facultyId}`);
    return data;
  },

  async create(evaluationData: Record<string, unknown>) {
    const { data } = await api.post('/evaluations', evaluationData);
    return data;
  },

  async update(id: string, evaluationData: Record<string, unknown>) {
    const { data } = await api.patch(`/evaluations/${id}`, evaluationData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/evaluations/${id}`);
    return data;
  },

  async publish(id: string) {
    const { data } = await api.patch(`/evaluations/${id}/publish`);
    return data;
  },

  async bulkDelete(ids: string[]) {
    const { data } = await api.post('/evaluations/bulk-delete', { ids });
    return data;
  },

  async bulkUpdate(ids: string[], updateData: Record<string, unknown>) {
    const { data } = await api.post('/evaluations/bulk-update', { ids, ...updateData });
    return data;
  },

  async importData(records: Record<string, unknown>[]) {
    const { data } = await api.post('/evaluations/import', { records });
    return data;
  },

  async exportData(params?: Record<string, unknown>) {
    const { data } = await api.get('/evaluations/export', { params, responseType: 'blob' });
    return data;
  },
};

export default evaluationService;
