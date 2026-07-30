import api from '../api';

const enrollmentService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/enrollments', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/enrollments/${id}`);
    return data;
  },

  async create(enrollmentData: Record<string, unknown>) {
    const { data } = await api.post('/enrollments', enrollmentData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/enrollments/${id}`);
    return data;
  },

  async updateStatus(id: string, status: string) {
    const { data } = await api.patch(`/enrollments/${id}/status`, { status });
    return data;
  },
};

export default enrollmentService;
