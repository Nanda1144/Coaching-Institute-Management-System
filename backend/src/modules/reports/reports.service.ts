import * as db from '../../shared/utils/db';
import { query as rawQuery } from '../../config/database';

export const reportService = {
  async getAttendance(params?: { from?: string; to?: string; department?: string; batch?: string; subject?: string }) {
    const where: any[] = [];
    if (params?.from) where.push({ column: 'attendanceDate', value: params.from, operator: '>=' });
    if (params?.to) where.push({ column: 'attendanceDate', value: params.to, operator: '<=' });
    if (params?.batch) where.push({ column: 'batchId', value: params.batch });
    if (params?.subject) where.push({ column: 'subjectId', value: params.subject });

    const records = await db.findMany('attendances', {
      where,
      limit: 5000,
      orderBy: [{ column: 'attendanceDate', dir: 'DESC' }],
    });

    const total = records.length;
    const present = records.filter((r: any) => r.attendanceStatus === 'present').length;
    const absent = records.filter((r: any) => r.attendanceStatus === 'absent').length;
    const late = records.filter((r: any) => r.attendanceStatus === 'late').length;

    const groupedByDate = records.reduce((acc: any, r: any) => {
      const date = r.attendanceDate ? new Date(r.attendanceDate).toISOString().split('T')[0] : 'unknown';
      if (!acc[date]) acc[date] = { date, total: 0, present: 0, absent: 0, late: 0 };
      acc[date].total++;
      const status = r.attendanceStatus || 'unknown';
      if (acc[date][status] !== undefined) acc[date][status]++;
      else acc[date][status] = 1;
      return acc;
    }, {});

    return {
      summary: { total, present, absent, late, percentage: total ? Math.round((present / total) * 100) : 0 },
      groupedByDate: Object.values(groupedByDate),
      records,
    };
  },

  async getStudents(params?: { department?: string; batch?: string; course?: string; semester?: number; status?: string }) {
    const where: any[] = [];
    if (params?.department) where.push({ column: 'department', value: params.department });
    if (params?.batch) where.push({ column: 'batch', value: params.batch });
    if (params?.course) where.push({ column: 'course', value: params.course });
    if (params?.semester) where.push({ column: 'semester', value: params.semester });
    if (params?.status) where.push({ column: 'status', value: params.status });

    const [students, batches, courses, attendanceStats] = await Promise.all([
      db.findMany('students', { where, limit: 5000 }),
      db.findMany('batches'),
      db.findMany('courses'),
      rawQuery(
        `SELECT student_id, COUNT(*) as total, 
         COUNT(CASE WHEN attendance_status = 'present' THEN 1 END) as present_count
         FROM attendances 
         WHERE is_deleted = false 
         GROUP BY student_id`
      ),
    ]);

    const statsMap = new Map();
    for (const row of attendanceStats.rows) {
      statsMap.set(row.student_id, {
        total: parseInt(row.total, 10),
        present: parseInt(row.present_count, 10),
      });
    }

    const enrichedStudents = students.map((s: any) => {
      const stats = statsMap.get(s.id);
      return {
        ...s,
        attendanceStats: stats
          ? { total: stats.total, present: stats.present, percentage: Math.round((stats.present / stats.total) * 100) }
          : { total: 0, present: 0, percentage: 0 },
      };
    });

    return {
      totalStudents: students.length,
      totalBatches: batches.length,
      totalCourses: courses.length,
      activeStudents: students.filter((s: any) => s.status === 'active' || !s.status).length,
      students: enrichedStudents,
    };
  },

  async getFaculty(params?: { department?: string; status?: string; designation?: string }) {
    const where: any[] = [];
    if (params?.department) where.push({ column: 'department', value: params.department });
    if (params?.status) where.push({ column: 'status', value: params.status });
    if (params?.designation) where.push({ column: 'designation', value: params.designation });

    const faculty = await db.findMany('faculty', { where, limit: 5000 });

    const enriched = faculty.map((f: any) => {
      const batches = typeof f.assignedBatches === 'string' ? JSON.parse(f.assignedBatches) : (f.assignedBatches || []);
      const subjects = typeof f.assignedSubjects === 'string' ? JSON.parse(f.assignedSubjects) : (f.assignedSubjects || []);
      const courses = typeof f.assignedCourses === 'string' ? JSON.parse(f.assignedCourses) : (f.assignedCourses || []);
      return { ...f, assignedBatches: batches, assignedSubjects: subjects, assignedCourses: courses };
    });

    return {
      totalFaculty: enriched.length,
      activeFaculty: enriched.filter((f: any) => f.status === 'active' || !f.status).length,
      faculty: enriched,
    };
  },

  async getFees(params?: { from?: string; to?: string; status?: string; method?: string }) {
    const where: any[] = [];
    if (params?.from) where.push({ column: 'date', value: params.from, operator: '>=' });
    if (params?.to) where.push({ column: 'date', value: params.to, operator: '<=' });
    if (params?.status) where.push({ column: 'status', value: params.status });
    if (params?.method) where.push({ column: 'method', value: params.method });

    const [transactions, pendingRaw] = await Promise.all([
      db.findMany('fee_transactions', { where, limit: 5000, orderBy: [{ column: 'date', dir: 'DESC' }] }),
      db.findMany('fee_pending', { limit: 5000 }),
    ]);

    const totalCollected = transactions.reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
    const totalPending = pendingRaw.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

    const groupedByMethod = transactions.reduce((acc: any, t: any) => {
      const method = t.method || 'unknown';
      if (!acc[method]) acc[method] = { method, count: 0, total: 0 };
      acc[method].count++;
      acc[method].total += Number(t.amount || 0);
      return acc;
    }, {});

    return {
      summary: {
        totalCollected,
        totalTransactions: transactions.length,
        totalPending,
        pendingCount: pendingRaw.length,
      },
      groupedByMethod: Object.values(groupedByMethod),
      transactions,
      pending: pendingRaw,
    };
  },

  async getExams(params?: { from?: string; to?: string; status?: string; subject?: string; batch?: string }) {
    const where: any[] = [];
    if (params?.from) where.push({ column: 'date', value: params.from, operator: '>=' });
    if (params?.to) where.push({ column: 'date', value: params.to, operator: '<=' });
    if (params?.status) where.push({ column: 'status', value: params.status });
    if (params?.subject) where.push({ column: 'subject', value: params.subject });
    if (params?.batch) where.push({ column: 'batch', value: params.batch });

    const exams = await db.findMany('exams', {
      where,
      orderBy: [{ column: 'date', dir: 'DESC' }],
      limit: 5000,
    });

    const scheduled = exams.filter((e: any) => e.status === 'scheduled').length;
    const completed = exams.filter((e: any) => e.status === 'completed').length;
    const cancelled = exams.filter((e: any) => e.status === 'cancelled').length;

    return {
      summary: { totalExams: exams.length, scheduled, completed, cancelled },
      exams,
    };
  },

  async getStudentReport(params: { studentId?: string; from?: string; to?: string }) {
    const studentWhere: any[] = [];
    if (params?.studentId) studentWhere.push({ column: 'id', value: params.studentId });

    const students = await db.findMany('students', { where: studentWhere, limit: 1 });
    if (!students.length) return null;
    const student = students[0];

    const attWhere: any[] = [{ column: 'studentId', value: student.id }];
    if (params?.from) attWhere.push({ column: 'attendanceDate', value: params.from, operator: '>=' });
    if (params?.to) attWhere.push({ column: 'attendanceDate', value: params.to, operator: '<=' });

    const [attendanceRecords, submissions] = await Promise.all([
      db.findMany('attendances', { where: attWhere, limit: 2000 }),
      rawQuery(
        `SELECT s.id, s.assignment_id, s.status, s.submission_date, s.late_flag,
                e.marks_obtained, e.total_marks, e.grade, e.feedback
         FROM assignment_submissions s
         LEFT JOIN evaluations e ON e.submission_id = s.id
         WHERE s.student_id = $1 AND s.is_deleted = false
         ORDER BY s.submission_date DESC`,
        [student.id]
      ),
    ]);

    const totalAtt = attendanceRecords.length;
    const presentAtt = attendanceRecords.filter((r: any) => r.attendanceStatus === 'present').length;

    const feeWhere: any[] = [{ column: 'roll', value: student.rollNumber || student.studentId }];
    const fees = await db.findMany('fee_transactions', { where: feeWhere });

    return {
      student,
      attendance: {
        total: totalAtt,
        present: presentAtt,
        absent: totalAtt - presentAtt,
        percentage: totalAtt ? Math.round((presentAtt / totalAtt) * 100) : 0,
        records: attendanceRecords,
      },
      assignments: {
        total: submissions.rows.length,
        submitted: submissions.rows.filter((s: any) => s.status === 'submitted' || s.status === 'graded').length,
        graded: submissions.rows.filter((s: any) => s.status === 'graded').length,
        submissions: submissions.rows,
      },
      fees: {
        totalPaid: fees.reduce((sum: number, f: any) => sum + Number(f.amount || 0), 0),
        transactions: fees,
      },
    };
  },

  async getAllRecent() {
    const [attendance, students, faculty, fees, exams] = await Promise.all([
      this.getAttendance(),
      this.getStudents(),
      this.getFaculty(),
      this.getFees(),
      this.getExams(),
    ]);
    return { attendance, students, faculty, fees, exams };
  },
};
