import api from '../api';

const reminderService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/reminders', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/reminders/${id}`);
    return data;
  },

  async getMyReminders(facultyId: string) {
    const { data } = await api.get(`/reminders/my/${facultyId}`);
    return data;
  },

  async create(reminderData: Record<string, unknown>) {
    const { data } = await api.post('/reminders', reminderData);
    return data;
  },

  async update(id: string, reminderData: Record<string, unknown>) {
    const { data } = await api.patch(`/reminders/${id}`, reminderData);
    return data;
  },

  async markSent(id: string) {
    const { data } = await api.patch(`/reminders/${id}/sent`);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/reminders/${id}`);
    return data;
  },

  async bulkDelete(ids: string[]) {
    const { data } = await api.post('/reminders/bulk-delete', { ids });
    return data;
  },

  async bulkUpdate(ids: string[], updateData: Record<string, unknown>) {
    const { data } = await api.post('/reminders/bulk-update', { ids, ...updateData });
    return data;
  },

  async importData(records: Record<string, unknown>[]) {
    const { data } = await api.post('/reminders/import', { records });
    return data;
  },

  async exportData(params?: Record<string, unknown>) {
    const { data } = await api.get('/reminders/export', { params, responseType: 'blob' });
    return data;
  },
};

export default reminderService;
