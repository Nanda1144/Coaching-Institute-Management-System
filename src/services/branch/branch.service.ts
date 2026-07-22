import api from '../api';

const branchService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/branches', { params });
    return data;
  },

  async getList() {
    const { data } = await api.get('/branches/list');
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/branches/${id}`);
    return data;
  },

  async create(branchData: Record<string, unknown>) {
    const { data } = await api.post('/branches', branchData);
    return data;
  },

  async update(id: string, branchData: Record<string, unknown>) {
    const { data } = await api.put(`/branches/${id}`, branchData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/branches/${id}`);
    return data;
  },

  async toggleStatus(id: string, status: string) {
    const { data } = await api.patch(`/branches/${id}/status`, { status });
    return data;
  },

  async getAnalyticsSummary(params?: Record<string, unknown>) {
    const { data } = await api.get('/branches/analytics/summary', { params });
    return data;
  },

  async getAdmissionsTrend(params?: Record<string, unknown>) {
    const { data } = await api.get('/branches/analytics/admissions', { params });
    return data;
  },

  async getRevenueTrend(params?: Record<string, unknown>) {
    const { data } = await api.get('/branches/analytics/revenue', { params });
    return data;
  },

  async getAttendanceTrend(params?: Record<string, unknown>) {
    const { data } = await api.get('/branches/analytics/attendance', { params });
    return data;
  },
};

export default branchService;
