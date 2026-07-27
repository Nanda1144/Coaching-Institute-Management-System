import api from '../api';

const paymentService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/payments', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/payments/${id}`);
    return data;
  },

  async getByStudent(studentId: string) {
    const { data } = await api.get(`/payments/student/${studentId}`);
    return data;
  },

  async getSummary() {
    const { data } = await api.get('/payments/summary');
    return data;
  },

  async getHistory(params?: Record<string, unknown>) {
    const { data } = await api.get('/payments/history', { params });
    return data;
  },

  async create(paymentData: Record<string, unknown>) {
    const { data } = await api.post('/payments', paymentData);
    return data;
  },

  async update(id: string, paymentData: Record<string, unknown>) {
    const { data } = await api.patch(`/payments/${id}`, paymentData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/payments/${id}`);
    return data;
  },

  async processRefund(id: string, refundData: Record<string, unknown>) {
    const { data } = await api.post(`/payments/${id}/refund`, refundData);
    return data;
  },
};

export default paymentService;
