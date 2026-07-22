import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';
import { sendNotification } from '../../shared/utils/notification-helper';

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
  await db.create('assignment_logs', {
    facultyId: params.facultyId,
    action: params.action,
    entityType: 'Assignment',
    entityId: params.entityId,
    entityName: params.entityName,
    oldValue: params.oldValue ?? null,
    newValue: params.newValue ?? null,
    performedBy: params.performedBy,
  });
}

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

    const where: { column: string; operator?: string; value: any }[] = [
      { column: 'isDeleted', value: false },
    ];

    if (query.subjectId) where.push({ column: 'subjectId', value: query.subjectId });
    if (query.batchId) where.push({ column: 'batchId', value: query.batchId });
    if (query.facultyId) where.push({ column: 'facultyId', value: query.facultyId });
    if (query.status) where.push({ column: 'status', value: query.status });

    const [data, total] = await Promise.all([
      db.findMany('assignments', {
        where,
        offset: skip,
        limit,
        orderBy: [{ column: 'createdAt', dir: 'DESC' }],
      }),
      db.count('assignments', where),
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
    const where = [{ column: 'id', value: id }, { column: 'isDeleted', value: false }];
    const assignment = await db.findFirst('assignments', { where });

    if (!assignment) throw AppError.notFound('Assignment not found');

    const [subject, batch, faculty, department, course, semester, createdBy, updatedBy, attachments, submissionCount] = await Promise.all([
      assignment.subjectId ? db.findUnique('subjects', [{ column: 'id', value: assignment.subjectId }]) : Promise.resolve(null),
      assignment.batchId ? db.findUnique('batches', [{ column: 'id', value: assignment.batchId }]) : Promise.resolve(null),
      assignment.facultyId ? db.findUnique('faculty', [{ column: 'id', value: assignment.facultyId }]) : Promise.resolve(null),
      assignment.departmentId ? db.findUnique('departments', [{ column: 'id', value: assignment.departmentId }]) : Promise.resolve(null),
      assignment.courseId ? db.findUnique('courses', [{ column: 'id', value: assignment.courseId }]) : Promise.resolve(null),
      assignment.semesterId ? db.findUnique('semesters', [{ column: 'id', value: assignment.semesterId }]) : Promise.resolve(null),
      assignment.createdById ? db.findUnique('faculty', [{ column: 'id', value: assignment.createdById }]) : Promise.resolve(null),
      assignment.updatedById ? db.findUnique('faculty', [{ column: 'id', value: assignment.updatedById }]) : Promise.resolve(null),
      db.findMany('assignment_attachments', { where: [{ column: 'assignmentId', value: id }] }),
      db.count('assignment_submissions', [{ column: 'assignmentId', value: id }]),
    ]);

    return {
      ...assignment,
      subject,
      batch,
      faculty,
      department,
      course,
      semester,
      createdBy,
      updatedBy,
      attachments,
      _count: { submissions: submissionCount },
    };
  },

  async create(data: any, userId: string) {
    let assignmentCode = generateAssignmentCode();
    let codeExists = await db.findUnique('assignments', [{ column: 'assignmentCode', value: assignmentCode }]);
    while (codeExists) {
      assignmentCode = generateAssignmentCode();
      codeExists = await db.findUnique('assignments', [{ column: 'assignmentCode', value: assignmentCode }]);
    }

    const assignment = await db.transact(async () => {
      const newAssignment = await db.create('assignments', {
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
      });

      await createAssignmentLog({
        facultyId: data.facultyId,
        action: 'CREATE',
        entityId: newAssignment.id,
        entityName: newAssignment.title,
        newValue: newAssignment as any,
        performedBy: userId,
      });

      return newAssignment;
    });

    await sendNotification(
      'New Assignment Posted',
      `${assignment.title} has been posted for your batch. Due: ${new Date(assignment.dueDate).toLocaleDateString()}`,
      assignment.batchId
    );

    return assignment;
  },

  async update(id: string, data: any, userId: string) {
    const existing = await this.findById(id);

    const updateData: Record<string, any> = {
      updatedById: userId,
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.instructions !== undefined) updateData.instructions = data.instructions;
    if (data.departmentId !== undefined) updateData.departmentId = data.departmentId;
    if (data.courseId !== undefined) updateData.courseId = data.courseId;
    if (data.semesterId !== undefined) updateData.semesterId = data.semesterId;
    if (data.subjectId !== undefined) updateData.subjectId = data.subjectId;
    if (data.batchId !== undefined) updateData.batchId = data.batchId;
    if (data.facultyId !== undefined) updateData.facultyId = data.facultyId;
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

    return db.transact(async () => {
      const assignment = await db.update('assignments', [{ column: 'id', value: id }], updateData);

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
    });
  },

  async delete(id: string, userId: string) {
    const existing = await this.findById(id);

    await db.transact(async () => {
      await db.remove('assignments', [{ column: 'id', value: id }], true, userId);

      await createAssignmentLog({
        facultyId: existing.facultyId,
        action: 'DELETE',
        entityId: existing.id,
        entityName: existing.title,
        oldValue: existing as any,
        performedBy: userId,
      });
    });
  },

  async getByFaculty(facultyId: string) {
    const facultyExists = await db.findUnique('faculty', [{ column: 'id', value: facultyId }]);
    if (!facultyExists) throw AppError.notFound('Faculty not found');

    const assignments = await db.findMany('assignments', {
      where: [
        { column: 'facultyId', value: facultyId },
        { column: 'isDeleted', value: false },
      ],
      orderBy: [{ column: 'createdAt', dir: 'DESC' }],
    });

    return assignments;
  },
};
