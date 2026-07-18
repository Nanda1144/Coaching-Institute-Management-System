import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import type { InputJsonValue } from '@prisma/client/runtime/library';

function generateAssignmentCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ASN-${code}`;
}

async function createAssignmentLog(params: {
  facultyId: string;
  action: string;
  entityId: string;
  entityName: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  performedBy: string;
}) {
  await prisma.assignmentLog.create({
    data: {
      facultyId: params.facultyId,
      action: params.action,
      entityType: 'Assignment',
      entityId: params.entityId,
      entityName: params.entityName,
      oldValue: (params.oldValue ?? Prisma.JsonNull) as InputJsonValue,
      newValue: (params.newValue ?? Prisma.JsonNull) as InputJsonValue,
      performedBy: params.performedBy,
    },
  });
}

const assignmentInclude = {
  subject: true,
  batch: true,
  faculty: true,
  department: true,
  course: true,
  semester: true,
  createdBy: true,
  updatedBy: true,
  _count: {
    select: { submissions: true },
  },
} as const;

export const assignmentService = {
  async findAll(query: {
    page?: number;
    limit?: number;
    subjectId?: string;
    batchId?: string;
    facultyId?: string;
    status?: string;
  }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.AssignmentWhereInput = {
      isDeleted: false,
    };

    if (query.subjectId) where.subjectId = query.subjectId;
    if (query.batchId) where.batchId = query.batchId;
    if (query.facultyId) where.facultyId = query.facultyId;
    if (query.status) where.status = query.status as any;

    const [data, total] = await Promise.all([
      prisma.assignment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: assignmentInclude,
      }),
      prisma.assignment.count({ where }),
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
  },

  async findById(id: string) {
    const assignment = await prisma.assignment.findFirst({
      where: { id, isDeleted: false },
      include: {
        ...assignmentInclude,
        attachments: true,
      },
    });

    if (!assignment) throw AppError.notFound('Assignment not found');
    return assignment;
  },

  async create(data: any, userId: string) {
    let assignmentCode = generateAssignmentCode();
    let codeExists = await prisma.assignment.findUnique({ where: { assignmentCode } });
    while (codeExists) {
      assignmentCode = generateAssignmentCode();
      codeExists = await prisma.assignment.findUnique({ where: { assignmentCode } });
    }

    const assignment = await prisma.assignment.create({
      data: {
        assignmentCode,
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        departmentId: data.departmentId,
        courseId: data.courseId,
        semesterId: data.semesterId,
        subjectId: data.subjectId,
        batchId: data.batchId,
        facultyId: data.facultyId,
        totalMarks: data.totalMarks,
        passingMarks: data.passingMarks,
        publishDate: new Date(data.publishDate),
        dueDate: new Date(data.dueDate),
        dueTime: new Date(data.dueTime).toISOString(),
        allowLateSubmission: data.allowLateSubmission ?? false,
        maxFileSize: data.maxFileSize,
        maxAttempts: data.maxAttempts ?? 1,
        visibility: data.visibility ?? 'visible',
        status: data.status ?? 'active',
        createdById: userId,
        updatedById: userId,
      },
      include: assignmentInclude,
    });

    await createAssignmentLog({
      facultyId: data.facultyId,
      action: 'CREATE',
      entityId: assignment.id,
      entityName: assignment.title,
      newValue: assignment as any,
      performedBy: userId,
    });

    return assignment;
  },

  async update(id: string, data: any, userId: string) {
    const existing = await this.findById(id);

    const updateData: Prisma.AssignmentUpdateInput = {
      updatedBy: { connect: { id: userId } },
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.instructions !== undefined) updateData.instructions = data.instructions;
    if (data.departmentId !== undefined) updateData.department = { connect: { id: data.departmentId } };
    if (data.courseId !== undefined) updateData.course = { connect: { id: data.courseId } };
    if (data.semesterId !== undefined) updateData.semester = { connect: { id: data.semesterId } };
    if (data.subjectId !== undefined) updateData.subject = { connect: { id: data.subjectId } };
    if (data.batchId !== undefined) updateData.batch = { connect: { id: data.batchId } };
    if (data.facultyId !== undefined) updateData.faculty = { connect: { id: data.facultyId } };
    if (data.totalMarks !== undefined) updateData.totalMarks = data.totalMarks;
    if (data.passingMarks !== undefined) updateData.passingMarks = data.passingMarks;
    if (data.publishDate !== undefined) updateData.publishDate = new Date(data.publishDate);
    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
    if (data.dueTime !== undefined) updateData.dueTime = new Date(data.dueTime).toISOString();
    if (data.allowLateSubmission !== undefined) updateData.allowLateSubmission = data.allowLateSubmission;
    if (data.maxFileSize !== undefined) updateData.maxFileSize = data.maxFileSize;
    if (data.maxAttempts !== undefined) updateData.maxAttempts = data.maxAttempts;
    if (data.visibility !== undefined) updateData.visibility = data.visibility;
    if (data.status !== undefined) updateData.status = data.status;

    const assignment = await prisma.assignment.update({
      where: { id },
      data: updateData,
      include: assignmentInclude,
    });

    const relationFields = new Set(['departmentId', 'courseId', 'semesterId', 'subjectId', 'batchId', 'facultyId']);
    const oldValues: Record<string, unknown> = {};
    const newValues: Record<string, unknown> = {};
    for (const key of Object.keys(data)) {
      if (relationFields.has(key)) continue;
      if ((existing as any)[key] !== data[key]) {
        oldValues[key] = (existing as any)[key];
        newValues[key] = data[key];
      }
    }

    await createAssignmentLog({
      facultyId: assignment.facultyId,
      action: 'UPDATE',
      entityId: assignment.id,
      entityName: assignment.title,
      oldValue: oldValues,
      newValue: newValues,
      performedBy: userId,
    });

    return assignment;
  },

  async delete(id: string, userId: string) {
    const existing = await this.findById(id);

    await prisma.assignment.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedBy: { connect: { id: userId } },
      },
    });

    await createAssignmentLog({
      facultyId: existing.facultyId,
      action: 'DELETE',
      entityId: existing.id,
      entityName: existing.title,
      oldValue: existing as any,
      performedBy: userId,
    });
  },

  async getByFaculty(facultyId: string) {
    const facultyExists = await prisma.faculty.findUnique({ where: { id: facultyId } });
    if (!facultyExists) throw AppError.notFound('Faculty not found');

    const assignments = await prisma.assignment.findMany({
      where: { facultyId, isDeleted: false },
      include: assignmentInclude,
      orderBy: { createdAt: 'desc' },
    });

    return assignments;
  },
};
