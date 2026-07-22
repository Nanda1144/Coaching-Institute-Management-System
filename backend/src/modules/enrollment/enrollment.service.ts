import { query } from '../../config/database';
import * as db from '../../shared/utils/db';

export const enrollmentService = {
  async getAll(params: any) {
    const { page = 1, limit = 10, status, studentId, courseId, sortBy = 'createdAt', sortOrder = 'DESC' } = params;
    const conditions: any[] = [];
    if (status) conditions.push({ column: 'status', value: status });
    if (studentId) conditions.push({ column: 'studentId', value: studentId });
    if (courseId) conditions.push({ column: 'courseId', value: courseId });
    const records = await db.findMany('enrollments', {
      where: conditions,
      orderBy: [{ column: sortBy, dir: sortOrder }],
      offset: (page - 1) * limit,
      limit,
    });
    const total = await db.count('enrollments', conditions);
    return { data: records, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    return db.findUnique('enrollments', [{ column: 'id', value: id }]);
  },

  async create(data: any) {
    const courseResult = await query(`SELECT enrolled_count, maximum_capacity FROM courses WHERE id = $1`, [data.courseId]);
    const course = courseResult.rows[0];
    if (!course) throw new Error('Course not found');
    if (course.maximum_capacity && (course.enrolled_count || 0) >= course.maximum_capacity) {
      throw new Error('Course has reached maximum capacity');
    }
    const dup = await db.findUnique('enrollments', [{ column: 'studentId', value: data.studentId }, { column: 'courseId', value: data.courseId }]);
    if (dup) throw new Error('Student already enrolled in this course');
    const [enrollment] = await Promise.all([
      db.create('enrollments', {
        studentId: data.studentId,
        courseId: data.courseId,
        enrollmentDate: data.enrollmentDate ? new Date(data.enrollmentDate) : new Date(),
        status: data.status || 'enrolled',
      }),
      query(`UPDATE courses SET enrolled_count = COALESCE(enrolled_count, 0) + 1 WHERE id = $1`, [data.courseId]),
    ]);
    return enrollment;
  },

  async delete(id: string) {
    const enrollment = await db.findUnique('enrollments', [{ column: 'id', value: id }]);
    if (!enrollment) throw new Error('Enrollment not found');
    await Promise.all([
      db.remove('enrollments', [{ column: 'id', value: id }], false),
      query(`UPDATE courses SET enrolled_count = GREATEST(COALESCE(enrolled_count, 1) - 1, 0) WHERE id = $1`, [enrollment.courseId]),
    ]);
    return { deleted: true };
  },

  async updateStatus(id: string, status: string) {
    return db.update('enrollments', [{ column: 'id', value: id }], { status });
  },
};
