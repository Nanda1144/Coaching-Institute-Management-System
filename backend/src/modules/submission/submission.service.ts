import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';
import { SubmissionQueryInput, GradeSubmissionInput } from './submission.validator';

async function findAll(query: SubmissionQueryInput) {
  const { page = 1, limit = 10, assignmentId, studentId, status } = query;
  const skip = (page - 1) * limit;

  const where: any[] = [{ column: 'isDeleted', value: false }];
  if (assignmentId) where.push({ column: 'assignmentId', value: assignmentId });
  if (studentId) where.push({ column: 'studentId', value: studentId });
  if (status) where.push({ column: 'status', value: status });

  const [data, total] = await Promise.all([
    db.findMany('assignment_submissions', {
      where,
      offset: skip,
      limit,
      orderBy: [{ column: 'createdAt', dir: 'desc' }],
    }),
    db.count('assignment_submissions', where),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function findById(id: string) {
  const submission = await db.findFirst('assignment_submissions', {
    where: [
      { column: 'id', value: id },
      { column: 'isDeleted', value: false },
    ],
  });

  if (!submission) {
    throw AppError.notFound('Submission not found');
  }

  return submission;
}

async function grade(id: string, data: GradeSubmissionInput, userId: string) {
  const submission = await db.findFirst('assignment_submissions', {
    where: [
      { column: 'id', value: id },
      { column: 'isDeleted', value: false },
    ],
  });

  if (!submission) {
    throw AppError.notFound('Submission not found');
  }

  if (submission.status === 'graded') {
    throw AppError.badRequest('Submission has already been graded');
  }

  return db.transact(async () => {
    const now = new Date();
    const isLate = now > new Date(submission.dueDate || submission.submissionDate);

    const updatedSubmission = await db.update('assignment_submissions',
      [{ column: 'id', value: id }],
      {
        status: 'graded',
        gradedById: userId,
        gradedAt: now,
        lateFlag: isLate,
      },
    );

    const existingEval = await db.findUnique('evaluations', [{ column: 'submissionId', value: id }]);
    let evaluation;
    if (existingEval) {
      evaluation = await db.update('evaluations',
        [{ column: 'submissionId', value: id }],
        {
          marksObtained: data.marksObtained,
          totalMarks: data.totalMarks,
          grade: data.grade ?? '',
          feedback: data.feedback,
          remarks: data.remarks,
          evaluationDate: now,
          status: 'published',
          updatedById: userId,
        },
      );
    } else {
      evaluation = await db.create('evaluations', {
        submissionId: id,
        facultyId: userId,
        marksObtained: data.marksObtained,
        totalMarks: data.totalMarks,
        grade: data.grade ?? '',
        feedback: data.feedback,
        remarks: data.remarks,
        evaluationDate: now,
        status: 'published',
        createdById: userId,
        updatedById: userId,
      });
    }

    return { submission: updatedSubmission, evaluation };
  });
}

function generateSubmissionCode(): string {
  return `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

async function create(data: any, userId: string) {
  const now = new Date();
  const submission = await db.create('assignment_submissions', {
    submissionCode: generateSubmissionCode(),
    assignmentId: data.assignmentId,
    studentId: data.studentId,
    attemptNumber: data.attemptNumber ?? 1,
    submissionDate: now,
    submissionTime: now,
    status: data.status ?? 'submitted',
    remarks: data.remarks,
    lateFlag: data.lateFlag ?? false,
    createdById: userId,
  });
  return submission;
}

async function update(id: string, data: any, userId: string) {
  const existing = await db.findFirst('assignment_submissions', {
    where: [
      { column: 'id', value: id },
      { column: 'isDeleted', value: false },
    ],
  });
  if (!existing) throw AppError.notFound('Submission not found');

  const updateData: Record<string, unknown> = {};
  if (data.status) updateData.status = data.status;
  if (data.remarks !== undefined) updateData.remarks = data.remarks;
  if (data.attemptNumber) updateData.attemptNumber = data.attemptNumber;
  if (data.lateFlag !== undefined) updateData.lateFlag = data.lateFlag;
  if (userId) updateData.updatedById = userId;

  const updated = await db.update('assignment_submissions',
    [{ column: 'id', value: id }],
    updateData,
  );
  return updated;
}

async function remove(id: string, userId: string) {
  const existing = await db.findFirst('assignment_submissions', {
    where: [
      { column: 'id', value: id },
      { column: 'isDeleted', value: false },
    ],
  });
  if (!existing) throw AppError.notFound('Submission not found');

  await db.update('assignment_submissions',
    [{ column: 'id', value: id }],
    { isDeleted: true, deletedAt: new Date(), updatedById: userId || null },
  );
  return { message: 'Submission deleted successfully' };
}

async function getByAssignment(assignmentId: string) {
  const submissions = await db.findMany('assignment_submissions', {
    where: [
      { column: 'assignmentId', value: assignmentId },
      { column: 'isDeleted', value: false },
    ],
    orderBy: [{ column: 'createdAt', dir: 'desc' }],
  });

  return submissions;
}

export const submissionService = {
  findAll,
  findById,
  create,
  update,
  remove,
  grade,
  getByAssignment,
};
