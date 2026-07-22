import bcrypt from 'bcrypt';
import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';

async function getParentWithStudent(parentId: string) {
  const parent = await db.findUnique('parents', [{ column: 'id', value: parentId }]);
  if (!parent) throw AppError.notFound('Parent not found');

  const student = await db.findFirst('students', {
    where: [
      { column: 'rollNumber', value: parent.linkedRoll ?? '' },
      { column: 'isDeleted', value: false },
    ],
  });

  return { parent, student, studentId: student?.id };
}

async function getOverview(parentId: string) {
  const { parent, student, studentId } = await getParentWithStudent(parentId);
  if (!student || !studentId) {
    return { parent, student: null, stats: null };
  }

  const [totalClasses, attendedClasses, pendingAssignments] = await Promise.all([
    db.count('attendance', [
      { column: 'studentId', value: studentId },
      { column: 'isDeleted', value: false },
    ]),
    db.count('attendance', [
      { column: 'studentId', value: studentId },
      { column: 'isDeleted', value: false },
      { column: 'attendanceStatus', value: 'present' },
    ]),
    db.count('assignments', [
      { column: 'batchId', value: student.batchId ?? '' },
      { column: 'status', value: 'active' },
      { column: 'isDeleted', value: false },
    ]),
  ]);

  return {
    parent,
    student: {
      id: student.id,
      fullName: student.fullName,
      studentId: student.studentId,
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
    },
    fullName: student.fullName,
    department: student.department,
    year: student.course,
    rollNumber: student.rollNumber,
    batch: student.batch,
    email: student.email,
    phone: student.phone,
    dateOfBirth: student.dateOfBirth,
  };
}

async function getAttendance(parentId: string, month?: number, year?: number) {
  const { studentId } = await getParentWithStudent(parentId);
  if (!studentId) {
    return { overall: 0, present: 0, total: 0, subjects: [], recent: [], records: [], summary: { total: 0, present: 0, absent: 0, late: 0, percent: 0 } };
  }

  const where: any[] = [
    { column: 'studentId', value: studentId },
    { column: 'isDeleted', value: false },
  ];
  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    where.push({ column: 'attendanceDate', operator: 'gte', value: start });
    where.push({ column: 'attendanceDate', operator: 'lte', value: end });
  }

  const records = await db.findMany('attendance', {
    where,
    orderBy: [{ column: 'attendanceDate', dir: 'desc' }],
  });

  const total = records.length;
  const present = records.filter((r: any) => r.attendanceStatus === 'present').length;
  const absent = records.filter((r: any) => r.attendanceStatus === 'absent').length;
  const late = records.filter((r: any) => r.attendanceStatus === 'late').length;

  const subjects = records.reduce((acc: any[], r: any) => {
    const existing = acc.find((s) => s.name === r.subject);
    if (existing) {
      existing.total += 1;
      if (r.attendanceStatus === 'present') existing.present += 1;
    } else {
      acc.push({
        name: r.subject || 'General',
        total: 1,
        present: r.attendanceStatus === 'present' ? 1 : 0,
        percentage: 0,
      });
    }
    return acc;
  }, []);
  subjects.forEach((s: any) => { s.percentage = s.total > 0 ? Math.round((s.present / s.total) * 100) : 0; });

  const recent = records.slice(0, 10).map((r: any) => ({
    date: r.attendanceDate || r.date,
    subject: r.subject || 'General',
    status: r.attendanceStatus || r.status || 'absent',
  }));

  const overall = total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    overall,
    present,
    total,
    subjects,
    recent,
    records,
    summary: { total, present, absent, late, percent: overall },
  };
}

async function getTimetable(parentId: string) {
  const { student, studentId } = await getParentWithStudent(parentId);
  if (!student || !studentId) return [];

  const timetables = await db.findMany('timetables', {
    where: [
      { column: 'batchId', value: student.batchId ?? undefined },
      { column: 'semester', value: student.semester },
      { column: 'department', value: student.department },
      { column: 'status', value: 'scheduled' },
    ],
    orderBy: [{ column: 'dayOfWeek', dir: 'asc' }, { column: 'startTime', dir: 'asc' }],
  });

  const grouped: Record<string, typeof timetables> = {};
  for (const t of timetables) {
    if (!grouped[t.dayOfWeek]) grouped[t.dayOfWeek] = [];
    grouped[t.dayOfWeek].push(t);
  }

  const schedule = Object.entries(grouped).map(([day, classes]) => ({
    day,
    classes: classes.map((c: any) => ({
      time: `${c.startTime || ''}${c.endTime ? ' - ' + c.endTime : ''}`,
      subject: c.subject || c.subjectName || 'N/A',
      faculty: c.facultyName || c.faculty || 'N/A',
      room: c.room || c.classroom || 'N/A',
    })),
  }));

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  schedule.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

  return schedule;
}

async function getAssignments(parentId: string) {
  const { student, studentId } = await getParentWithStudent(parentId);
  if (!student || !studentId) return [];

  const assignments = await db.findMany('assignments', {
    where: [
      { column: 'batchId', value: student.batchId ?? '' },
      { column: 'isDeleted', value: false },
      { column: 'status', value: 'active' },
    ],
    orderBy: [{ column: 'dueDate', dir: 'asc' }],
  });

  const submissions = await db.findMany('assignment_submissions', {
    where: [
      { column: 'studentId', value: studentId },
      { column: 'isDeleted', value: false },
    ],
  });

  return assignments.map((a: any) => {
    const sub = submissions.find((s: any) => s.assignmentId === a.id);
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      totalMarks: a.totalMarks,
      publishDate: a.publishDate,
      dueDate: a.dueDate,
      status: a.status,
      submitted: !!sub,
      submission: sub ?? null,
    };
  });
}

async function getMarks(parentId: string) {
  const { studentId } = await getParentWithStudent(parentId);
  if (!studentId) return [];

  const submissions = await db.findMany('assignment_submissions', {
    where: [
      { column: 'studentId', value: studentId },
      { column: 'isDeleted', value: false },
      { column: 'status', value: 'graded' },
    ],
    orderBy: [{ column: 'submissionDate', dir: 'desc' }],
  });

  const evaluationIds = submissions.filter((s: any) => s.id).map((s: any) => s.id);
  let evaluations: any[] = [];
  if (evaluationIds.length > 0) {
    evaluations = await db.findMany('evaluations', {
      where: [{ column: 'submissionId', operator: 'in', value: evaluationIds }],
    });
  }

  return submissions.map((s: any) => {
    const evalRecord = evaluations.find((e: any) => e.submissionId === s.id);
    return {
      assignmentTitle: s.assignmentTitle,
      subjectName: s.subjectName,
      marksObtained: evalRecord?.marksObtained,
      totalMarks: evalRecord?.totalMarks ?? s.totalMarks,
      grade: evalRecord?.grade,
      feedback: evalRecord?.feedback,
      evaluationDate: evalRecord?.evaluationDate,
    };
  });
}

async function getMaterials(parentId: string) {
  const { student, studentId } = await getParentWithStudent(parentId);
  if (!student || !studentId) return [];

  const materials = await db.findMany('study_materials', {
    where: [
      {
        column: 'batchSearch',
        operator: 'raw',
        value: `batch_id = $1 OR department_id = $2 OR course_id = $3`,
        params: [student.batchId, student.department, student.course],
      },
      { column: 'semesterId', value: String(student.semester) },
      { column: 'visibility', operator: 'in', value: ['PUBLIC', 'STUDENTS_ONLY'] },
    ],
    orderBy: [{ column: 'createdAt', dir: 'desc' }],
  });

  return materials;
}

async function getFees(parentId: string) {
  const { studentId } = await getParentWithStudent(parentId);
  if (!studentId) return { fees: [], summary: { totalAmount: 0, totalPaid: 0, pending: 0 }, totalFee: 0, paid: 0, due: 0, status: 'unpaid', transactions: [] };

  const fees = await db.findMany('fees', {
    where: [{ column: 'studentId', value: studentId }],
    orderBy: [{ column: 'semester', dir: 'asc' }, { column: 'dueDate', dir: 'asc' }],
  });

  const summary = fees.reduce(
    (acc: any, f: any) => ({
      totalAmount: acc.totalAmount + Number(f.amount),
      totalPaid: acc.totalPaid + Number(f.paidAmount),
      pending: acc.pending + (Number(f.amount) - Number(f.paidAmount)),
    }),
    { totalAmount: 0, totalPaid: 0, pending: 0 },
  );

  const transactions = fees.map((f: any) => ({
    id: f.id,
    date: f.paidDate || f.createdAt || new Date(),
    description: `Semester ${f.semester || 1} Fee`,
    amount: Number(f.paidAmount) || 0,
    method: f.paymentMethod || 'Online',
  }));

  return {
    fees,
    summary,
    totalFee: summary.totalAmount,
    paid: summary.totalPaid,
    due: summary.pending,
    status: summary.pending <= 0 ? 'paid' : 'unpaid',
    transactions,
  };
}

async function getNotifications(parentId: string) {
  const { parent, studentId } = await getParentWithStudent(parentId);
  if (!studentId) return { notifications: [], unreadCount: 0 };

  const notifications = await db.findMany('notifications', {
    where: [
      {
        column: 'studentFilter',
        operator: 'raw',
        value: `student_id = $1 OR (student_id IS NULL AND batch_id = $2)`,
        params: [studentId, parent?.linkedRoll],
      },
    ],
    orderBy: [{ column: 'createdAt', dir: 'desc' }],
    limit: 50,
  });

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;
  return { notifications, unreadCount };
}

async function updateProfile(parentId: string, data: { fullName?: string; email?: string; phone?: string; address?: string }) {
  const updateData: Record<string, unknown> = {};
  if (data.fullName !== undefined) updateData.fullName = data.fullName;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.address !== undefined) updateData.address = data.address;
  updateData.updatedAt = new Date();

  const result = await db.update('parents', [{ column: 'id', value: parentId }], updateData);
  return result;
}

async function changePassword(parentId: string, currentPassword: string, newPassword: string) {
  const parent = await db.findUnique('parents', [{ column: 'id', value: parentId }]);
  if (!parent) throw AppError.notFound('Parent not found');

  const isValid = await bcrypt.compare(currentPassword, parent.password || '');
  if (!isValid) throw AppError.badRequest('Current password is incorrect');

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await db.update('parents', [{ column: 'id', value: parentId }], { password: hashedPassword, updatedAt: new Date() });
  return { success: true };
}

export const parentDashboardService = {
  getOverview,
  getAttendance,
  getTimetable,
  getAssignments,
  getMarks,
  getMaterials,
  getFees,
  getNotifications,
  updateProfile,
  changePassword,
};
