import api from '../api';

const attendanceService = {
  async getAll(params?: Record<string, unknown>) {
    const { data } = await api.get('/attendance', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/attendance/${id}`);
    return data;
  },

  async create(attendanceData: Record<string, unknown>) {
    const { data } = await api.post('/attendance', attendanceData);
    return data;
  },

  async update(id: string, attendanceData: Record<string, unknown>) {
    const { data } = await api.patch(`/attendance/${id}`, attendanceData);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/attendance/${id}`);
    return data;
  },

  async getTodayAttendance() {
    const { data } = await api.get('/attendance/today');
    return data;
  },

  async getAttendanceStats(params?: Record<string, unknown>) {
    const { data } = await api.get('/attendance/stats', { params });
    return data;
  },

  async createFaceRecognition(faceData: Record<string, unknown>) {
    const { data } = await api.post('/attendance/face-recognition/session', faceData);
    return data;
  },

  async verifyFaceRecognition(sessionId: string, verificationData: Record<string, unknown>) {
    const { data } = await api.patch(`/attendance/face-recognition/${sessionId}/verify`, verificationData);
    return data;
  },

  async markFingerprint(fingerprintData: Record<string, unknown>) {
    const { data } = await api.post('/attendance/fingerprint/mark', fingerprintData);
    return data;
  },

  async verifyFingerprint(sessionId: string, verificationData: Record<string, unknown>) {
    const { data } = await api.patch(`/attendance/fingerprint/${sessionId}/verify`, verificationData);
    return data;
  },

  async createQRSession(qrData: Record<string, unknown>) {
    const { data } = await api.post('/attendance/qr/session', qrData);
    return data;
  },

  async scanQR(scanData: Record<string, unknown>) {
    const { data } = await api.post('/attendance/qr/scan', scanData);
    return data;
  },

  async getActiveQRSessions() {
    const { data } = await api.get('/attendance/qr/active');
    return data;
  },

  async requestCorrection(correctionData: Record<string, unknown>) {
    const { data } = await api.post('/attendance/corrections', correctionData);
    return data;
  },

  async approveCorrection(id: string) {
    const { data } = await api.patch(`/attendance/corrections/${id}/approve`);
    return data;
  },

  async rejectCorrection(id: string) {
    const { data } = await api.patch(`/attendance/corrections/${id}/reject`);
    return data;
  },

  async getCorrections(params?: Record<string, unknown>) {
    const { data } = await api.get('/attendance/corrections', { params });
    return data;
  },

  async bulkDelete(ids: string[]) {
    const { data } = await api.post('/attendance/bulk-delete', { ids });
    return data;
  },

  async bulkUpdate(ids: string[], updateData: Record<string, unknown>) {
    const { data } = await api.post('/attendance/bulk-update', { ids, ...updateData });
    return data;
  },

  async importData(records: Record<string, unknown>[]) {
    const { data } = await api.post('/attendance/import', { records });
    return data;
  },

  async exportData(params?: Record<string, unknown>) {
    const { data } = await api.get('/attendance/export', { params, responseType: 'blob' });
    return data;
  },
};

export default attendanceService;
