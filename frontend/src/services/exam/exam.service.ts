import api from '../api';

const examService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/exams', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/exams/${id}`);
    return data;
  },

  async create(examData: Record<string, unknown>) {
    const { data } = await api.post('/exams', examData);
    return data;
  },

  async update(id: string, examData: Record<string, unknown>) {
    const { data } = await api.patch(`/exams/${id}`, examData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/exams/${id}`);
    return data;
  },
};

export default examService;
