import api from '../api';

const studentService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/students', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/students/${id}`);
    return data;
  },

  async create(studentData: Record<string, unknown>) {
    const { data } = await api.post('/students', studentData);
    return data;
  },

  async update(id: string, studentData: Record<string, unknown>) {
    const { data } = await api.patch(`/students/${id}`, studentData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/students/${id}`);
    return data;
  },
};

export default studentService;
