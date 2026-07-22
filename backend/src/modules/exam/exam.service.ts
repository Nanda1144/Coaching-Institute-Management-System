import * as db from '../../shared/utils/db';
import { sendNotification } from '../../shared/utils/notification-helper';

export const examService = {
  async getAll(params?: Record<string, unknown>) {
    const where: any[] = [{ column: 'isDeleted', value: false }];
    if (params?.search) {
      where.push({ column: 'title', operator: 'ILIKE', value: String(params.search) });
    }
    return db.findMany('exams', { where, orderBy: [{ column: 'date', dir: 'DESC' }] });
  },

  async getById(id: string) {
    return db.findUnique('exams', [{ column: 'id', value: id }]);
  },

  async create(data: Record<string, unknown>) {
    const exam = await db.create('exams', {
      ...data,
      date: new Date(data.date as string || Date.now()),
      status: data.status || 'scheduled',
    });

    await sendNotification(
      'New Exam Scheduled',
      `${data.title} has been scheduled on ${data.date}`,
      (data.batchId as string) || 'all'
    );

    return exam;
  },

  async update(id: string, data: Record<string, unknown>) {
    return db.update('exams', [{ column: 'id', value: id }], data);
  },

  async delete(id: string, userId?: string) {
    const updateData: Record<string, unknown> = { isDeleted: true, deletedAt: new Date() };
    if (userId) updateData.updatedById = userId;
    return db.update('exams', [{ column: 'id', value: id }], updateData);
  },
};
