import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';

async function getStudent(studentId: string) {
  const student = await db.findUnique('students', [{ column: 'id', value: studentId }])
    || await db.findFirst('students', { where: [{ column: 'studentId', value: studentId }] });
  return student;
}

async function getOverview(studentId: string) {
  const student = await getStudent(studentId);
  if (!student) throw AppError.notFound('Student not found');

  let totalClasses = 0;
  let attendedClasses = 0;
  let pendingAssignments = 0;
  let totalAssignments = 0;

  try {
    totalClasses = await db.count('attendance', [
      { column: 'studentId', value: studentId },
      { column: 'isDeleted', value: false },
    ]);
  } catch { totalClasses = 0; }
  try {
    attendedClasses = await db.count('attendance', [
      { column: 'studentId', value: studentId },
      { column: 'isDeleted', value: false },
      { column: 'attendanceStatus', value: 'present' },
    ]);
  } catch { attendedClasses = 0; }
  try {
    pendingAssignments = await db.count('assignments', [
      { column: 'batchId', value: student.batchId ?? '' },
      { column: 'status', value: 'active' },
      { column: 'isDeleted', value: false },
    ], { sql: `NOT EXISTS (SELECT 1 FROM assignment_submissions WHERE assignment_submissions.assignment_id = assignments.id AND assignment_submissions.student_id = $1)`, params: [studentId] });
  } catch { pendingAssignments = 0; }
  try {
    totalAssignments = await db.count('assignments', [
      { column: 'batchId', value: student.batchId ?? '' },
      { column: 'isDeleted', value: false },
      { column: 'status', value: 'active' },
    ]);
  } catch { totalAssignments = 0; }

  let feesTotal = 0;
  let feesPaid = 0;
  try {
    const fees = await db.findMany('fee_transactions', {
      where: [{ column: 'studentId', value: studentId }],
    });
    feesTotal = fees.reduce((sum: number, f: any) => sum + Number(f.amount || 0), 0);
    feesPaid = fees.reduce((sum: number, f: any) => sum + Number(f.paidAmount || f.amount || 0), 0);
  } catch {
    try {
      const fees = await db.findMany('fee_pending', {
        where: [{ column: 'studentId', value: studentId }],
      });
      feesTotal = fees.reduce((sum: number, f: any) => sum + Number(f.amount || 0), 0);
      feesPaid = fees.reduce((sum: number, f: any) => sum + Number(f.paidAmount || 0), 0);
    } catch { /* ignore */ }
  }

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
      feesTotal,
      feesPaid,
    },
  };
}

async function getAttendance(studentId: string, month?: number, year?: number) {
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

  let records: any[] = [];
  try {
    records = await db.findMany('attendance', {
      where,
      orderBy: [{ column: 'attendanceDate', dir: 'desc' }],
    });
  } catch { records = []; }

  const total = records.length;
  const present = records.filter((r: any) => r.attendanceStatus === 'present').length;
  const absent = records.filter((r: any) => r.attendanceStatus === 'absent').length;
  const late = records.filter((r: any) => r.attendanceStatus === 'late').length;

  return {
    records,
    summary: { total, present, absent, late, percent: total > 0 ? Math.round((present / total) * 100) : 0 },
  };
}

async function getTimetable(studentId: string) {
  const student = await getStudent(studentId);
  if (!student) throw AppError.notFound('Student not found');

  let timetables: any[] = [];
  try {
    timetables = await db.findMany('timetables', {
      where: [
        { column: 'batchId', value: student.batchId ?? undefined },
        { column: 'semester', value: student.semester },
        { column: 'department', value: student.department },
      ],
      orderBy: [{ column: 'dayOfWeek', dir: 'asc' }, { column: 'startTime', dir: 'asc' }],
    });
  } catch { timetables = []; }

  const grouped: Record<string, typeof timetables> = {};
  for (const t of timetables) {
    if (!grouped[t.dayOfWeek]) grouped[t.dayOfWeek] = [];
    grouped[t.dayOfWeek].push(t);
  }

  return grouped;
}

async function getAssignments(studentId: string) {
  const student = await getStudent(studentId);
  if (!student) throw AppError.notFound('Student not found');

  let assignments: any[] = [];
  let submissions: any[] = [];
  try {
    assignments = await db.findMany('assignments', {
      where: [
        { column: 'batchId', value: student.batchId ?? '' },
        { column: 'isDeleted', value: false },
        { column: 'status', value: 'active' },
      ],
      orderBy: [{ column: 'dueDate', dir: 'asc' }],
    });
  } catch { assignments = []; }

  try {
    submissions = await db.findMany('assignment_submissions', {
      where: [
        { column: 'studentId', value: studentId },
        { column: 'isDeleted', value: false },
      ],
    });
  } catch { submissions = []; }

  return assignments.map((a: any) => {
    const sub = submissions.find((s: any) => s.assignmentId === a.id);
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      subjectName: a.subjectName,
      subjectCode: a.subjectCode,
      facultyName: a.facultyName,
      totalMarks: a.totalMarks,
      publishDate: a.publishDate,
      dueDate: a.dueDate,
      status: a.status,
      submitted: !!sub,
      submission: sub ?? null,
    };
  });
}

async function getMarks(studentId: string) {
  let submissions: any[] = [];
  try {
    submissions = await db.findMany('assignment_submissions', {
      where: [
        { column: 'studentId', value: studentId },
        { column: 'isDeleted', value: false },
        { column: 'status', value: 'graded' },
      ],
      orderBy: [{ column: 'submissionDate', dir: 'desc' }],
    });
  } catch { submissions = []; }

  const evaluationIds = submissions.filter((s: any) => s.id).map((s: any) => s.id);
  let evaluations: any[] = [];
  if (evaluationIds.length > 0) {
    try {
      evaluations = await db.findMany('evaluations', {
        where: [
          { column: 'submissionId', operator: 'in', value: evaluationIds },
        ],
      });
    } catch { evaluations = []; }
  }

  return submissions
    .map((s: any) => {
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

async function getMaterials(studentId: string) {
  const student = await getStudent(studentId);
  if (!student) throw AppError.notFound('Student not found');

  let materials: any[] = [];
  try {
    if (student.batchId) {
      materials = await db.findMany('study_materials', {
        where: [
          { column: 'batchId', value: student.batchId },
          { column: 'visibility', operator: 'in', value: ['PUBLIC', 'STUDENTS_ONLY', 'BATCH_ONLY'] },
          { column: 'status', value: 'active' },
          { column: 'isDeleted', value: false },
        ],
        orderBy: [{ column: 'createdAt', dir: 'desc' }],
      });
    }
    if (materials.length === 0) {
      materials = await db.findMany('study_materials', {
        where: [
          { column: 'visibility', operator: 'in', value: ['PUBLIC', 'STUDENTS_ONLY'] },
          { column: 'status', value: 'active' },
          { column: 'isDeleted', value: false },
        ],
        orderBy: [{ column: 'createdAt', dir: 'desc' }],
        limit: 50,
      });
    }
  } catch {
    try {
      materials = await db.findMany('study_materials', {
        where: [
          { column: 'status', value: 'active' },
          { column: 'isDeleted', value: false },
        ],
        orderBy: [{ column: 'createdAt', dir: 'desc' }],
        limit: 50,
      });
    } catch { materials = []; }
  }

  return materials;
}

async function getFees(studentId: string) {
  let fees: any[] = [];
  try {
    fees = await db.findMany('fee_pending', {
      where: [{ column: 'studentId', value: studentId }],
      orderBy: [{ column: 'dueDate', dir: 'asc' }, { column: 'semester', dir: 'asc' }],
    });
  } catch {
    try {
      fees = await db.findMany('fee_transactions', {
        where: [{ column: 'studentId', value: studentId }],
        orderBy: [{ column: 'dueDate', dir: 'asc' }],
      });
    } catch { fees = []; }
  }

  const summary = fees.reduce(
    (acc: any, f: any) => ({
      totalAmount: acc.totalAmount + Number(f.amount || 0),
      totalPaid: acc.totalPaid + Number(f.paidAmount || 0),
      pending: acc.pending + (Number(f.amount || 0) - Number(f.paidAmount || 0)),
    }),
    { totalAmount: 0, totalPaid: 0, pending: 0 }
  );

  return { fees, summary };
}

async function getNotifications(studentId: string) {
  const student = await getStudent(studentId);
  if (!student) throw AppError.notFound('Student not found');

  let notifications: any[] = [];
  try {
    notifications = await db.findMany('notifications', {
      where: [
        {
          column: 'studentFilter',
          operator: 'raw',
          value: `student_id = $1 OR (student_id IS NULL AND batch_id = $2)`,
          params: [studentId, student.batchId ?? ''],
        },
      ],
      orderBy: [{ column: 'createdAt', dir: 'desc' }],
      limit: 50,
    });
  } catch { notifications = []; }

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;
  return { notifications, unreadCount };
}

async function markNotificationRead(notificationId: string, studentId: string) {
  try {
    const notification = await db.findFirst('notifications', {
      where: [
        { column: 'id', value: notificationId },
        { column: 'studentId', value: studentId },
      ],
    });
    if (!notification) throw AppError.notFound('Notification not found');

    return db.update('notifications',
      [{ column: 'id', value: notificationId }],
      { isRead: true },
    );
  } catch {
    throw AppError.notFound('Notification not found');
  }
}

async function getCertificates(studentId: string) {
  const student = await getStudent(studentId);
  if (!student) throw AppError.notFound('Student not found');

  let submissions: any[] = [];
  try {
    submissions = await db.findMany('assignment_submissions', {
      where: [
        { column: 'studentId', value: studentId },
        { column: 'isDeleted', value: false },
        { column: 'status', value: 'graded' },
      ],
      orderBy: [{ column: 'submissionDate', dir: 'desc' }],
    });
  } catch { submissions = []; }

  const evaluationIds = submissions.filter((s: any) => s.id).map((s: any) => s.id);
  let evaluations: any[] = [];
  if (evaluationIds.length > 0) {
    try {
      evaluations = await db.findMany('evaluations', {
        where: [{ column: 'submissionId', operator: 'in', value: evaluationIds }],
      });
    } catch { evaluations = []; }
  }

  const certificates = submissions.map((s: any) => {
    const evalRecord = evaluations.find((e: any) => e.submissionId === s.id);
    const marksObtained = evalRecord?.marksObtained ? Number(evalRecord.marksObtained) : 0;
    const totalMarks = evalRecord?.totalMarks ? Number(evalRecord.totalMarks) : Number(s.totalMarks) || 100;
    const percentage = totalMarks > 0 ? Math.round((marksObtained / totalMarks) * 100) : 0;
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : 'D';

    return {
      id: s.id,
      title: s.assignmentTitle || 'Assignment',
      subject: s.subjectName || '',
      marksObtained,
      totalMarks,
      percentage,
      grade,
      feedback: evalRecord?.feedback || '',
      issueDate: evalRecord?.evaluationDate || s.gradedAt || s.submissionDate,
      status: 'completed',
    };
  });

  return {
    certificates,
    studentName: student.fullName,
    rollNumber: student.rollNumber,
    course: student.course,
    department: student.department,
    totalCertificates: certificates.length,
  };
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
  getCertificates,
};
