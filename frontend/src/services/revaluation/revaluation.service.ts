import api from '../api';

const revaluationService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/revaluations', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/revaluations/${id}`);
    return data;
  },

  async getTimeline(id: string) {
    const { data } = await api.get(`/revaluations/${id}/timeline`);
    return data;
  },

  async create(revaluationData: Record<string, unknown>) {
    const { data } = await api.post('/revaluations', revaluationData);
    return data;
  },

  async updateStatus(id: string, statusData: Record<string, unknown>) {
    const { data } = await api.patch(`/revaluations/${id}/status`, statusData);
    return data;
  },
};

export default revaluationService;
