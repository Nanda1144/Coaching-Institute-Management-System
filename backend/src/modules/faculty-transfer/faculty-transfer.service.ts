import { CorrectionApprovalStatus } from '@prisma/client';
import { prisma } from '../../config/database';
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

    const where: any = {};
    if (status) where.status = status;
    if (facultyId) where.facultyId = facultyId;

    const [data, total] = await Promise.all([
      prisma.facultyTransfer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          faculty: { select: { id: true, firstName: true, lastName: true, fullName: true, employeeId: true } },
          performedByUser: { select: { id: true, firstName: true, lastName: true, fullName: true } },
        },
      }),
      prisma.facultyTransfer.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async create(data: any, userId: string) {
    const faculty = await prisma.faculty.findFirst({ where: { id: data.facultyId, isDeleted: false } });
    if (!faculty) throw AppError.notFound('Faculty not found');

    const transfer = await prisma.facultyTransfer.create({
      data: {
        facultyId: data.facultyId,
        fromBranch: data.fromBranch,
        fromDepartment: data.fromDepartment,
        toBranch: data.toBranch,
        toDepartment: data.toDepartment,
        transferDate: new Date(data.transferDate).toISOString(),
        reason: data.reason,
        performedBy: userId,
      },
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
      status: CorrectionApprovalStatus.pending,
      createdAt: new Date().toISOString(),
    });

    await prisma.faculty.update({
      where: { id: data.facultyId },
      data: { transferHistory: currentHistory },
    });

    return transfer;
  },

  async updateStatus(id: string, status: CorrectionApprovalStatus, userId: string) {
    const transfer = await prisma.facultyTransfer.findUnique({ where: { id } });
    if (!transfer) throw AppError.notFound('Faculty transfer not found');

    if (status === CorrectionApprovalStatus.approved) {
      await prisma.faculty.update({
        where: { id: transfer.facultyId },
        data: {
          branch: transfer.toBranch,
          department: transfer.toDepartment,
        },
      });

      const faculty = await prisma.faculty.findUnique({ where: { id: transfer.facultyId } });
      if (faculty) {
        const history: any[] = (faculty.transferHistory as any[]) || [];
        const updatedHistory = history.map((h: any) =>
          h.transferId === id ? { ...h, status, approvedBy: userId, updatedAt: new Date().toISOString() } : h
        );
        await prisma.faculty.update({
          where: { id: transfer.facultyId },
          data: { transferHistory: updatedHistory },
        });
      }
    }

    const updated = await prisma.facultyTransfer.update({
      where: { id },
      data: { status, approvedBy: status === CorrectionApprovalStatus.approved ? userId : undefined },
    });

    return updated;
  },

  async getByFaculty(facultyId: string) {
    const transfers = await prisma.facultyTransfer.findMany({
      where: { facultyId },
      orderBy: { createdAt: 'desc' },
      include: {
        performedByUser: { select: { id: true, firstName: true, lastName: true, fullName: true } },
      },
    });
    return transfers;
  },

  async findById(id: string) {
    const transfer = await prisma.facultyTransfer.findUnique({
      where: { id },
      include: {
        faculty: { select: { id: true, firstName: true, lastName: true, fullName: true, employeeId: true } },
        performedByUser: { select: { id: true, firstName: true, lastName: true, fullName: true } },
      },
    });
    if (!transfer) throw AppError.notFound('Faculty transfer not found');
    return transfer;
  },
};
