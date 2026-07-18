import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import type { CreateHomeworkInput, UpdateHomeworkInput, HomeworkQueryInput } from './homework.validator';

export const homeworkService = {
  async findAll(query: HomeworkQueryInput) {
    const { page, limit, subjectId, batchId, facultyId, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };

    if (subjectId) where.subjectId = subjectId;
    if (batchId) where.batchId = batchId;
    if (facultyId) where.facultyId = facultyId;
    if (status) where.status = status;

    const [homeworks, total] = await Promise.all([
      prisma.homework.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          subject: {
            select: { id: true, subjectName: true, subjectCode: true },
          },
          batch: {
            select: { id: true, batchName: true },
          },
          faculty: {
            select: { id: true, firstName: true, lastName: true, facultyId: true },
          },
          department: {
            select: { id: true, name: true, code: true },
          },
          course: {
            select: { id: true, name: true, code: true },
          },
        },
      }),
      prisma.homework.count({ where }),
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
    const homework = await prisma.homework.findFirst({
      where: { id, isDeleted: false },
      include: {
        subject: {
          select: { id: true, subjectName: true, subjectCode: true },
        },
        batch: {
          select: { id: true, batchName: true },
        },
        faculty: {
          select: { id: true, firstName: true, lastName: true, facultyId: true, email: true },
        },
        department: {
          select: { id: true, name: true, code: true },
        },
        course: {
          select: { id: true, name: true, code: true },
        },
        attachments: true,
      },
    });

    if (!homework) {
      throw AppError.notFound('Homework not found');
    }

    return homework;
  },

  async create(data: CreateHomeworkInput, userId: string) {
    const homework = await prisma.homework.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
        createdById: userId,
        updatedById: userId,
      },
      include: {
        subject: {
          select: { id: true, subjectName: true },
        },
        faculty: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return homework;
  },

  async update(id: string, data: UpdateHomeworkInput, userId: string) {
    const existing = await prisma.homework.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      throw AppError.notFound('Homework not found');
    }

    const updateData: any = { ...data, updatedById: userId };
    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate);
    }

    const homework = await prisma.homework.update({
      where: { id },
      data: updateData,
      include: {
        subject: {
          select: { id: true, subjectName: true },
        },
        faculty: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return homework;
  },

  async delete(id: string, userId: string) {
    const existing = await prisma.homework.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      throw AppError.notFound('Homework not found');
    }

    const homework = await prisma.homework.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedById: userId,
      },
    });

    return homework;
  },

  async getByFaculty(facultyId: string) {
    const homeworks = await prisma.homework.findMany({
      where: {
        facultyId,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        subject: {
          select: { id: true, subjectName: true, subjectCode: true },
        },
        batch: {
          select: { id: true, batchName: true },
        },
        department: {
          select: { id: true, name: true },
        },
        course: {
          select: { id: true, name: true },
        },
      },
    });

    return homeworks;
  },
};
