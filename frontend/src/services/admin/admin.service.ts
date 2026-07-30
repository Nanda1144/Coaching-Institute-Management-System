import api from '../api';

const adminService = {
  async listUsers(params?: Record<string, unknown>) {
    const { data } = await api.get('/admin/users', { params });
    return data;
  },

  async updatePermissions(userId: string, permissions: Record<string, unknown>) {
    const { data } = await api.put(`/admin/users/${userId}/permissions`, permissions);
    return data;
  },
};

export default adminService;
