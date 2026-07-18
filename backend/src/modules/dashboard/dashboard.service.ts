import { prisma } from '../../config/database';
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
      prisma.faculty.count({ where: { isDeleted: false } }),
      prisma.faculty.count({ where: { isDeleted: false, status: 'active' } }),
      prisma.student.count({ where: { isDeleted: false } }),
      prisma.subject.count({ where: { isDeleted: false } }),
      prisma.timetable.count({ where: { isDeleted: false } }),
      prisma.attendance.count({
        where: { attendanceDate: { gte: d, lt: t }, deletedAt: null },
      }),
      prisma.assignment.count({ where: { status: 'active', deletedAt: null } }),
      prisma.holiday.count({
        where: { startDate: { gte: d }, isDeleted: false },
      }),
    ]);

    const holidayList = await prisma.holiday.findMany({
      where: { startDate: { gte: d }, isDeleted: false },
      orderBy: { startDate: 'asc' },
      take: 5,
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
    const faculty = await prisma.faculty.findUnique({ where: { id: facultyId } });
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
        ? prisma.student.count({ where: { batchId: { in: batchIds }, isDeleted: false } })
        : Promise.resolve(0),
      prisma.timetable.count({ where: { facultyId, isDeleted: false } }),
      prisma.attendance.count({
        where: { facultyId, attendanceDate: { gte: d, lt: t }, deletedAt: null },
      }),
      prisma.assignment.count({
        where: { facultyId, status: 'active', deletedAt: null },
      }),
      prisma.evaluation.count({
        where: { facultyId, status: 'draft' },
      }),
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

  async getRecentActivities(limit = 10) {
    const logs = await prisma.assignmentLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        faculty: { select: { id: true, firstName: true, lastName: true, facultyId: true } },
      },
    });
    return logs;
  },
};
