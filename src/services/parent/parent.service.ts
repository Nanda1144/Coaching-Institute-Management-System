import api from '../api';

const parentService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/parents', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/parents/${id}`);
    return data;
  },

  async create(parentData: Record<string, unknown>) {
    const { data } = await api.post('/parents', parentData);
    return data;
  },

  async update(id: string, parentData: Record<string, unknown>) {
    const { data } = await api.patch(`/parents/${id}`, parentData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/parents/${id}`);
    return data;
  },
};

export default parentService;
