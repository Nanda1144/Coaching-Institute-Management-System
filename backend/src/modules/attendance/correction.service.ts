import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import { AttendanceStatus, CorrectionApprovalStatus, Prisma } from '@prisma/client';

export class CorrectionService {
  async requestCorrection(data: {
    attendanceId: string;
    requestedStatus: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
    reason: string;
    attachmentUrl?: string;
  }, userId: string) {
    const attendance = await prisma.attendance.findFirst({
      where: { id: data.attendanceId, isDeleted: false },
    });
    if (!attendance) throw AppError.notFound('Attendance record not found');

    const existing = await prisma.attendanceCorrection.findFirst({
      where: { attendanceId: data.attendanceId, approvalStatus: 'pending' },
    });
    if (existing) throw AppError.conflict('A pending correction request already exists for this attendance');

    const correction = await prisma.attendanceCorrection.create({
      data: {
        attendanceId: data.attendanceId,
        studentId: attendance.studentId,
        attendanceDate: attendance.attendanceDate,
        currentStatus: attendance.attendanceStatus,
        requestedStatus: data.requestedStatus as AttendanceStatus,
        reason: data.reason,
        attachmentUrl: data.attachmentUrl,
        createdById: userId,
      },
      include: { attendance: true, student: true },
    });
    return correction;
  }

  async approveCorrection(id: string, userId: string) {
    const correction = await prisma.attendanceCorrection.findUnique({
      where: { id },
      include: { attendance: true },
    });
    if (!correction) throw AppError.notFound('Correction request not found');
    if (correction.approvalStatus !== 'pending') throw AppError.badRequest('Correction request is already ' + correction.approvalStatus);

    const [updated] = await prisma.$transaction([
      prisma.attendanceCorrection.update({
        where: { id },
        data: {
          approvalStatus: 'approved' as CorrectionApprovalStatus,
          approvedById: userId,
          approvalDate: new Date(),
        },
      }),
      prisma.attendance.update({
        where: { id: correction.attendanceId },
        data: {
          attendanceStatus: correction.requestedStatus,
          updatedById: userId,
        },
      }),
    ]);
    return updated;
  }

  async rejectCorrection(id: string, userId: string) {
    const correction = await prisma.attendanceCorrection.findUnique({
      where: { id },
    });
    if (!correction) throw AppError.notFound('Correction request not found');
    if (correction.approvalStatus !== 'pending') throw AppError.badRequest('Correction request is already ' + correction.approvalStatus);

    const updated = await prisma.attendanceCorrection.update({
      where: { id },
      data: {
        approvalStatus: 'rejected' as CorrectionApprovalStatus,
        approvedById: userId,
        approvalDate: new Date(),
      },
    });
    return updated;
  }

  async getCorrections(query: {
    page?: number;
    limit?: number;
    status?: string;
    studentId?: string;
    attendanceId?: string;
  }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.AttendanceCorrectionWhereInput = {};
    if (query.status) where.approvalStatus = query.status as CorrectionApprovalStatus;
    if (query.studentId) where.studentId = query.studentId;
    if (query.attendanceId) where.attendanceId = query.attendanceId;

    const [data, total] = await Promise.all([
      prisma.attendanceCorrection.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          attendance: true,
          student: true,
          approvedBy: true,
          createdBy: true,
        },
      }),
      prisma.attendanceCorrection.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const correctionService = new CorrectionService();
