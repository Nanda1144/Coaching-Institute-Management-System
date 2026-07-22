import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';

export const facultyTransferService = {
  async findAll(query: {
    page: number;
    limit: number;
    status?: string;
    facultyId?: string;
  }) {
    const { page, limit, status, facultyId } = query;
    const skip = (page - 1) * limit;

    const where: any[] = [];
    if (status) where.push({ column: 'status', value: status });
    if (facultyId) where.push({ column: 'facultyId', value: facultyId });

    const [data, total] = await Promise.all([
      db.findMany('faculty_transfers', {
        where,
        offset: skip,
        limit,
        orderBy: [{ column: 'createdAt', dir: 'desc' }],
      }),
      db.count('faculty_transfers', where),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async create(data: any, userId: string) {
    const faculty = await db.findFirst('faculty', { where: [{ column: 'id', value: data.facultyId }, { column: 'isDeleted', value: false }] });
    if (!faculty) throw AppError.notFound('Faculty not found');

    return db.transact(async () => {
      const transfer = await db.create('faculty_transfers', {
        facultyId: data.facultyId,
        fromBranch: data.fromBranch,
        fromDepartment: data.fromDepartment,
        toBranch: data.toBranch,
        toDepartment: data.toDepartment,
        transferDate: new Date(data.transferDate).toISOString(),
        reason: data.reason,
        performedBy: userId,
      });

      const currentHistory: any[] = (faculty.transferHistory as any[]) || [];
      currentHistory.push({
        transferId: transfer.id,
        fromBranch: data.fromBranch,
        fromDepartment: data.fromDepartment,
        toBranch: data.toBranch,
        toDepartment: data.toDepartment,
        transferDate: data.transferDate,
        reason: data.reason,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      await db.update('faculty',
        [{ column: 'id', value: data.facultyId }],
        { transferHistory: currentHistory },
      );

      return transfer;
    });
  },

  async updateStatus(id: string, status: string, userId: string) {
    const transfer = await db.findUnique('faculty_transfers', [{ column: 'id', value: id }]);
    if (!transfer) throw AppError.notFound('Faculty transfer not found');

    return db.transact(async () => {
      if (status === 'approved') {
        await db.update('faculty',
          [{ column: 'id', value: transfer.facultyId }],
          {
            branch: transfer.toBranch,
            department: transfer.toDepartment,
          },
        );

        const faculty = await db.findUnique('faculty', [{ column: 'id', value: transfer.facultyId }]);
        if (faculty) {
          const history: any[] = (faculty.transferHistory as any[]) || [];
          const updatedHistory = history.map((h: any) =>
            h.transferId === id ? { ...h, status, approvedBy: userId, updatedAt: new Date().toISOString() } : h
          );
          await db.update('faculty',
            [{ column: 'id', value: transfer.facultyId }],
            { transferHistory: updatedHistory },
          );
        }
      }

      const updated = await db.update('faculty_transfers',
        [{ column: 'id', value: id }],
        { status, approvedBy: status === 'approved' ? userId : undefined },
      );

      return updated;
    });
  },

  async getByFaculty(facultyId: string) {
    const transfers = await db.findMany('faculty_transfers', {
      where: [{ column: 'facultyId', value: facultyId }],
      orderBy: [{ column: 'createdAt', dir: 'desc' }],
    });
    return transfers;
  },

  async findById(id: string) {
    const transfer = await db.findUnique('faculty_transfers', [{ column: 'id', value: id }]);
    if (!transfer) throw AppError.notFound('Faculty transfer not found');
    return transfer;
  },
};
