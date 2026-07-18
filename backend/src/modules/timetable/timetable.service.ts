import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import type { z } from 'zod';
import type { timetableQuerySchema } from './timetable.validator';
import type { CreateTimetableInput, UpdateTimetableInput } from './timetable.validator';

export class TimetableService {
  async findAll(query: z.infer<typeof timetableQuerySchema>) {
    const { page, limit, facultyId, dayOfWeek, department, semester } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.TimetableWhereInput = {
      isDeleted: false,
      ...(facultyId && { facultyId }),
      ...(dayOfWeek && { dayOfWeek }),
      ...(department && { department }),
      ...(semester && { semester }),
    };

    const [data, total] = await Promise.all([
      prisma.timetable.findMany({
        where,
        skip,
        take: limit,
        include: {
          faculty: true,
          subjectRef: true,
          batchRef: true,
          classroom: true,
        },
        orderBy: { startTime: 'asc' },
      }),
      prisma.timetable.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByFaculty(facultyId: string) {
    const facultyExists = await prisma.faculty.findUnique({ where: { id: facultyId, isDeleted: false } });
    if (!facultyExists) throw AppError.notFound('Faculty not found');

    const timetables = await prisma.timetable.findMany({
      where: { facultyId, isDeleted: false },
      include: { subjectRef: true, batchRef: true, classroom: true },
      orderBy: { startTime: 'asc' },
    });

    const grouped = timetables.reduce<Record<string, typeof timetables>>((acc, t) => {
      if (!acc[t.dayOfWeek]) acc[t.dayOfWeek] = [];
      acc[t.dayOfWeek].push(t);
      return acc;
    }, {});

    return grouped;
  }

  async findByDay(facultyId: string, dayOfWeek: string) {
    const facultyExists = await prisma.faculty.findUnique({ where: { id: facultyId, isDeleted: false } });
    if (!facultyExists) throw AppError.notFound('Faculty not found');

    const timetables = await prisma.timetable.findMany({
      where: { facultyId, dayOfWeek, isDeleted: false },
      include: { subjectRef: true, batchRef: true, classroom: true },
      orderBy: { startTime: 'asc' },
    });

    return timetables;
  }

  async findById(id: string) {
    const timetable = await prisma.timetable.findFirst({
      where: { id, isDeleted: false },
      include: {
        faculty: true,
        subjectRef: true,
        batchRef: true,
        classroom: true,
      },
    });
    if (!timetable) throw AppError.notFound('Timetable entry not found');
    return timetable;
  }

  async create(data: CreateTimetableInput, userId: string) {
    const timetable = await prisma.timetable.create({
      data: {
        ...data,
        timetableId: data.timetableId || `TT-${Date.now()}`,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        recurrenceEndDate: data.recurrenceEndDate ? new Date(data.recurrenceEndDate) : undefined,
        createdBy: userId,
        updatedBy: userId,
      },
      include: {
        faculty: true,
        subjectRef: true,
        batchRef: true,
        classroom: true,
      },
    });
    return timetable;
  }

  async update(id: string, data: UpdateTimetableInput, userId: string) {
    const existing = await prisma.timetable.findFirst({
      where: { id, isDeleted: false },
    });
    if (!existing) throw AppError.notFound('Timetable entry not found');

    const updateData: any = { ...data, updatedBy: userId };
    if (data.startTime) updateData.startTime = new Date(data.startTime);
    if (data.endTime) updateData.endTime = new Date(data.endTime);
    if (data.recurrenceEndDate) updateData.recurrenceEndDate = new Date(data.recurrenceEndDate);
    delete updateData.timetableId;

    const timetable = await prisma.timetable.update({
      where: { id },
      data: updateData,
      include: {
        faculty: true,
        subjectRef: true,
        batchRef: true,
        classroom: true,
      },
    });
    return timetable;
  }

  async delete(id: string, userId: string) {
    const existing = await prisma.timetable.findFirst({
      where: { id, isDeleted: false },
    });
    if (!existing) throw AppError.notFound('Timetable entry not found');

    const timetable = await prisma.timetable.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date(), updatedBy: userId },
    });
    return timetable;
  }
}

export const timetableService = new TimetableService();
