import crypto from 'crypto';
import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';
import { studentFaceService } from './student-face.service';
import { attendanceService } from './attendance.service';

function generateAttendanceCode(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ATT-${y}${m}${d}-${rand}`;
}

export class FaceRecognitionService {
  async scanAndMarkAttendance(data: {
    faceImage: string;
    confidence?: number;
    deviceId?: string;
    metadata?: Record<string, unknown>;
  }, userId: string) {
    const match = await studentFaceService.findMatch(data.faceImage, 0.7);
    if (!match) {
      throw AppError.notFound('No matching face found. Please enroll this student first.');
    }

    const existing = await db.findFirst('face_recognitions', {
      where: [
        { column: 'studentId', value: match.studentId },
        { column: 'createdById', value: userId },
        { column: 'recognitionTime', operator: 'gte', value: new Date(new Date().setHours(0, 0, 0, 0)) },
      ],
    });
    if (existing) {
      throw AppError.conflict('Attendance already marked for this student today via face recognition.');
    }

    const student = await db.findUnique('students', [{ column: 'id', value: match.studentId }], ['id', 'full_name', 'roll_number', 'department', 'batch', 'profile_image']);
    if (!student) throw AppError.notFound('Student not found');

    const sessionId = crypto.randomUUID();
    const faculty = await db.findUnique('faculty', [{ column: 'id', value: userId }]);
    let subjectId = data.metadata?.subjectId as string | undefined;
    let batchId = data.metadata?.batchId as string | undefined;
    if (faculty) {
      const subs = faculty.assignedSubjects as string[] | undefined;
      const batches = faculty.assignedBatches as string[] | undefined;
      if (!subjectId && subs?.length) subjectId = subs[0];
      if (!batchId && batches?.length) batchId = batches[0];
    }

    const attendance = await attendanceService.create({
      studentId: match.studentId,
      subjectId: subjectId || '',
      batchId: batchId || student.batch || '',
      classroomId: '',
      attendanceDate: new Date().toISOString(),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      attendanceMethod: 'face_recognition',
      attendanceStatus: 'present',
    }, userId);

    const session = await db.create('face_recognitions', {
      sessionId,
      studentId: match.studentId,
      attendanceId: attendance.id,
      imageUrl: data.faceImage,
      confidence: match.similarity,
      deviceId: data.deviceId,
      metadata: data.metadata ?? {},
      recognitionTime: new Date().toISOString(),
      status: 'verified',
      createdById: userId,
    });

    return {
      session,
      attendance,
      student,
      similarity: match.similarity,
    };
  }

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
