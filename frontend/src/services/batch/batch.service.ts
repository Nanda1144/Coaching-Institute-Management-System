import api from '../api';

const batchService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/batches', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/batches/${id}`);
    return data;
  },

  async create(batchData: Record<string, unknown>) {
    const { data } = await api.post('/batches', batchData);
    return data;
  },

  async update(id: string, batchData: Record<string, unknown>) {
    const { data } = await api.put(`/batches/${id}`, batchData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/batches/${id}`);
    return data;
  },
};

export default batchService;
