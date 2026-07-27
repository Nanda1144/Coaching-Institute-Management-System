import api from '../api';

const submissionService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/submissions', { params });
    return data;
  },

  async getByAssignment(assignmentId: string) {
    const { data } = await api.get(`/submissions/assignment/${assignmentId}`);
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/submissions/${id}`);
    return data;
  },

  async create(submissionData: Record<string, unknown>) {
    const { data } = await api.post('/submissions', submissionData);
    return data;
  },

  async update(id: string, submissionData: Record<string, unknown>) {
    const { data } = await api.patch(`/submissions/${id}`, submissionData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/submissions/${id}`);
    return data;
  },

  async grade(id: string, gradeData: Record<string, unknown>) {
    const { data } = await api.patch(`/submissions/${id}/grade`, gradeData);
    return data;
  },

  async bulkDelete(ids: string[]) {
    const { data } = await api.post('/submissions/bulk-delete', { ids });
    return data;
  },

  async bulkUpdate(ids: string[], updateData: Record<string, unknown>) {
    const { data } = await api.post('/submissions/bulk-update', { ids, ...updateData });
    return data;
  },

  async importData(records: Record<string, unknown>[]) {
    const { data } = await api.post('/submissions/import', { records });
    return data;
  },

  async exportData(params?: Record<string, unknown>) {
    const { data } = await api.get('/submissions/export', { params, responseType: 'blob' });
    return data;
  },
};

export default submissionService;
