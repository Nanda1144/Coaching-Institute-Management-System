import * as db from '../../shared/utils/db';
import { query } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';

const TABLE_NAME = 'exam_results';

async function ensureTable(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS "${TABLE_NAME}" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "exam_id" TEXT NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      "student_id" TEXT NOT NULL REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      "student_name" TEXT NOT NULL DEFAULT '',
      "roll_number" TEXT NOT NULL DEFAULT '',
      "marks_obtained" DECIMAL(65,30) NOT NULL DEFAULT 0,
      "total_marks" INTEGER NOT NULL DEFAULT 0,
      "grade" TEXT,
      "remarks" TEXT,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE("exam_id", "student_id")
    );
  `);
}

export const examMarksService = {
  async getMarks(examId: string) {
    await ensureTable();
    const marks = await db.findMany(TABLE_NAME, {
      where: [{ column: 'exam_id', value: examId }],
      orderBy: [{ column: 'roll_number', dir: 'ASC' }],
    });
    return marks ?? [];
  },

  async uploadMarks(examId: string, marks: Array<{
    studentId: string;
    studentName: string;
    rollNumber: string;
    marksObtained: number;
    totalMarks: number;
    grade?: string;
  }>, userId: string) {
    await ensureTable();
    const existing = await db.findMany(TABLE_NAME, {
      where: [{ column: 'exam_id', value: examId }],
    });

    for (const row of marks) {
      const exists = existing?.find((e: any) => e.student_id === row.studentId);
      if (exists) {
        await db.update(TABLE_NAME, [{ column: 'id', value: exists.id }], {
          marks_obtained: row.marksObtained,
          total_marks: row.totalMarks,
          grade: row.grade ?? null,
          student_name: row.studentName,
          roll_number: row.rollNumber,
          updated_at: new Date().toISOString(),
        });
      } else {
        await db.create(TABLE_NAME, {
          exam_id: examId,
          student_id: row.studentId,
          student_name: row.studentName,
          roll_number: row.rollNumber,
          marks_obtained: row.marksObtained,
          total_marks: row.totalMarks,
          grade: row.grade ?? null,
        });
      }
    }

    await db.update('exams', [{ column: 'id', value: examId }], {
      status: 'completed',
      max_marks: marks[0]?.totalMarks ?? 0,
    });

    return this.getMarks(examId);
  },

  async getStudentMarks(studentId: string) {
    await ensureTable();
    return db.findMany(TABLE_NAME, {
      where: [{ column: 'student_id', value: studentId }],
      orderBy: [{ column: 'created_at', dir: 'DESC' }],
    });
  },
};
