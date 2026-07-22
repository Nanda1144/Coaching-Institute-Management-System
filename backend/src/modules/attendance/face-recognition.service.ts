import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';

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
    const session = await db.create('face_recognitions', {
      sessionId: data.sessionId,
      studentId: data.studentId,
      attendanceId: data.attendanceId,
      imageUrl: data.imageUrl,
      confidence: data.confidence ?? 0,
      deviceId: data.deviceId,
      metadata: data.metadata ?? {},
      recognitionTime: new Date().toISOString(),
      createdById: userId,
    });
    return session;
  }

  async verifyRecognition(sessionId: string, studentId: string, confidence: number, userId: string) {
    const record = await db.findFirst('face_recognitions', {
      where: [
        { column: 'sessionId', value: sessionId },
        { column: 'studentId', value: studentId },
      ],
    });
    if (!record) throw AppError.notFound('Face recognition record not found');

    const verified = confidence >= 0.7;
    const updated = await db.update('face_recognitions', [{ column: 'id', value: record.id }], {
      confidence,
      status: verified ? 'verified' : 'failed',
      recognitionTime: new Date().toISOString(),
    });
    return updated;
  }

  async getSession(id: string) {
    const session = await db.findUnique('face_recognitions', [{ column: 'id', value: id }]);
    if (!session) throw AppError.notFound('Face recognition session not found');
    return session;
  }
}

export const faceRecognitionService = new FaceRecognitionService();
