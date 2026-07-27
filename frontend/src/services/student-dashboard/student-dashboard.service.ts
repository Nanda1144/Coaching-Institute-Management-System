import api from '../api';

const studentDashboardService = {
  async getOverview() {
    const { data } = await api.get('/student-dashboard/overview');
    return data;
  },

  async getAttendance(month?: number, year?: number) {
    const { data } = await api.get('/student-dashboard/attendance', { params: { month, year } });
    return data;
  },

  async getTimetable() {
    const { data } = await api.get('/student-dashboard/timetable');
    return data;
  },

  async getAssignments() {
    const { data } = await api.get('/student-dashboard/assignments');
    return data;
  },

  async getMarks() {
    const { data } = await api.get('/student-dashboard/marks');
    return data;
  },

  async getMaterials() {
    const { data } = await api.get('/student-dashboard/materials');
    return data;
  },

  async getFees() {
    const { data } = await api.get('/student-dashboard/fees');
    return data;
  },

  async getNotifications() {
    const { data } = await api.get('/student-dashboard/notifications');
    return data;
  },

  async markNotificationRead(id: string) {
    const { data } = await api.patch(`/student-dashboard/notifications/${id}/read`);
    return data;
  },

  async getCertificates() {
    const { data } = await api.get('/student-dashboard/certificates');
    return data;
  },
};

export default studentDashboardService;
