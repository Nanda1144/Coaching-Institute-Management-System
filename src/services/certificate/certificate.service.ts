import api from '../api';

const certificateService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/certificates', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/certificates/${id}`);
    return data;
  },

  async getPreview(id: string) {
    const { data } = await api.get(`/certificates/${id}/preview`);
    return data;
  },

  async getPlaceholders(id: string) {
    const { data } = await api.get(`/certificates/${id}/placeholders`);
    return data;
  },

  async download(id: string, format = 'pdf') {
    const { data } = await api.get(`/certificates/${id}/download`, {
      params: { format },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate-${id}.${format}`;
    link.click();
    window.URL.revokeObjectURL(url);
  },

  async create(certData: Record<string, unknown>) {
    const { data } = await api.post('/certificates', certData);
    return data;
  },

  async update(id: string, certData: Record<string, unknown>) {
    const { data } = await api.put(`/certificates/${id}`, certData);
    return data;
  },

  async updatePlaceholders(id: string, placeholders: Record<string, unknown>[]) {
    const { data } = await api.patch(`/certificates/${id}/placeholders`, { placeholders });
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/certificates/${id}`);
    return data;
  },
};

export default certificateService;
