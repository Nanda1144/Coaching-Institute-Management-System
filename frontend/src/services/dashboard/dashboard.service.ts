import api from '../api';

const dashboardService = {
  async getAdminStats() {
    const { data } = await api.get('/dashboard/admin');
    return data;
  },

  async getFacultyStats(facultyId: string) {
    const { data } = await api.get(`/dashboard/faculty/${facultyId}`);
    return data;
  },

  async getStudentStats(studentId: string) {
    const { data } = await api.get(`/dashboard/student/${studentId}`);
    return data;
  },

  async getParentStats(parentId: string) {
    const { data } = await api.get(`/dashboard/parent/${parentId}`);
    return data;
  },

  async getRecentActivities(limit = 10) {
    const { data } = await api.get('/dashboard/recent-activities', { params: { limit } });
    return data;
  },
};

export default dashboardService;
