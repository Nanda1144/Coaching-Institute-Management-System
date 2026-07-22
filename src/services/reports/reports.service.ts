import api from '../api'

export const reportService = {
  async getAll() {
    const { data } = await api.get('/reports')
    return data
  },
  getAttendance(params?: { from?: string; to?: string }) {
    return api.get('/reports/attendance', { params })
  },
  getStudents() {
    return api.get('/reports/students')
  },
  getFaculty() {
    return api.get('/reports/faculty')
  },
  getFees() {
    return api.get('/reports/fees')
  },
  getExams() {
    return api.get('/reports/exams')
  },
}

export default reportService
