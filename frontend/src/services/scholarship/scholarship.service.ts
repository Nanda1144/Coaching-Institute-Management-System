import api from '../api';

const scholarshipService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/scholarships', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/scholarships/${id}`);
    return data;
  },

  async create(scholarshipData: Record<string, unknown>) {
    const { data } = await api.post('/scholarships', scholarshipData);
    return data;
  },

  async update(id: string, scholarshipData: Record<string, unknown>) {
    const { data } = await api.put(`/scholarships/${id}`, scholarshipData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/scholarships/${id}`);
    return data;
  },
};

export default scholarshipService;
