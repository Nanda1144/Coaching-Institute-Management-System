import api from '../api';

const timetableService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/timetable', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/timetable/${id}`);
    return data;
  },

  async getByFaculty(facultyId: string) {
    const { data } = await api.get(`/timetable/faculty/${facultyId}`);
    return data;
  },

  async getByDay(facultyId: string, dayOfWeek: string) {
    const { data } = await api.get(`/timetable/faculty/${facultyId}/day/${dayOfWeek}`);
    return data;
  },

  async create(timetableData: Record<string, unknown>) {
    const { data } = await api.post('/timetable', timetableData);
    return data;
  },

  async update(id: string, timetableData: Record<string, unknown>) {
    const { data } = await api.patch(`/timetable/${id}`, timetableData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/timetable/${id}`);
    return data;
  },

  async bulkDelete(ids: string[]) {
    const { data } = await api.post('/timetable/bulk-delete', { ids });
    return data;
  },

  async bulkUpdate(ids: string[], updateData: Record<string, unknown>) {
    const { data } = await api.post('/timetable/bulk-update', { ids, ...updateData });
    return data;
  },

  async importData(records: Record<string, unknown>[]) {
    const { data } = await api.post('/timetable/import', { records });
    return data;
  },

  async exportData(params?: Record<string, unknown>) {
    const { data } = await api.get('/timetable/export', { params, responseType: 'blob' });
    return data;
  },
};

export default timetableService;
