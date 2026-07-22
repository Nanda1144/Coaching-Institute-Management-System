import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';

function generateQrToken(): string {
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `QR-${rand}`;
}

export class QrAttendanceService {
  async createSession(data: {
    subjectId: string;
    batchId: string;
    classroomId?: string;
    startTime: string;
    endTime: string;
  }, userId: string) {
    const qrToken = generateQrToken();
    const now = new Date();
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    const expiryTime = new Date(end.getTime() + 5 * 60 * 1000);

    const session = await db.create('qr_sessions', {
      qrToken,
      facultyId: userId,
      subjectId: data.subjectId,
      batchId: data.batchId,
      classroomId: data.classroomId ?? '',
      attendanceDate: now,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      expiryTime,
      createdById: userId,
    });
    return session;
  }

  async scanQR(data: { qrToken: string; studentId: string }, userId: string) {
    const session = await db.findUnique('qr_sessions', [{ column: 'qrToken', value: data.qrToken }]);
    if (!session) throw AppError.notFound('QR session not found');
    if (session.status !== 'active') throw AppError.badRequest('QR session is no longer active');
    if (new Date() > new Date(session.expiryTime)) {
      await db.update('qr_sessions', [{ column: 'id', value: session.id }], { status: 'expired' });
      throw AppError.badRequest('QR session has expired');
    }

    const existingScan = await db.findFirst('qr_scans', {
      where: [
        { column: 'qrSessionId', value: session.id },
        { column: 'studentId', value: data.studentId },
      ],
    });
    if (existingScan) throw AppError.conflict('Student has already scanned this QR');

    const attendanceCode = `ATT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return db.transact(async () => {
      const attendance = await db.create('attendances', {
        attendanceCode,
        studentId: data.studentId,
        facultyId: session.facultyId,
        subjectId: session.subjectId,
        batchId: session.batchId,
        classroomId: session.classroomId,
        attendanceDate: new Date().toISOString(),
        startTime: session.startTime,
        endTime: session.endTime,
        attendanceMethod: 'qr_code',
        attendanceStatus: 'present',
        createdById: userId,
        updatedById: userId,
      });

      const scan = await db.create('qr_scans', {
        qrSessionId: session.id,
        studentId: data.studentId,
        attendanceId: attendance.id,
        scannedAt: new Date(),
        status: 'completed',
      });

      return scan;
    });
  }

  async getSession(id: string) {
    const session = await db.findUnique('qr_sessions', [{ column: 'id', value: id }]);
    if (!session) throw AppError.notFound('QR session not found');

    const scans = await db.findMany('qr_scans', {
      where: [{ column: 'qrSessionId', value: id }],
    });

    return { ...session, scans: scans ?? [] };
  }

  async getActiveSessions(facultyId: string) {
    const sessions = await db.findMany('qr_sessions', {
      where: [
        { column: 'facultyId', value: facultyId },
        { column: 'status', value: 'active' },
      ],
      extraWhere: { sql: `"expiry_time" >= $1`, params: [new Date().toISOString()] },
      orderBy: [{ column: 'createdAt', dir: 'DESC' }],
    });
    return sessions ?? [];
  }
}

export const qrAttendanceService = new QrAttendanceService();
