import api from '../api';

const materialService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/materials', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/materials/${id}`);
    return data;
  },

  async create(materialData: Record<string, unknown>) {
    const { data } = await api.post('/materials', materialData);
    return data;
  },

  async update(id: string, materialData: Record<string, unknown>) {
    const { data } = await api.patch(`/materials/${id}`, materialData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/materials/${id}`);
    return data;
  },

  async bulkDelete(ids: string[]) {
    const { data } = await api.post('/materials/bulk-delete', { ids });
    return data;
  },

  async bulkUpdate(ids: string[], updateData: Record<string, unknown>) {
    const { data } = await api.post('/materials/bulk-update', { ids, ...updateData });
    return data;
  },

  async importData(records: Record<string, unknown>[]) {
    const { data } = await api.post('/materials/import', { records });
    return data;
  },

  async exportData(params?: Record<string, unknown>) {
    const { data } = await api.get('/materials/export', { params, responseType: 'blob' });
    return data;
  },

  async recordDownload(id: string, downloadData: Record<string, unknown>) {
    const { data } = await api.post(`/materials/${id}/download`, downloadData);
    return data;
  },

  async getByFaculty(facultyId: string) {
    const { data } = await api.get(`/materials/faculty/${facultyId}`);
    return data;
  },

  async getCategories() {
    const { data } = await api.get('/materials/categories');
    return data;
  },
};

export default materialService;
