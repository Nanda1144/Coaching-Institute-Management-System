import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import { Prisma } from '@prisma/client';

async function getOverview(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { batchRef: { select: { id: true, batchName: true } } },
  });
  if (!student) throw AppError.notFound('Student not found');

  const [totalClasses, attendedClasses, pendingAssignments, totalAssignments] = await Promise.all([
    prisma.attendance.count({ where: { studentId, isDeleted: false } }),
    prisma.attendance.count({ where: { studentId, isDeleted: false, attendanceStatus: 'present' } }),
    prisma.assignment.count({
      where: {
        batchId: student.batchId ?? '',
        status: 'active',
        isDeleted: false,
        submissions: { none: { studentId } },
      },
    }),
    prisma.assignment.count({
      where: { batchId: student.batchId ?? '', isDeleted: false, status: 'active' },
    }),
  ]);

  const fees = await prisma.fee.aggregate({
    where: { studentId },
    _sum: { amount: true, paidAmount: true },
  });

  return {
    student: {
      id: student.id,
      fullName: student.fullName,
      studentId: student.studentId,
      email: student.email,
      phone: student.phone,
      rollNumber: student.rollNumber,
      department: student.department,
      course: student.course,
      semester: student.semester,
      batch: student.batch,
      section: student.section,
      profileImage: student.profileImage,
    },
    stats: {
      totalClasses,
      attendedClasses,
      attendancePercent: totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0,
      pendingAssignments,
      totalAssignments,
      feesTotal: fees._sum.amount ?? 0,
      feesPaid: fees._sum.paidAmount ?? 0,
    },
  };
}

async function getAttendance(studentId: string, month?: number, year?: number) {
  const where: any = { studentId, isDeleted: false };
  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    where.attendanceDate = { gte: start, lte: end };
  }

  const records = await prisma.attendance.findMany({
    where,
    include: { subject: { select: { id: true, subjectName: true, subjectCode: true } } },
    orderBy: { attendanceDate: 'desc' },
  });

  const total = records.length;
  const present = records.filter((r) => r.attendanceStatus === 'present').length;
  const absent = records.filter((r) => r.attendanceStatus === 'absent').length;
  const late = records.filter((r) => r.attendanceStatus === 'late').length;

  return {
    records,
    summary: { total, present, absent, late, percent: total > 0 ? Math.round((present / total) * 100) : 0 },
  };
}

async function getTimetable(studentId: string) {
  const student = await prisma.student.findUnique({ where: { id: studentId }, select: { batchId: true, semester: true, department: true } });
  if (!student) throw AppError.notFound('Student not found');

  const timetables = await prisma.timetable.findMany({
    where: {
      batchId: student.batchId ?? undefined,
      semester: student.semester,
      department: student.department,
      status: 'scheduled',
    },
    include: {
      subjectRef: { select: { id: true, subjectName: true, subjectCode: true } },
      classroom: { select: { id: true, building: true, roomNumber: true } },
      faculty: { select: { id: true, fullName: true } },
    },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });

  const grouped: Record<string, typeof timetables> = {};
  for (const t of timetables) {
    if (!grouped[t.dayOfWeek]) grouped[t.dayOfWeek] = [];
    grouped[t.dayOfWeek].push(t);
  }

  return grouped;
}

async function getAssignments(studentId: string) {
  const student = await prisma.student.findUnique({ where: { id: studentId }, select: { batchId: true } });
  if (!student) throw AppError.notFound('Student not found');

  const assignments = await prisma.assignment.findMany({
    where: { batchId: student.batchId ?? '', isDeleted: false, status: 'active' },
    include: {
      subject: { select: { id: true, subjectName: true, subjectCode: true } },
      faculty: { select: { id: true, fullName: true } },
      submissions: { where: { studentId, isDeleted: false } },
      _count: { select: { submissions: { where: { studentId } } } },
    },
    orderBy: { dueDate: 'asc' },
  });

  return assignments.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    subjectName: a.subject?.subjectName,
    subjectCode: a.subject?.subjectCode,
    facultyName: a.faculty?.fullName,
    totalMarks: a.totalMarks,
    publishDate: a.publishDate,
    dueDate: a.dueDate,
    status: a.status,
    submitted: a._count.submissions > 0,
    submission: a.submissions[0] ?? null,
  }));
}

async function getMarks(studentId: string) {
  const submissions = await prisma.assignmentSubmission.findMany({
    where: { studentId, isDeleted: false, status: 'graded' },
    include: {
      assignment: {
        select: { id: true, title: true, totalMarks: true, subject: { select: { subjectName: true } } },
      },
      evaluations: {
        select: { marksObtained: true, totalMarks: true, grade: true, feedback: true, evaluationDate: true },
      },
    },
    orderBy: { submissionDate: 'desc' },
  });

  return submissions
    .filter((s) => s.evaluations)
    .map((s) => ({
      assignmentTitle: s.assignment.title,
      subjectName: s.assignment.subject?.subjectName,
      marksObtained: s.evaluations?.marksObtained,
      totalMarks: s.evaluations?.totalMarks ?? s.assignment.totalMarks,
      grade: s.evaluations?.grade,
      feedback: s.evaluations?.feedback,
      evaluationDate: s.evaluations?.evaluationDate,
    }));
}

async function getMaterials(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { batchId: true, department: true, course: true, semester: true },
  });
  if (!student) throw AppError.notFound('Student not found');

  const materials = await prisma.studyMaterial.findMany({
    where: {
      OR: [
        { batchId: student.batchId ?? undefined },
        { departmentId: student.department },
        { courseId: student.course },
      ],
      semesterId: String(student.semester),
      visibility: { in: ['PUBLIC', 'STUDENTS_ONLY', 'BATCH_ONLY'] },
    },
    include: {
      subject: { select: { id: true, subjectName: true, subjectCode: true } },
      chapter: { select: { id: true, chapterName: true } },
      uploadedBy: { select: { id: true, fullName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return materials;
}

async function getFees(studentId: string) {
  const fees = await prisma.fee.findMany({
    where: { studentId },
    orderBy: [{ semester: 'asc' }, { dueDate: 'asc' }],
    include: { student: { select: { fullName: true, rollNumber: true } } },
  });

  const summary = fees.reduce(
    (acc, f) => ({
      totalAmount: acc.totalAmount + Number(f.amount),
      totalPaid: acc.totalPaid + Number(f.paidAmount),
      pending: acc.pending + (Number(f.amount) - Number(f.paidAmount)),
    }),
    { totalAmount: 0, totalPaid: 0, pending: 0 }
  );

  return { fees, summary };
}

async function getNotifications(studentId: string) {
  const student = await prisma.student.findUnique({ where: { id: studentId }, select: { batchId: true } });
  if (!student) throw AppError.notFound('Student not found');

  const notifications = await prisma.notification.findMany({
    where: {
      OR: [{ studentId }, { studentId: null, batchId: student.batchId ?? undefined }],
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return { notifications, unreadCount };
}

async function markNotificationRead(notificationId: string, studentId: string) {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, studentId },
  });
  if (!notification) throw AppError.notFound('Notification not found');

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export const studentDashboardService = {
  getOverview,
  getAttendance,
  getTimetable,
  getAssignments,
  getMarks,
  getMaterials,
  getFees,
  getNotifications,
  markNotificationRead,
};
