import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';

export const holidayService = {
  async create(data: any, userId: string) {
    const holiday = await prisma.holiday.create({
      data: {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        createdBy: userId,
        updatedBy: userId,
      },
    });
    return holiday;
  },

  async findAll(query: { page: number; limit: number; holidayType?: string; academicYear?: string }) {
    const { page, limit, holidayType, academicYear } = query;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };
    if (holidayType) where.holidayType = holidayType;
    if (academicYear) where.academicYear = academicYear;

    const [data, total] = await Promise.all([
      prisma.holiday.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'asc' },
      }),
      prisma.holiday.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    const holiday = await prisma.holiday.findFirst({
      where: { id, isDeleted: false },
    });
    if (!holiday) throw AppError.notFound('Holiday not found');
    return holiday;
  },

  async update(id: string, data: any, userId: string) {
    await this.findById(id);
    const updateData: any = { ...data, updatedBy: userId };
    if (data.startDate) updateData.startDate = new Date(data.startDate).toISOString();
    if (data.endDate) updateData.endDate = new Date(data.endDate).toISOString();

    const holiday = await prisma.holiday.update({
      where: { id },
      data: updateData,
    });
    return holiday;
  },

  async delete(id: string, userId: string) {
    await this.findById(id);
    const holiday = await prisma.holiday.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date(), updatedBy: userId },
    });
    return holiday;
  },

  async getUpcoming(days: number) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);

    const holidays = await prisma.holiday.findMany({
      where: {
        isDeleted: false,
        startDate: { gte: now, lte: future },
      },
      orderBy: { startDate: 'asc' },
    });
    return holidays;
  },

  async getStats() {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31);

    const [total, upcoming, byType] = await Promise.all([
      prisma.holiday.count({
        where: { isDeleted: false, startDate: { gte: yearStart, lte: yearEnd } },
      }),
      prisma.holiday.count({
        where: { isDeleted: false, startDate: { gte: now } },
      }),
      prisma.holiday.groupBy({
        by: ['holidayType'],
        where: { isDeleted: false, startDate: { gte: yearStart, lte: yearEnd } },
        _count: { id: true },
      }),
    ]);

    return {
      total,
      upcoming,
      byType: byType.reduce((acc: Record<string, number>, item) => {
        acc[item.holidayType] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
    };
  },

  async getSpecialEvents() {
    const now = new Date();
    const events = await prisma.holiday.findMany({
      where: {
        isDeleted: false,
        startDate: { gte: now },
        holidayType: { in: ['event', 'special', 'celebration'] },
      },
      orderBy: { startDate: 'asc' },
      take: 20,
    });
    return events;
  },
};
