import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';
import type { CreateEvaluationInput, UpdateEvaluationInput, EvaluationQueryInput } from './evaluation.validator';

async function findAll(query: EvaluationQueryInput) {
  const { page = 1, limit = 10, facultyId, status, submissionId } = query;
  const skip = (page - 1) * limit;

  const where: any[] = [{ column: 'isDeleted', value: false }];
  if (facultyId) where.push({ column: 'facultyId', value: facultyId });
  if (status) where.push({ column: 'status', value: status });
  if (submissionId) where.push({ column: 'submissionId', value: submissionId });

  const [data, total] = await Promise.all([
    db.findMany('evaluations', {
      where,
      offset: skip,
      limit,
      orderBy: [{ column: 'createdAt', dir: 'desc' }],
    }),
    db.count('evaluations', where),
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
  const evaluation = await db.findFirst('evaluations', {
    where: [
      { column: 'id', value: id },
      { column: 'isDeleted', value: false },
    ],
  });

  if (!evaluation) {
    throw AppError.notFound('Evaluation not found');
  }

  return evaluation;
}

async function create(data: CreateEvaluationInput, userId: string) {
  const existing = await db.findUnique('evaluations', [{ column: 'submissionId', value: data.submissionId }]);

  if (existing) {
    throw AppError.conflict('Evaluation already exists for this submission');
  }

  if (data.marksObtained != null && data.totalMarks != null && data.marksObtained > data.totalMarks) {
    throw AppError.badRequest(`Marks obtained (${data.marksObtained}) cannot exceed total marks (${data.totalMarks})`);
  }

  const submission = await db.findFirst('assignment_submissions', {
    where: [
      { column: 'id', value: data.submissionId },
      { column: 'isDeleted', value: false },
    ],
  });

  if (!submission) {
    throw AppError.notFound('Submission not found');
  }

  const evaluation = await db.create('evaluations', {
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
  });

  return evaluation;
}

async function update(id: string, data: UpdateEvaluationInput, userId: string) {
  const evaluation = await db.findFirst('evaluations', {
    where: [
      { column: 'id', value: id },
      { column: 'isDeleted', value: false },
    ],
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

  const marksObtained = data.marksObtained ?? evaluation.marksObtained;
  const totalMarks = data.totalMarks ?? evaluation.totalMarks;
  if (marksObtained > totalMarks) {
    throw AppError.badRequest(`Marks obtained (${marksObtained}) cannot exceed total marks (${totalMarks})`);
  }

  const updateData: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      updateData[key] = value;
    }
  }

  const updated = await db.update('evaluations',
    [{ column: 'id', value: id }],
    {
      ...updateData,
      previousVersion: JSON.stringify(oldVersion),
      updatedById: userId,
    },
  );

  return updated;
}

async function publish(id: string, userId: string) {
  const evaluation = await db.findFirst('evaluations', {
    where: [
      { column: 'id', value: id },
      { column: 'isDeleted', value: false },
    ],
  });

  if (!evaluation) {
    throw AppError.notFound('Evaluation not found');
  }

  if (evaluation.status === 'published') {
    throw AppError.badRequest('Evaluation is already published');
  }

  const updated = await db.update('evaluations',
    [{ column: 'id', value: id }],
    {
      status: 'published',
      updatedById: userId,
    },
  );

  return updated;
}

async function remove(id: string, userId: string) {
  const existing = await db.findFirst('evaluations', {
    where: [
      { column: 'id', value: id },
      { column: 'isDeleted', value: false },
    ],
  });
  if (!existing) throw AppError.notFound('Evaluation not found');

  await db.update('evaluations',
    [{ column: 'id', value: id }],
    { isDeleted: true, deletedAt: new Date(), updatedById: userId },
  );
  return { message: 'Evaluation deleted successfully' };
}

async function getByFaculty(facultyId: string) {
  const evaluations = await db.findMany('evaluations', {
    where: [
      { column: 'facultyId', value: facultyId },
      { column: 'isDeleted', value: false },
    ],
    orderBy: [{ column: 'createdAt', dir: 'desc' }],
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
