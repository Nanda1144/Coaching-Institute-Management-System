import * as db from '../../shared/utils/db';
import { getCached, setCache } from '../../shared/utils/cache';

const today = () => {
  const d = new Date(); d.setHours(0, 0, 0, 0); return d;
};
const tomorrow = () => {
  const d = today(); d.setDate(d.getDate() + 1); return d;
};

export const dashboardService = {
  async getAdminStats() {
    const cached = getCached<Record<string, unknown>>('admin-stats');
    if (cached) return cached;
    const d = today();
    const t = tomorrow();
    const [
      totalFaculty,
      activeFaculty,
      totalStudents,
      totalSubjects,
      totalClasses,
      todayAttendance,
      pendingAssignments,
      upcomingHolidays,
    ] = await Promise.all([
      db.count('faculty', [{ column: 'isDeleted', value: false }]),
      db.count('faculty', [{ column: 'isDeleted', value: false }, { column: 'status', value: 'active' }]),
      db.count('students', [{ column: 'isDeleted', value: false }]),
      db.count('subjects', [{ column: 'isDeleted', value: false }]),
      db.count('timetables', [{ column: 'isDeleted', value: false }]),
      db.count('attendances', [
        { column: 'attendanceDate', operator: '>=', value: d },
        { column: 'attendanceDate', operator: '<', value: t },
        { column: 'deletedAt', value: null },
      ]),
      db.count('assignments', [
        { column: 'status', value: 'active' },
        { column: 'deletedAt', value: null },
      ]),
      db.count('holidays', [
        { column: 'startDate', operator: '>=', value: d },
        { column: 'isDeleted', value: false },
      ]),
    ]);

    const holidayList = await db.findMany('holidays', {
      where: [
        { column: 'startDate', operator: '>=', value: d },
        { column: 'isDeleted', value: false },
      ],
      orderBy: [{ column: 'startDate', dir: 'ASC' }],
      limit: 5,
    });

    const result = {
      totalFaculty,
      activeFaculty,
      totalStudents,
      totalSubjects,
      totalClasses,
      todayAttendance,
      pendingAssignments,
      upcomingHolidays,
      holidays: holidayList,
    };
    setCache('admin-stats', result, 30000);
    return result;
  },

  async getFacultyStats(facultyId: string) {
    const cached = getCached<Record<string, unknown>>(`faculty-stats-${facultyId}`);
    if (cached) return cached;
    const faculty = await db.findUnique('faculty', [{ column: 'id', value: facultyId }]);
    if (!faculty) return null;

    const subjectIds = (faculty.assignedSubjects as string[]) || [];
    const batchIds = (faculty.assignedBatches as string[]) || [];
    const d = today();
    const t = tomorrow();

    const [
      totalStudents,
      totalClasses,
      todayAttendanceRecord,
      assignmentsDue,
      pendingEvaluations,
    ] = await Promise.all([
      batchIds.length > 0
        ? db.count('students', [
            { column: 'batchId', operator: 'IN', value: batchIds },
            { column: 'isDeleted', value: false },
          ])
        : Promise.resolve(0),
      db.count('timetables', [
        { column: 'facultyId', value: facultyId },
        { column: 'isDeleted', value: false },
      ]),
      db.count('attendances', [
        { column: 'facultyId', value: facultyId },
        { column: 'attendanceDate', operator: '>=', value: d },
        { column: 'attendanceDate', operator: '<', value: t },
        { column: 'deletedAt', value: null },
      ]),
      db.count('assignments', [
        { column: 'facultyId', value: facultyId },
        { column: 'status', value: 'active' },
        { column: 'deletedAt', value: null },
      ]),
      db.count('evaluations', [
        { column: 'facultyId', value: facultyId },
        { column: 'status', value: 'draft' },
      ]),
    ]);

    const result = {
      myClasses: totalClasses,
      myStudents: totalStudents,
      mySubjects: subjectIds.length,
      todayAttendanceRate: todayAttendanceRecord,
      assignmentsDue,
      pendingEvaluations,
    };
    setCache(`faculty-stats-${facultyId}`, result, 30000);
    return result;
  },

  async getStudentStats(studentId: string) {
    const d = today();
    const t = tomorrow();
    const student = await db.findUnique('students', [{ column: 'id', value: studentId }]);
    if (!student) return null;

    const totalAttendance = await db.count('attendances', [
      { column: 'studentId', value: studentId },
    ]);
    const presentAttendance = await db.count('attendance', [
      { column: 'studentId', value: studentId },
      { column: 'attendanceStatus', value: 'present' },
    ]);
    const attendanceRate = totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 0;

    const exams = await db.findMany('exams', {
      where: [
        { column: 'date', operator: '>=', value: d },
        { column: 'status', value: 'scheduled' },
      ],
      orderBy: [{ column: 'date', dir: 'ASC' }],
      limit: 5,
    });

    const pendingAssignments = await db.count('assignments', [
      { column: 'status', value: 'active' },
      { column: 'deletedAt', value: null },
    ]);

    const pendingFees = await db.count('fee_pending', [
      { column: 'roll', value: student.rollNumber || '' },
      { column: 'isDeleted', value: false },
    ]);

    const notifications = await db.count('notification_broadcasts', [
      { column: 'deletedAt', value: null },
    ]);

    const result = {
      attendanceRate,
      totalAttendance,
      presentAttendance,
      upcomingExams: exams,
      pendingAssignments,
      pendingFees,
      notifications,
      enrollment: {
        department: student.department,
        course: student.course,
        semester: student.semester,
        batch: student.batch,
      },
    };
    return result;
  },

  async getParentStats(parentId: string) {
    const parent = await db.findUnique('parents', [{ column: 'id', value: parentId }]);
    if (!parent) return null;

    const roll = parent.linkedRoll || parent.linkedStudent;
    const student = await db.findUnique('students', [{ column: 'rollNumber', value: roll }]);

    let attendanceRate = 0;
    let pendingFees = 0;
    let upcomingExams: any[] = [];
    let pendingAssignments = 0;

    if (student) {
      const totalAttendance = await db.count('attendances', [
        { column: 'studentId', value: student.id },
      ]);
      const presentAttendance = await db.count('attendance', [
        { column: 'studentId', value: student.id },
        { column: 'attendanceStatus', value: 'present' },
      ]);
      attendanceRate = totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 0;

      pendingFees = await db.count('fee_pending', [
        { column: 'roll', value: roll },
        { column: 'isDeleted', value: false },
      ]);

      upcomingExams = await db.findMany('exams', {
        where: [
          { column: 'date', operator: '>=', value: today() },
          { column: 'status', value: 'scheduled' },
        ],
        orderBy: [{ column: 'date', dir: 'ASC' }],
        limit: 5,
      });

      pendingAssignments = await db.count('assignments', [
        { column: 'status', value: 'active' },
        { column: 'deletedAt', value: null },
      ]);
    }

    const result = {
      attendanceRate,
      pendingFees,
      upcomingExams,
      pendingAssignments,
      studentName: student?.fullName || parent.fullName,
      studentRoll: roll,
      studentDepartment: student?.department || '',
      studentCourse: student?.course || '',
      studentSemester: student?.semester || null,
    };
    return result;
  },

  async getRecentActivities(limit = 10) {
    const logs = await db.findMany('assignment_logs', {
      orderBy: [{ column: 'createdAt', dir: 'DESC' }],
      limit,
      extraJoins: 'LEFT JOIN faculty ON assignment_logs.faculty_id = faculty.id',
      select: ['assignment_logs.*', 'faculty.first_name as faculty_first_name', 'faculty.last_name as faculty_last_name', 'faculty.faculty_id as faculty_employee_id'],
    });

    return logs;
  },
};
