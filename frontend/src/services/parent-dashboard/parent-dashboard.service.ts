import api from '../api';

const parentDashboardService = {
  async getOverview() {
    const { data } = await api.get('/parent-dashboard/overview');
    return data;
  },

  async getAttendance(month?: number, year?: number) {
    const { data } = await api.get('/parent-dashboard/attendance', { params: { month, year } });
    return data;
  },

  async getTimetable() {
    const { data } = await api.get('/parent-dashboard/timetable');
    return data;
  },

  async getAssignments() {
    const { data } = await api.get('/parent-dashboard/assignments');
    return data;
  },

  async getMarks() {
    const { data } = await api.get('/parent-dashboard/marks');
    return data;
  },

  async getMaterials() {
    const { data } = await api.get('/parent-dashboard/materials');
    return data;
  },

  async getFees() {
    const { data } = await api.get('/parent-dashboard/fees');
    return data;
  },

  async getNotifications() {
    const { data } = await api.get('/parent-dashboard/notifications');
    return data;
  },

  async updateProfile(body: { fullName?: string; email?: string; phone?: string; address?: string }) {
    const { data } = await api.patch('/parent-dashboard/profile', body);
    return data;
  },

  async changePassword(body: { currentPassword: string; newPassword: string }) {
    const { data } = await api.patch('/parent-dashboard/change-password', body);
    return data;
  },
};

export default parentDashboardService;
