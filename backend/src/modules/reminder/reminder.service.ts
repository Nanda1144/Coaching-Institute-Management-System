import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';

export const reminderService = {
  async create(data: any, userId: string) {
    const reminder = await db.create('assignment_reminders', {
      assignmentId: data.assignmentId,
      studentId: data.studentId || null,
      reminderDate: new Date(data.reminderDate).toISOString(),
      reminderTime: new Date(data.reminderTime).toISOString(),
      reminderType: data.reminderType,
      notificationChannel: data.notificationChannel,
      frequency: data.frequency || 'once',
      createdById: userId,
    });
    return reminder;
  },

  async findAll(query: {
    page: number;
    limit: number;
    status?: string;
    assignmentId?: string;
  }) {
    const { page, limit, status, assignmentId } = query;
    const skip = (page - 1) * limit;

    const where: any[] = [{ column: 'isDeleted', value: false }];
    if (status) where.push({ column: 'status', value: status });
    if (assignmentId) where.push({ column: 'assignmentId', value: assignmentId });

    const [data, total] = await Promise.all([
      db.findMany('assignment_reminders', {
        where,
        offset: skip,
        limit,
        orderBy: [{ column: 'reminderDate', dir: 'asc' }],
      }),
      db.count('assignment_reminders', where),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    const reminder = await db.findFirst('assignment_reminders', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });
    if (!reminder) throw AppError.notFound('Reminder not found');
    return reminder;
  },

  async update(id: string, data: any, userId: string) {
    await this.findById(id);
    const updateData: any = { ...data, updatedById: userId };
    if (data.reminderDate) updateData.reminderDate = new Date(data.reminderDate).toISOString();
    if (data.reminderTime) updateData.reminderTime = new Date(data.reminderTime).toISOString();

    const reminder = await db.update('assignment_reminders',
      [{ column: 'id', value: id }],
      updateData,
    );
    return reminder;
  },

  async delete(id: string, userId: string) {
    await this.findById(id);
    const reminder = await db.update('assignment_reminders',
      [{ column: 'id', value: id }],
      { isDeleted: true, deletedAt: new Date(), updatedById: userId },
    );
    return reminder;
  },

  async markSent(id: string) {
    await this.findById(id);
    const reminder = await db.update('assignment_reminders',
      [{ column: 'id', value: id }],
      { status: 'sent', sentAt: new Date() },
    );
    return reminder;
  },

  async getMyReminders(facultyId: string) {
    const reminders = await db.findMany('assignment_reminders', {
      where: [
        { column: 'isDeleted', value: false },
        { column: 'createdById', value: facultyId },
      ],
      orderBy: [{ column: 'reminderDate', dir: 'asc' }],
    });
    return reminders;
  },
};
