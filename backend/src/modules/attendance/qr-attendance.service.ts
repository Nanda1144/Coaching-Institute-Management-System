import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import { AttendanceMethod, AttendanceStatus, Prisma, QRStatus } from '@prisma/client';

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

    const session = await prisma.qRSession.create({
      data: {
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
      },
      include: { subject: true, batch: true, classroom: true },
    });
    return session;
  }

  async scanQR(data: { qrToken: string; studentId: string }, userId: string) {
    const session = await prisma.qRSession.findUnique({
      where: { qrToken: data.qrToken },
    });
    if (!session) throw AppError.notFound('QR session not found');
    if (session.status !== 'active') throw AppError.badRequest('QR session is no longer active');
    if (new Date() > new Date(session.expiryTime)) {
      await prisma.qRSession.update({
        where: { id: session.id },
        data: { status: 'expired' as QRStatus },
      });
      throw AppError.badRequest('QR session has expired');
    }

    const existingScan = await prisma.qRScan.findFirst({
      where: { qrSessionId: session.id, studentId: data.studentId },
    });
    if (existingScan) throw AppError.conflict('Student has already scanned this QR');

    const attendanceCode = `ATT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const attendance = await prisma.attendance.create({
      data: {
        attendanceCode,
        studentId: data.studentId,
        facultyId: session.facultyId,
        subjectId: session.subjectId,
        batchId: session.batchId,
        classroomId: session.classroomId,
        attendanceDate: new Date().toISOString(),
        startTime: session.startTime,
        endTime: session.endTime,
        attendanceMethod: 'qr_code' as AttendanceMethod,
        attendanceStatus: 'present' as AttendanceStatus,
        createdById: userId,
        updatedById: userId,
      },
    });

    const scan = await prisma.qRScan.create({
      data: {
        qrSessionId: session.id,
        studentId: data.studentId,
        attendanceId: attendance.id,
        scannedAt: new Date(),
        status: 'completed',
      },
      include: { qrSession: true, student: true, attendance: true },
    });

    return scan;
  }

  async getSession(id: string) {
    const session = await prisma.qRSession.findUnique({
      where: { id },
      include: {
        subject: true,
        batch: true,
        classroom: true,
        scans: { include: { student: true } },
      },
    });
    if (!session) throw AppError.notFound('QR session not found');
    return session;
  }

  async getActiveSessions(facultyId: string) {
    const sessions = await prisma.qRSession.findMany({
      where: {
        facultyId,
        status: 'active' as QRStatus,
        expiryTime: { gte: new Date() },
      },
      include: {
        subject: true,
        batch: true,
        classroom: true,
        scans: { include: { student: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return sessions;
  }
}

export const qrAttendanceService = new QrAttendanceService();
