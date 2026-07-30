import * as db from '../../shared/utils/db';
import { query } from '../../config/database';

export const auditService = {
  async getAll(params: any) {
    const { page = 1, limit = 10, action, entity, userId, startDate, endDate, sortBy = 'createdAt', sortOrder = 'DESC' } = params;
    const conditions: any[] = [];
    if (action) conditions.push({ column: 'action', value: action });
    if (entity) conditions.push({ column: 'entity', value: entity });
    if (userId) conditions.push({ column: 'userId', value: userId });
    if (startDate) conditions.push({ column: 'createdAt', value: startDate, operator: '>=' });
    if (endDate) conditions.push({ column: 'createdAt', value: endDate, operator: '<=' });
    const records = await db.findMany('audit_logs', {
      where: conditions,
      orderBy: [{ column: sortBy, dir: sortOrder }],
      offset: (page - 1) * limit,
      limit,
    });
    const total = await db.count('audit_logs', conditions);
    return { data: records, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    return db.findUnique('audit_logs', [{ column: 'id', value: id }]);
  },

  async create(data: Record<string, unknown>) {
    return db.create('audit_logs', data);
  },

  async getSummary(params: any) {
    const { startDate, endDate, userId } = params;
    const conditions: string[] = [];
    if (startDate) conditions.push(`created_at >= '${startDate}'`);
    if (endDate) conditions.push(`created_at <= '${endDate}'`);
    if (userId) conditions.push(`user_id = '${userId}'`);
    const where = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
    const result = await query(`SELECT action, COUNT(*) as count FROM audit_logs${where} GROUP BY action ORDER BY count DESC`);
    return result.rows;
  },

  async getUserActivity(userId: string, params: any) {
    const { limit = 20 } = params;
    return db.findMany('audit_logs', {
      where: [{ column: 'userId', value: userId }],
      orderBy: [{ column: 'createdAt', dir: 'DESC' }],
      limit,
    });
  },
};
