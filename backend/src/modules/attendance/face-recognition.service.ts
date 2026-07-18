import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import { Prisma } from '@prisma/client';

export class FaceRecognitionService {
  async createSession(data: {
    sessionId: string;
    studentId: string;
    attendanceId?: string;
    imageUrl?: string;
    confidence?: number;
    deviceId?: string;
    metadata?: Record<string, unknown>;
  }, userId: string) {
    const session = await prisma.faceRecognition.create({
      data: {
        sessionId: data.sessionId,
        studentId: data.studentId,
        attendanceId: data.attendanceId,
        imageUrl: data.imageUrl,
        confidence: data.confidence ?? 0,
        deviceId: data.deviceId,
        metadata: (data.metadata ?? {}) as Prisma.InputJsonValue,
        recognitionTime: new Date().toISOString(),
        createdById: userId,
      },
      include: { student: true, attendance: true },
    });
    return session;
  }

  async verifyRecognition(sessionId: string, studentId: string, confidence: number, userId: string) {
    const record = await prisma.faceRecognition.findFirst({
      where: { sessionId, studentId },
    });
    if (!record) throw AppError.notFound('Face recognition record not found');

    const verified = confidence >= 0.7;
    const updated = await prisma.faceRecognition.update({
      where: { id: record.id },
      data: {
        confidence,
        status: verified ? 'verified' : 'failed',
        recognitionTime: new Date().toISOString(),
      },
      include: { student: true, attendance: true },
    });
    return updated;
  }

  async getSession(id: string) {
    const session = await prisma.faceRecognition.findUnique({
      where: { id },
      include: { student: true, attendance: true, createdBy: true },
    });
    if (!session) throw AppError.notFound('Face recognition session not found');
    return session;
  }
}

export const faceRecognitionService = new FaceRecognitionService();
