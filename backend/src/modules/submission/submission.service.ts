import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import { SubmissionQueryInput, GradeSubmissionInput } from './submission.validator';

async function findAll(query: SubmissionQueryInput) {
  const { page = 1, limit = 10, assignmentId, studentId, status } = query;
  const skip = (page - 1) * limit;

  const where: any = { isDeleted: false };
  if (assignmentId) where.assignmentId = assignmentId;
  if (studentId) where.studentId = studentId;
  if (status) where.status = status;

  const [data, total] = await Promise.all([
    prisma.assignmentSubmission.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          select: { id: true, studentId: true, fullName: true, email: true, rollNumber: true },
        },
        assignment: {
          select: { id: true, title: true, dueDate: true, totalMarks: true },
        },
        attachments: {
          select: { id: true, fileName: true, fileType: true, fileUrl: true, fileSize: true },
        },
      },
    }),
    prisma.assignmentSubmission.count({ where }),
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
  const submission = await prisma.assignmentSubmission.findFirst({
    where: { id, isDeleted: false },
    include: {
      student: {
        select: { id: true, studentId: true, fullName: true, email: true, rollNumber: true },
      },
      assignment: {
        select: { id: true, title: true, description: true, dueDate: true, dueTime: true, totalMarks: true, passingMarks: true },
      },
      attachments: {
        select: { id: true, fileName: true, fileType: true, fileUrl: true, fileSize: true },
      },
      evaluations: {
        include: {
          faculty: {
            select: { id: true, fullName: true, facultyId: true },
          },
        },
      },
    },
  });

  if (!submission) {
    throw AppError.notFound('Submission not found');
  }

  return submission;
}

async function grade(id: string, data: GradeSubmissionInput, userId: string) {
  const submission = await prisma.assignmentSubmission.findFirst({
    where: { id, isDeleted: false },
    include: { assignment: true },
  });

  if (!submission) {
    throw AppError.notFound('Submission not found');
  }

  if (submission.status === 'graded') {
    throw AppError.badRequest('Submission has already been graded');
  }

  const now = new Date();
  const isLate = now > new Date(submission.assignment.dueDate);

  const updatedSubmission = await prisma.assignmentSubmission.update({
    where: { id },
    data: {
      status: 'graded',
      gradedById: userId,
      gradedAt: now,
      lateFlag: isLate,
    },
  });

  const evaluation = await prisma.evaluation.upsert({
    where: { submissionId: id },
    create: {
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
    },
    update: {
      marksObtained: data.marksObtained,
      totalMarks: data.totalMarks,
      grade: data.grade ?? '',
      feedback: data.feedback,
      remarks: data.remarks,
      evaluationDate: now,
      status: 'published',
      updatedById: userId,
    },
  });

  return { submission: updatedSubmission, evaluation };
}

function generateSubmissionCode(): string {
  return `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

async function create(data: any, _userId: string) {
  const now = new Date();
  const submission = await prisma.assignmentSubmission.create({
    data: {
      submissionCode: generateSubmissionCode(),
      assignmentId: data.assignmentId,
      studentId: data.studentId,
      attemptNumber: data.attemptNumber ?? 1,
      submissionDate: now,
      submissionTime: now,
      status: data.status ?? 'submitted',
      remarks: data.remarks,
      lateFlag: data.lateFlag ?? false,
    },
    include: {
      student: {
        select: { id: true, studentId: true, fullName: true, email: true, rollNumber: true },
      },
      assignment: {
        select: { id: true, title: true, dueDate: true, totalMarks: true },
      },
    },
  });
  return submission;
}

async function update(id: string, data: any, _userId: string) {
  const existing = await prisma.assignmentSubmission.findFirst({
    where: { id, isDeleted: false },
  });
  if (!existing) throw AppError.notFound('Submission not found');

  const updateData: any = {};
  if (data.status) updateData.status = data.status;
  if (data.remarks !== undefined) updateData.remarks = data.remarks;
  if (data.attemptNumber) updateData.attemptNumber = data.attemptNumber;
  if (data.lateFlag !== undefined) updateData.lateFlag = data.lateFlag;

  const updated = await prisma.assignmentSubmission.update({
    where: { id },
    data: updateData,
    include: {
      student: {
        select: { id: true, studentId: true, fullName: true, email: true, rollNumber: true },
      },
    },
  });
  return updated;
}

async function remove(id: string, _userId: string) {
  const existing = await prisma.assignmentSubmission.findFirst({
    where: { id, isDeleted: false },
  });
  if (!existing) throw AppError.notFound('Submission not found');

  await prisma.assignmentSubmission.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
  return { message: 'Submission deleted successfully' };
}

async function getByAssignment(assignmentId: string) {
  const submissions = await prisma.assignmentSubmission.findMany({
    where: { assignmentId, isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: {
      student: {
        select: { id: true, studentId: true, fullName: true, email: true, rollNumber: true },
      },
      attachments: {
        select: { id: true, fileName: true, fileType: true, fileUrl: true, fileSize: true },
      },
      evaluations: {
        select: { id: true, marksObtained: true, totalMarks: true, grade: true, status: true },
      },
    },
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
