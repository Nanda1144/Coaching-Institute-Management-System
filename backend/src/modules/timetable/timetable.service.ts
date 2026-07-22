import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';
import { sendNotification } from '../../shared/utils/notification-helper';
import type { z } from 'zod';
import type { timetableQuerySchema } from './timetable.validator';
import type { CreateTimetableInput, UpdateTimetableInput } from './timetable.validator';

export class TimetableService {
  async findAll(query: z.infer<typeof timetableQuerySchema>) {
    const { page, limit, facultyId, dayOfWeek, department, semester } = query;
    const skip = (page - 1) * limit;

    const where: any[] = [{ column: 'isDeleted', value: false }];
    if (facultyId) where.push({ column: 'facultyId', value: facultyId });
    if (dayOfWeek) where.push({ column: 'dayOfWeek', value: dayOfWeek });
    if (department) where.push({ column: 'department', value: department });
    if (semester) where.push({ column: 'semester', value: semester });

    const [data, total] = await Promise.all([
      db.findMany('timetables', {
        where,
        offset: skip,
        limit,
        orderBy: [{ column: 'startTime', dir: 'asc' }],
      }),
      db.count('timetables', where),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByFaculty(facultyId: string) {
    const facultyExists = await db.findFirst('faculty', {
      where: [
        { operator: 'OR', conditions: [
          { column: 'id', value: facultyId },
          { column: 'facultyId', value: facultyId },
        ]},
        { column: 'isDeleted', value: false },
      ],
    });
    if (!facultyExists) throw AppError.notFound('Faculty not found');

    const timetables = await db.findMany('timetables', {
      where: [
        { column: 'facultyId', value: facultyExists.facultyId },
        { column: 'isDeleted', value: false },
      ],
      orderBy: [{ column: 'startTime', dir: 'asc' }],
    });

    const grouped = timetables.reduce<Record<string, typeof timetables>>((acc, t) => {
      if (!acc[t.dayOfWeek]) acc[t.dayOfWeek] = [];
      acc[t.dayOfWeek].push(t);
      return acc;
    }, {});

    return grouped;
  }

  async findByDay(facultyId: string, dayOfWeek: string) {
    const facultyExists = await db.findFirst('faculty', {
      where: [
        { column: 'id', value: facultyId },
        { column: 'isDeleted', value: false },
      ],
    });
    if (!facultyExists) throw AppError.notFound('Faculty not found');

    const timetables = await db.findMany('timetables', {
      where: [
        { column: 'facultyId', value: facultyId },
        { column: 'dayOfWeek', value: dayOfWeek },
        { column: 'isDeleted', value: false },
      ],
      orderBy: [{ column: 'startTime', dir: 'asc' }],
    });

    return timetables;
  }

  async findById(id: string) {
    const timetable = await db.findFirst('timetables', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });
    if (!timetable) throw AppError.notFound('Timetable entry not found');
    return timetable;
  }

  async checkForConflicts(data: { dayOfWeek: string; startTime: string; endTime: string; facultyId: string; classroomId?: string; excludeId?: string }) {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    const conflictWhere: any[] = [
      { column: 'dayOfWeek', value: data.dayOfWeek },
      { column: 'isDeleted', value: false },
      { column: 'startTime', operator: '<', value: endTime },
      { column: 'endTime', operator: '>', value: startTime },
    ];
    if (data.excludeId) conflictWhere.push({ column: 'id', operator: '!=', value: data.excludeId });

    const facultyConflict = await db.findFirst('timetables', {
      where: [...conflictWhere, { column: 'facultyId', value: data.facultyId }],
      select: ['id', 'subject', 'dayOfWeek', 'startTime', 'endTime', 'facultyName'],
    });
    if (facultyConflict) {
      throw AppError.conflict(
        `Faculty ${facultyConflict.facultyName} already has "${facultyConflict.subject}" scheduled on ${facultyConflict.dayOfWeek} from ${new Date(facultyConflict.startTime).toLocaleTimeString()} to ${new Date(facultyConflict.endTime).toLocaleTimeString()}`
      );
    }

    if (data.classroomId) {
      const roomConflict = await db.findFirst('timetables', {
        where: [...conflictWhere, { column: 'classroomId', value: data.classroomId }],
        select: ['id', 'subject', 'dayOfWeek', 'startTime', 'endTime', 'facultyName', 'roomNumber'],
      });
      if (roomConflict) {
        throw AppError.conflict(
          `Room ${roomConflict.roomNumber} is already booked for "${roomConflict.subject}" on ${roomConflict.dayOfWeek} from ${new Date(roomConflict.startTime).toLocaleTimeString()} to ${new Date(roomConflict.endTime).toLocaleTimeString()}`
        );
      }
    }
  }

  async create(data: CreateTimetableInput, userId: string) {
    await this.checkForConflicts(data);
    const timetable = await db.create('timetables', {
      ...data,
      timetableId: data.timetableId || `TT-${Date.now()}`,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      recurrenceEndDate: data.recurrenceEndDate ? new Date(data.recurrenceEndDate) : undefined,
      createdBy: userId,
      updatedBy: userId,
    });

    await sendNotification(
      'Timetable Updated',
      `A new class has been scheduled: ${data.subject} on ${data.dayOfWeek} at ${data.startTime}`,
      data.batchId
    );

    return timetable;
  }

  async update(id: string, data: UpdateTimetableInput, userId: string) {
    const existing = await db.findFirst('timetables', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });
    if (!existing) throw AppError.notFound('Timetable entry not found');

    if (data.dayOfWeek && data.startTime && data.endTime && data.facultyId) {
      await this.checkForConflicts({
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        facultyId: data.facultyId,
        classroomId: data.classroomId,
        excludeId: id,
      });
    }

    const updateData: any = { ...data, updatedBy: userId };
    if (data.startTime) updateData.startTime = new Date(data.startTime);
    if (data.endTime) updateData.endTime = new Date(data.endTime);
    if (data.recurrenceEndDate) updateData.recurrenceEndDate = new Date(data.recurrenceEndDate);
    delete updateData.timetableId;

    const timetable = await db.update('timetables',
      [{ column: 'id', value: id }],
      updateData,
    );
    return timetable;
  }

  async delete(id: string, userId: string) {
    const existing = await db.findFirst('timetables', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });
    if (!existing) throw AppError.notFound('Timetable entry not found');

    const timetable = await db.update('timetables',
      [{ column: 'id', value: id }],
      { isDeleted: true, deletedAt: new Date(), updatedBy: userId },
    );
    return timetable;
  }
}

export const timetableService = new TimetableService();
