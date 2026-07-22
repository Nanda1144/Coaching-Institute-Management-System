import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';

export class FingerprintAttendanceService {
  async markAttendance(data: {
    sessionId: string;
    fingerprintId: string;
    studentId: string;
    scannerId?: string;
    metadata?: Record<string, unknown>;
  }, userId: string) {
    const record = await db.create('fingerprint_attendances', {
      sessionId: data.sessionId,
      fingerprintId: data.fingerprintId,
      studentId: data.studentId,
      scannerId: data.scannerId,
      metadata: data.metadata ?? {},
      recognitionTime: new Date().toISOString(),
      createdById: userId,
    });
    return record;
  }

  async verifyFingerprint(sessionId: string, fingerprintId: string, status: 'verified' | 'failed', userId: string) {
    const record = await db.findFirst('fingerprint_attendances', {
      where: [
        { column: 'sessionId', value: sessionId },
        { column: 'fingerprintId', value: fingerprintId },
      ],
    });
    if (!record) throw AppError.notFound('Fingerprint attendance record not found');

    const updated = await db.update('fingerprint_attendances', [{ column: 'id', value: record.id }], {
      verificationStatus: status,
      recognitionTime: new Date().toISOString(),
    });
    return updated;
  }

  async getSession(id: string) {
    const session = await db.findUnique('fingerprint_attendances', [{ column: 'id', value: id }]);
    if (!session) throw AppError.notFound('Fingerprint session not found');
    return session;
  }
}

export const fingerprintAttendanceService = new FingerprintAttendanceService();
