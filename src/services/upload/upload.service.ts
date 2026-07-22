import api from '../api';

const uploadService = {
  async uploadFile(file: File, metadata?: Record<string, unknown>) {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/upload', { params });
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/upload/${id}`);
    return data;
  },

  async bulkDelete(ids: string[]) {
    const { data } = await api.post('/upload/bulk-delete', { ids });
    return data;
  },
};

export default uploadService;
