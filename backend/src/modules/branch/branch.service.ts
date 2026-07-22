import { query } from '../../config/database';
import * as db from '../../shared/utils/db';

export const branchService = {
  async getAll(params: any) {
    const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'DESC' } = params;
    const conditions: any[] = [];
    if (status) conditions.push({ column: 'status', value: status });
    if (search) conditions.push({ column: 'branchName', value: search, operator: 'ILIKE' });
    const records = await db.findMany('branches', {
      where: conditions,
      orderBy: [{ column: sortBy, dir: sortOrder }],
      offset: (page - 1) * limit,
      limit,
    });
    const total = await db.count('branches', conditions);
    return { data: records, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) };
  },

  async getList() {
    return db.findMany('branches', { where: [{ column: 'status', value: 'active' }], select: ['id', 'branchName', 'branchCode'] });
  },

  async getById(id: string) {
    return db.findUnique('branches', [{ column: 'id', value: id }]);
  },

  async create(data: any) {
    return db.create('branches', data);
  },

  async update(id: string, data: any) {
    return db.update('branches', [{ column: 'id', value: id }], data);
  },

  async delete(id: string) {
    return db.remove('branches', [{ column: 'id', value: id }], false);
  },

  async toggleStatus(id: string, status: string) {
    return db.update('branches', [{ column: 'id', value: id }], { status });
  },

  async getAnalyticsSummary(params: any) {
    const { branchId } = params;
    const branchFilter = branchId ? ` WHERE id = '${branchId}'` : '';
    const [students, revenue, attendance, exams, admissions, faculty] = await Promise.all([
      query(`SELECT COUNT(*) as count FROM students${branchFilter}`),
      query(`SELECT COALESCE(SUM(amount), 0) as total FROM fee_transactions WHERE status = 'paid'`),
      query(`SELECT COALESCE(AVG(CASE WHEN attendance_status = 'present' THEN 100.0 ELSE 0 END), 0) as pct FROM attendances`),
      query(`SELECT COALESCE(AVG(CASE WHEN grade IS NOT NULL THEN 1.0 ELSE 0 END), 0) * 100 as pct FROM evaluations`),
      query(`SELECT COUNT(*) as count FROM students WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)`),
      query(`SELECT COUNT(*) as count FROM faculty${branchFilter}`),
    ]);
    return {
      totalStudents: parseInt(students.rows[0]?.count || '0'),
      totalRevenue: parseFloat(revenue.rows[0]?.total || '0'),
      attendancePercentage: Math.round(parseFloat(attendance.rows[0]?.pct || '0') * 100) / 100,
      examPassPercentage: Math.round(parseFloat(exams.rows[0]?.pct || '0') * 100) / 100,
      newAdmissions: parseInt(admissions.rows[0]?.count || '0'),
      activeFaculty: parseInt(faculty.rows[0]?.count || '0'),
    };
  },

  async getAdmissionsTrend(params: any) {
    const { branchId } = params;
    const branchFilter = branchId ? ` WHERE id = '${branchId}'` : '';
    const result = await query(
      `SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as value FROM students${branchFilter} GROUP BY month ORDER BY month LIMIT 12`
    );
    return result.rows;
  },

  async getRevenueTrend(params: any) {
    const result = await query(
      `SELECT TO_CHAR(created_at, 'YYYY-MM') as month, SUM(amount) as value FROM fee_transactions WHERE status = 'paid' GROUP BY month ORDER BY month LIMIT 12`
    );
    return result.rows;
  },

  async getAttendanceTrend(params: any) {
    const result = await query(
      `SELECT TO_CHAR(attendance_date, 'YYYY-MM') as month, ROUND(AVG(CASE WHEN attendance_status = 'present' THEN 100 ELSE 0 END), 1) as value FROM attendances GROUP BY month ORDER BY month LIMIT 12`
    );
    return result.rows;
  },
};
