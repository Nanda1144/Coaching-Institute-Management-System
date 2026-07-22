import * as db from '../../shared/utils/db';

export const notificationService = {
  async getAll(params?: Record<string, unknown>) {
    const where: any[] = [{ column: 'isDeleted', value: false }];
    if (params?.target) {
      where.push({ column: 'target', value: String(params.target) });
    }
    return db.findMany('notification_broadcasts', {
      where,
      orderBy: [{ column: 'createdAt', dir: 'DESC' }],
    });
  },

  async getHistory() {
    return db.findMany('notification_broadcasts', {
      where: [{ column: 'isDeleted', value: false }],
      orderBy: [{ column: 'createdAt', dir: 'DESC' }],
    });
  },

  async send(data: Record<string, unknown>, userId?: string) {
    return db.create('notification_broadcasts', {
      title: data.title,
      message: data.message,
      target: data.target || 'all',
      sentBy: userId || 'system',
    });
  },

  async markRead(id: string) {
    return db.update('notification_broadcasts', [{ column: 'id', value: id }], { readAt: new Date() });
  },

  async remove(id: string) {
    return db.update('notification_broadcasts', [{ column: 'id', value: id }], { isDeleted: true, deletedAt: new Date() });
  },
};
