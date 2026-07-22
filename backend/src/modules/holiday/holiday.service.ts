import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';

export const holidayService = {
  async create(data: any, userId: string) {
    const holiday = await db.create('holidays', {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      createdBy: userId,
      updatedBy: userId,
    });
    return holiday;
  },

  async findAll(query: { page: number; limit: number; holidayType?: string; academicYear?: string }) {
    const { page, limit, holidayType, academicYear } = query;
    const skip = (page - 1) * limit;

    const where: any[] = [{ column: 'isDeleted', value: false }];
    if (holidayType) where.push({ column: 'holidayType', value: holidayType });
    if (academicYear) where.push({ column: 'academicYear', value: academicYear });

    const [data, total] = await Promise.all([
      db.findMany('holidays', {
        where,
        offset: skip,
        limit,
        orderBy: [{ column: 'startDate', dir: 'asc' }],
      }),
      db.count('holidays', where),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    const holiday = await db.findFirst('holidays', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });
    if (!holiday) throw AppError.notFound('Holiday not found');
    return holiday;
  },

  async update(id: string, data: any, userId: string) {
    await this.findById(id);
    const updateData: any = { ...data, updatedBy: userId };
    if (data.startDate) updateData.startDate = new Date(data.startDate).toISOString();
    if (data.endDate) updateData.endDate = new Date(data.endDate).toISOString();

    const holiday = await db.update('holidays',
      [{ column: 'id', value: id }],
      updateData,
    );
    return holiday;
  },

  async delete(id: string, userId: string) {
    await this.findById(id);
    const holiday = await db.update('holidays',
      [{ column: 'id', value: id }],
      { isDeleted: true, deletedAt: new Date(), updatedBy: userId },
    );
    return holiday;
  },

  async getUpcoming(days: number) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);

    const holidays = await db.findMany('holidays', {
      where: [
        { column: 'isDeleted', value: false },
        { column: 'startDate', operator: 'gte', value: now },
        { column: 'startDate', operator: 'lte', value: future },
      ],
      orderBy: [{ column: 'startDate', dir: 'asc' }],
    });
    return holidays;
  },

  async getStats() {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31);

    const [total, upcoming, byType] = await Promise.all([
      db.count('holidays', [
        { column: 'isDeleted', value: false },
        { column: 'startDate', operator: 'gte', value: yearStart },
        { column: 'startDate', operator: 'lte', value: yearEnd },
      ]),
      db.count('holidays', [
        { column: 'isDeleted', value: false },
        { column: 'startDate', operator: 'gte', value: now },
      ]),
      db.groupBy('holidays', { by: ['holidayType'], _count: ['id'], where: [
        { column: 'isDeleted', value: false },
        { column: 'startDate', operator: 'gte', value: yearStart },
        { column: 'startDate', operator: 'lte', value: yearEnd },
      ] }),
    ]);

    return {
      total,
      upcoming,
      byType: byType.reduce((acc: Record<string, number>, item: any) => {
        acc[item.holidayType] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
    };
  },

  async getSpecialEvents() {
    const now = new Date();
    const events = await db.findMany('holidays', {
      where: [
        { column: 'isDeleted', value: false },
        { column: 'startDate', operator: 'gte', value: now },
        { column: 'holidayType', operator: 'in', value: ['event', 'special', 'celebration'] },
      ],
      orderBy: [{ column: 'startDate', dir: 'asc' }],
      limit: 20,
    });
    return events;
  },
};
