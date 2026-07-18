import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import { CreateEvaluationInput, UpdateEvaluationInput, EvaluationQueryInput } from './evaluation.validator';

async function findAll(query: EvaluationQueryInput) {
  const { page = 1, limit = 10, facultyId, status, submissionId } = query;
  const skip = (page - 1) * limit;

  const where: any = { isDeleted: false };
  if (facultyId) where.facultyId = facultyId;
  if (status) where.status = status;
  if (submissionId) where.submissionId = submissionId;

  const [data, total] = await Promise.all([
    prisma.evaluation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        submission: {
          include: {
            student: {
              select: { id: true, studentId: true, fullName: true, email: true, rollNumber: true },
            },
          },
        },
        faculty: {
          select: { id: true, fullName: true, facultyId: true, email: true },
        },
      },
    }),
    prisma.evaluation.count({ where }),
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
  const evaluation = await prisma.evaluation.findFirst({
    where: { id, isDeleted: false },
    include: {
      submission: {
        include: {
          student: {
            select: { id: true, studentId: true, fullName: true, email: true, rollNumber: true },
          },
          attachments: {
            select: { id: true, fileName: true, fileType: true, fileUrl: true, fileSize: true },
          },
        },
      },
      faculty: {
        select: { id: true, fullName: true, facultyId: true, email: true },
      },
      createdBy: {
        select: { id: true, fullName: true },
      },
      updatedBy: {
        select: { id: true, fullName: true },
      },
    },
  });

  if (!evaluation) {
    throw AppError.notFound('Evaluation not found');
  }

  return evaluation;
}

async function create(data: CreateEvaluationInput, userId: string) {
  const existing = await prisma.evaluation.findUnique({
    where: { submissionId: data.submissionId },
  });

  if (existing) {
    throw AppError.conflict('Evaluation already exists for this submission');
  }

  const submission = await prisma.assignmentSubmission.findFirst({
    where: { id: data.submissionId, isDeleted: false },
  });

  if (!submission) {
    throw AppError.notFound('Submission not found');
  }

  const evaluation = await prisma.evaluation.create({
    data: {
      submissionId: data.submissionId,
      facultyId: data.facultyId,
      marksObtained: data.marksObtained,
      totalMarks: data.totalMarks,
      grade: data.grade ?? '',
      feedback: data.feedback,
      remarks: data.remarks,
      evaluationDate: new Date(),
      status: 'draft',
      createdById: userId,
      updatedById: userId,
    },
    include: {
      submission: {
        include: {
          student: {
            select: { id: true, studentId: true, fullName: true, email: true, rollNumber: true },
          },
        },
      },
      faculty: {
        select: { id: true, fullName: true, facultyId: true },
      },
    },
  });

  return evaluation;
}

async function update(id: string, data: UpdateEvaluationInput, userId: string) {
  const evaluation = await prisma.evaluation.findFirst({
    where: { id, isDeleted: false },
  });

  if (!evaluation) {
    throw AppError.notFound('Evaluation not found');
  }

  const oldVersion = {
    marksObtained: evaluation.marksObtained,
    totalMarks: evaluation.totalMarks,
    grade: evaluation.grade,
    feedback: evaluation.feedback,
    remarks: evaluation.remarks,
    status: evaluation.status,
    updatedAt: evaluation.updatedAt,
  };

  const updateData: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      updateData[key] = value;
    }
  }

  const updated = await prisma.evaluation.update({
    where: { id },
    data: {
      ...updateData,
      previousVersion: JSON.stringify(oldVersion),
      updatedById: userId,
    },
    include: {
      submission: {
        include: {
          student: {
            select: { id: true, studentId: true, fullName: true, email: true, rollNumber: true },
          },
        },
      },
      faculty: {
        select: { id: true, fullName: true, facultyId: true },
      },
    },
  });

  return updated;
}

async function publish(id: string, userId: string) {
  const evaluation = await prisma.evaluation.findFirst({
    where: { id, isDeleted: false },
  });

  if (!evaluation) {
    throw AppError.notFound('Evaluation not found');
  }

  if (evaluation.status === 'published') {
    throw AppError.badRequest('Evaluation is already published');
  }

  const updated = await prisma.evaluation.update({
    where: { id },
    data: {
      status: 'published',
      updatedById: userId,
    },
    include: {
      submission: {
        include: {
          student: {
            select: { id: true, studentId: true, fullName: true, email: true, rollNumber: true },
          },
        },
      },
      faculty: {
        select: { id: true, fullName: true, facultyId: true },
      },
    },
  });

  return updated;
}

async function remove(id: string, userId: string) {
  const existing = await prisma.evaluation.findFirst({
    where: { id, isDeleted: false },
  });
  if (!existing) throw AppError.notFound('Evaluation not found');

  await prisma.evaluation.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date(), updatedById: userId },
  });
  return { message: 'Evaluation deleted successfully' };
}

async function getByFaculty(facultyId: string) {
  const evaluations = await prisma.evaluation.findMany({
    where: { facultyId, isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: {
      submission: {
        include: {
          student: {
            select: { id: true, studentId: true, fullName: true, email: true, rollNumber: true },
          },
          assignment: {
            select: { id: true, title: true, dueDate: true },
          },
        },
      },
    },
  });

  return evaluations;
}

export const evaluationService = {
  findAll,
  findById,
  create,
  update,
  remove,
  publish,
  getByFaculty,
};
