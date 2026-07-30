import api from '../api';

const admissionService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/admissions', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/admissions/${id}`);
    return data;
  },

  async create(admissionData: Record<string, unknown>) {
    const { data } = await api.post('/admissions', admissionData);
    return data;
  },

  async update(id: string, admissionData: Record<string, unknown>) {
    const { data } = await api.put(`/admissions/${id}`, admissionData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/admissions/${id}`);
    return data;
  },

  async checkEligibility(criteria: Record<string, unknown>) {
    const { data } = await api.post('/admissions/course-eligibility/check', criteria);
    return data;
  },

  async enroll(enrollmentData: Record<string, unknown>) {
    const { data } = await api.post('/admissions/course-enrollment', enrollmentData);
    return data;
  },

  async getBatchCapacity(batchId: string) {
    const { data } = await api.get(`/admissions/batches/${batchId}/capacity`);
    return data;
  },

  async enrollInBatch(batchId: string, studentData: Record<string, unknown>) {
    const { data } = await api.post(`/admissions/batches/${batchId}/enroll`, studentData);
    return data;
  },
};

export default admissionService;
