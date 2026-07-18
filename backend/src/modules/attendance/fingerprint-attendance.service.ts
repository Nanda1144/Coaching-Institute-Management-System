import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import { FingerprintStatus, Prisma } from '@prisma/client';

export class FingerprintAttendanceService {
  async markAttendance(data: {
    sessionId: string;
    fingerprintId: string;
    studentId: string;
    scannerId?: string;
    metadata?: Record<string, unknown>;
  }, userId: string) {
    const record = await prisma.fingerprintAttendance.create({
      data: {
        sessionId: data.sessionId,
        fingerprintId: data.fingerprintId,
        studentId: data.studentId,
        scannerId: data.scannerId,
        metadata: (data.metadata ?? {}) as Prisma.InputJsonValue,
        recognitionTime: new Date().toISOString(),
        createdById: userId,
      },
      include: { student: true, attendance: true },
    });
    return record;
  }

  async verifyFingerprint(sessionId: string, fingerprintId: string, status: 'verified' | 'failed', userId: string) {
    const record = await prisma.fingerprintAttendance.findFirst({
      where: { sessionId, fingerprintId },
    });
    if (!record) throw AppError.notFound('Fingerprint attendance record not found');

    const updated = await prisma.fingerprintAttendance.update({
      where: { id: record.id },
      data: {
        verificationStatus: status as FingerprintStatus,
        recognitionTime: new Date().toISOString(),
      },
      include: { student: true, attendance: true },
    });
    return updated;
  }

  async getSession(id: string) {
    const session = await prisma.fingerprintAttendance.findUnique({
      where: { id },
      include: { student: true, attendance: true, createdBy: true },
    });
    if (!session) throw AppError.notFound('Fingerprint session not found');
    return session;
  }
}

export const fingerprintAttendanceService = new FingerprintAttendanceService();
