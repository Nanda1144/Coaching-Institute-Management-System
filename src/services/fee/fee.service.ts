import api from '../api';

const feeService = {
  async getTransactions(params?: Record<string, unknown>) {
    const { data } = await api.get('/fees/transactions', { params });
    return data;
  },

  async getPending() {
    const { data } = await api.get('/fees/pending');
    return data;
  },

  async getStructure() {
    const { data } = await api.get('/fees/structure');
    return data;
  },
};

export default feeService;
