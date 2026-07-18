import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';

export const reminderService = {
  async create(data: any, userId: string) {
    const reminder = await prisma.assignmentReminder.create({
      data: {
        assignmentId: data.assignmentId,
        studentId: data.studentId || null,
        reminderDate: new Date(data.reminderDate).toISOString(),
        reminderTime: new Date(data.reminderTime).toISOString(),
        reminderType: data.reminderType,
        notificationChannel: data.notificationChannel,
        frequency: data.frequency || 'once',
        createdById: userId,
      },
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

    const where: any = { isDeleted: false };
    if (status) where.status = status;
    if (assignmentId) where.assignmentId = assignmentId;

    const [data, total] = await Promise.all([
      prisma.assignmentReminder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { reminderDate: 'asc' },
        include: { assignment: { select: { title: true } } },
      }),
      prisma.assignmentReminder.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    const reminder = await prisma.assignmentReminder.findFirst({
      where: { id, isDeleted: false },
    });
    if (!reminder) throw AppError.notFound('Reminder not found');
    return reminder;
  },

  async update(id: string, data: any, userId: string) {
    await this.findById(id);
    const updateData: any = { ...data, updatedById: userId };
    if (data.reminderDate) updateData.reminderDate = new Date(data.reminderDate).toISOString();
    if (data.reminderTime) updateData.reminderTime = new Date(data.reminderTime).toISOString();

    const reminder = await prisma.assignmentReminder.update({
      where: { id },
      data: updateData,
    });
    return reminder;
  },

  async delete(id: string, userId: string) {
    await this.findById(id);
    const reminder = await prisma.assignmentReminder.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date(), updatedById: userId },
    });
    return reminder;
  },

  async markSent(id: string) {
    await this.findById(id);
    const reminder = await prisma.assignmentReminder.update({
      where: { id },
      data: { status: 'sent', sentAt: new Date() },
    });
    return reminder;
  },

  async getMyReminders(facultyId: string) {
    const reminders = await prisma.assignmentReminder.findMany({
      where: {
        isDeleted: false,
        createdById: facultyId,
      },
      orderBy: { reminderDate: 'asc' },
      include: { assignment: { select: { title: true, dueDate: true } } },
    });
    return reminders;
  },
};
