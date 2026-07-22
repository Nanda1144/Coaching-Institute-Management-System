import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';

export class CorrectionService {
  async requestCorrection(data: {
    attendanceId: string;
    requestedStatus: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
    reason: string;
    attachmentUrl?: string;
  }, userId: string) {
    const attendance = await db.findFirst('attendances', {
      where: [
        { column: 'id', value: data.attendanceId },
        { column: 'isDeleted', value: false },
      ],
    });
    if (!attendance) throw AppError.notFound('Attendance record not found');

    const existing = await db.findFirst('attendance_corrections', {
      where: [
        { column: 'attendanceId', value: data.attendanceId },
        { column: 'approvalStatus', value: 'pending' },
      ],
    });
    if (existing) throw AppError.conflict('A pending correction request already exists for this attendance');

    const correction = await db.create('attendance_corrections', {
      attendanceId: data.attendanceId,
      studentId: attendance.studentId,
      attendanceDate: attendance.attendanceDate,
      currentStatus: attendance.attendanceStatus,
      requestedStatus: data.requestedStatus,
      reason: data.reason,
      attachmentUrl: data.attachmentUrl,
      createdById: userId,
    });
    return correction;
  }

  async approveCorrection(id: string, userId: string) {
    const correction = await db.findUnique('attendance_corrections', [{ column: 'id', value: id }]);
    if (!correction) throw AppError.notFound('Correction request not found');
    if (correction.approvalStatus !== 'pending') throw AppError.badRequest('Correction request is already ' + correction.approvalStatus);

    const updated = await db.transact(async (q) => {
      const corrResult = await q(
        'UPDATE "attendance_corrections" SET approval_status = $1, approved_by_id = $2, approval_date = NOW() WHERE id = $3 RETURNING *',
        ['approved', userId, id]
      );
      await q(
        'UPDATE "attendances" SET attendance_status = $1, updated_by_id = $2 WHERE id = $3',
        [correction.requestedStatus, userId, correction.attendanceId]
      );
      return corrResult.rows[0];
    });
    return updated;
  }

  async rejectCorrection(id: string, userId: string) {
    const correction = await db.findUnique('attendance_corrections', [{ column: 'id', value: id }]);
    if (!correction) throw AppError.notFound('Correction request not found');
    if (correction.approvalStatus !== 'pending') throw AppError.badRequest('Correction request is already ' + correction.approvalStatus);

    const updated = await db.update('attendance_corrections', [{ column: 'id', value: id }], {
      approvalStatus: 'rejected',
      approvedById: userId,
      approvalDate: new Date(),
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

    const whereConditions: { column: string; value: any }[] = [];
    if (query.status) whereConditions.push({ column: 'approvalStatus', value: query.status });
    if (query.studentId) whereConditions.push({ column: 'studentId', value: query.studentId });
    if (query.attendanceId) whereConditions.push({ column: 'attendanceId', value: query.attendanceId });

    const [data, total] = await Promise.all([
      db.findMany('attendance_corrections', {
        where: whereConditions,
        offset: skip,
        limit,
        orderBy: [{ column: 'createdAt', dir: 'DESC' }],
      }),
      db.count('attendance_corrections', whereConditions),
    ]);

    return {
      data: data ?? [],
      pagination: {
        page,
        limit,
        total: total ?? 0,
        totalPages: Math.ceil((total ?? 0) / limit),
      },
    };
  }
}

export const correctionService = new CorrectionService();
