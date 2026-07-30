import api from '../api';

const cloudDocumentsService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/cloud-documents', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/cloud-documents/${id}`);
    return data;
  },

  async upload(formData: FormData) {
    const { data } = await api.post('/cloud-documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/cloud-documents/${id}`);
    return data;
  },

  async getByStudent(studentId: string) {
    const { data } = await api.get(`/cloud-documents/student/${studentId}`);
    return data;
  },
};

export default cloudDocumentsService;
