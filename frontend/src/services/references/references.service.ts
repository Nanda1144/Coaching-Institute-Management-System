import api from '../api';

const referencesService = {
  async getDepartments() {
    const { data } = await api.get('/references/departments');
    return data;
  },

  async createDepartment(deptData: Record<string, unknown>) {
    const { data } = await api.post('/references/departments', deptData);
    return data;
  },

  async updateDepartment(id: string, deptData: Record<string, unknown>) {
    const { data } = await api.put(`/references/departments/${id}`, deptData);
    return data;
  },

  async deleteDepartment(id: string) {
    const { data } = await api.delete(`/references/departments/${id}`);
    return data;
  },

  async getCourses() {
    const { data } = await api.get('/references/courses');
    return data;
  },

  async createCourse(courseData: Record<string, unknown>) {
    const { data } = await api.post('/references/courses', courseData);
    return data;
  },

  async updateCourse(id: string, courseData: Record<string, unknown>) {
    const { data } = await api.put(`/references/courses/${id}`, courseData);
    return data;
  },

  async deleteCourse(id: string) {
    const { data } = await api.delete(`/references/courses/${id}`);
    return data;
  },

  async getBatches() {
    const { data } = await api.get('/references/batches');
    return data;
  },

  async getFaculty() {
    const { data } = await api.get('/references/faculty');
    return data;
  },
};

export default referencesService;
