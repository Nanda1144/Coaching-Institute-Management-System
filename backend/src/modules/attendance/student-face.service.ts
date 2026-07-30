import crypto from 'crypto';
import * as db from '../../shared/utils/db';
import { query } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';

async function ensureTable(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS student_faces (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL UNIQUE REFERENCES students(id),
      face_image TEXT NOT NULL,
      face_hash TEXT,
      is_active BOOLEAN DEFAULT true,
      metadata JSONB DEFAULT '{}',
      enrolled_by_id TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function computeImageHash(base64Image: string): string {
  return crypto.createHash('sha256').update(base64Image).digest('hex').substring(0, 16);
}

function compareImages(base64A: string, base64B: string): number {
  try {
    const rawA = Buffer.from(base64A.split(',')[1] || base64A, 'base64');
    const rawB = Buffer.from(base64B.split(',')[1] || base64B, 'base64');
    const size = Math.min(rawA.length, rawB.length, 4096);
    let diff = 0;
    for (let i = 0; i < size; i++) {
      diff += Math.abs(rawA[i] - rawB[i]);
    }
    const maxDiff = size * 255;
    return 1 - (diff / maxDiff);
  } catch {
    return 0;
  }
}

export class StudentFaceService {
  async enroll(data: {
    studentId: string;
    faceImage: string;
    metadata?: Record<string, unknown>;
  }, userId: string) {
    await ensureTable();

    const existing = await db.findUnique('student_faces', [{ column: 'studentId', value: data.studentId }]);
    if (existing) {
      await db.update('student_faces',
        [{ column: 'studentId', value: data.studentId }],
        {
          faceImage: data.faceImage,
          faceHash: computeImageHash(data.faceImage),
          metadata: data.metadata ?? {},
          enrolledById: userId,
        }
      );
      return { ...existing, faceImage: data.faceImage, message: 'Face updated' };
    }

    const enrolled = await db.create('student_faces', {
      studentId: data.studentId,
      faceImage: data.faceImage,
      faceHash: computeImageHash(data.faceImage),
      metadata: data.metadata ?? {},
      enrolledById: userId,
      isActive: true,
    });
    return enrolled;
  }

  async findMatch(faceImage: string, threshold = 0.85): Promise<{ studentId: string; similarity: number } | null> {
    await ensureTable();
    const enrolled = await db.findMany('student_faces', {
      where: [{ column: 'isActive', value: true }],
    });
    if (!enrolled.length) return null;
    let bestMatch: { studentId: string; similarity: number } | null = null;
    for (const e of enrolled) {
      if (!e.faceImage) continue;
      const similarity = compareImages(faceImage, e.faceImage);
      if (similarity >= threshold && (!bestMatch || similarity > bestMatch.similarity)) {
        bestMatch = { studentId: e.studentId, similarity };
      }
    }
    return bestMatch;
  }

  async getEnrolledStudents() {
    await ensureTable();
    const faces = await db.findMany('student_faces', {
      where: [{ column: 'isActive', value: true }],
    });
    const studentIds = faces.map((f: any) => f.studentId);
    if (!studentIds.length) return [];
    const students = await Promise.all(
      studentIds.map((sid: string) =>
        db.findUnique('students', [{ column: 'id', value: sid }], ['id', 'full_name', 'roll_number', 'department', 'batch', 'profile_image'])
      )
    );
    return faces.map((f: any) => {
      const s = students.find((st: any) => st?.id === f.studentId);
      return { ...f, student: s || null };
    });
  }

  async unenroll(studentId: string) {
    const existing = await db.findUnique('student_faces', [{ column: 'studentId', value: studentId }]);
    if (!existing) throw AppError.notFound('Student face not found');
    await db.update('student_faces', [{ column: 'studentId', value: studentId }], { isActive: false });
    return { message: 'Face unenrolled' };
  }
}

export const studentFaceService = new StudentFaceService();
