import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';
import type { CreateHomeworkInput, UpdateHomeworkInput, HomeworkQueryInput } from './homework.validator';

export const homeworkService = {
  async findAll(query: HomeworkQueryInput) {
    const { page, limit, subjectId, batchId, facultyId, status } = query;
    const skip = (page - 1) * limit;

    const where: any[] = [{ column: 'isDeleted', value: false }];

    if (subjectId) where.push({ column: 'subjectId', value: subjectId });
    if (batchId) where.push({ column: 'batchId', value: batchId });
    if (facultyId) where.push({ column: 'facultyId', value: facultyId });
    if (status) where.push({ column: 'status', value: status });

    const [homeworks, total] = await Promise.all([
      db.findMany('homeworks', {
        where,
        offset: skip,
        limit,
        orderBy: [{ column: 'createdAt', dir: 'desc' }],
      }),
      db.count('homeworks', where),
    ]);

    return {
      data: homeworks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findById(id: string) {
    const homework = await db.findFirst('homeworks', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });

    if (!homework) {
      throw AppError.notFound('Homework not found');
    }

    return homework;
  },

  async create(data: CreateHomeworkInput, userId: string) {
    const homework = await db.create('homeworks', {
      ...data,
      dueDate: new Date(data.dueDate),
      createdById: userId,
      updatedById: userId,
    });

    return homework;
  },

  async update(id: string, data: UpdateHomeworkInput, userId: string) {
    const existing = await db.findFirst('homeworks', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });

    if (!existing) {
      throw AppError.notFound('Homework not found');
    }

    const updateData: any = { ...data, updatedById: userId };
    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate);
    }

    const homework = await db.update('homeworks',
      [{ column: 'id', value: id }],
      updateData,
    );

    return homework;
  },

  async delete(id: string, userId: string) {
    const existing = await db.findFirst('homeworks', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });

    if (!existing) {
      throw AppError.notFound('Homework not found');
    }

    const homework = await db.update('homeworks',
      [{ column: 'id', value: id }],
      {
        isDeleted: true,
        deletedAt: new Date(),
        updatedById: userId,
      },
    );

    return homework;
  },

  async getByFaculty(facultyId: string) {
    const homeworks = await db.findMany('homeworks', {
      where: [
        { column: 'facultyId', value: facultyId },
        { column: 'isDeleted', value: false },
      ],
      orderBy: [{ column: 'createdAt', dir: 'desc' }],
    });

    return homeworks;
  },
};
