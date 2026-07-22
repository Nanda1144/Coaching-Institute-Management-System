import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';
import { sendNotification } from '../../shared/utils/notification-helper';

function generateAttendanceCode(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ATT-${y}${m}${d}-${rand}`;
}

export class AttendanceService {
  async create(data: any, userId: string) {
    const attendanceCode = generateAttendanceCode();
    const attendance = await db.create('attendances', {
      attendanceCode,
      studentId: data.studentId,
      facultyId: userId,
      subjectId: data.subjectId,
      batchId: data.batchId,
      classroomId: data.classroomId ?? '',
      attendanceDate: new Date(data.attendanceDate).toISOString(),
      startTime: data.startTime,
      endTime: data.endTime,
      attendanceMethod: data.attendanceMethod,
      attendanceStatus: data.attendanceStatus,
      remarks: data.remarks,
      createdById: userId,
      updatedById: userId,
    });

    await sendNotification(
      'Attendance Marked',
      `Your attendance has been marked for ${new Date(data.attendanceDate).toLocaleDateString()} - ${data.attendanceStatus}`,
      data.studentId
    );

    return attendance;
  }

  async findAll(query: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const whereConditions: { column: string; operator?: string; value: any }[] = [
      { column: 'isDeleted', value: false },
    ];

    if (query.facultyId) whereConditions.push({ column: 'facultyId', value: query.facultyId });
    if (query.subjectId) whereConditions.push({ column: 'subjectId', value: query.subjectId });
    if (query.batchId) whereConditions.push({ column: 'batchId', value: query.batchId });
    if (query.status) whereConditions.push({ column: 'attendanceStatus', value: query.status });
    if (query.method) whereConditions.push({ column: 'attendanceMethod', value: query.method });

    if (query.date) {
      const d = new Date(query.date);
      const startOfDay = new Date(d.setHours(0, 0, 0, 0));
      const endOfDay = new Date(d.setHours(23, 59, 59, 999));
      whereConditions.push({ column: 'attendanceDate', operator: '>=', value: startOfDay });
      whereConditions.push({ column: 'attendanceDate', operator: '<=', value: endOfDay });
    }
    if (query.startDate) {
      whereConditions.push({ column: 'attendanceDate', operator: '>=', value: new Date(query.startDate) });
    }
    if (query.endDate) {
      whereConditions.push({ column: 'attendanceDate', operator: '<=', value: new Date(query.endDate) });
    }

    const [data, total] = await Promise.all([
      db.findMany('attendances', {
        where: whereConditions,
        offset: skip,
        limit,
        orderBy: [{ column: 'createdAt', dir: 'DESC' }],
      }),
      db.count('attendances', whereConditions),
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

  async findById(id: string) {
    const attendance = await db.findFirst('attendances', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });
    if (!attendance) throw AppError.notFound('Attendance record not found');
    return attendance;
  }

  async update(id: string, data: any, userId: string) {
    await this.findById(id);
    const updateData: any = { updatedById: userId };
    if (data.studentId !== undefined) updateData.studentId = data.studentId;
    if (data.subjectId !== undefined) updateData.subjectId = data.subjectId;
    if (data.batchId !== undefined) updateData.batchId = data.batchId;
    if (data.classroomId !== undefined) updateData.classroomId = data.classroomId;
    if (data.attendanceDate !== undefined) updateData.attendanceDate = new Date(data.attendanceDate).toISOString();
    if (data.startTime !== undefined) updateData.startTime = data.startTime;
    if (data.endTime !== undefined) updateData.endTime = data.endTime;
    if (data.attendanceMethod !== undefined) updateData.attendanceMethod = data.attendanceMethod;
    if (data.attendanceStatus !== undefined) updateData.attendanceStatus = data.attendanceStatus;
    if (data.remarks !== undefined) updateData.remarks = data.remarks;

    const attendance = await db.update('attendances', [{ column: 'id', value: id }], updateData);
    return attendance;
  }

  async delete(id: string, userId: string) {
    await this.findById(id);
    await db.update('attendances', [{ column: 'id', value: id }], {
      isDeleted: true,
      deletedAt: new Date(),
      updatedById: userId,
    });
  }

  async getTodayAttendance(facultyId: string, date?: string) {
    const today = date ? new Date(date) : new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const records = await db.findMany('attendances', {
      where: [
        { column: 'facultyId', value: facultyId },
        { column: 'isDeleted', value: false },
        { column: 'attendanceDate', operator: '>=', value: startOfDay },
        { column: 'attendanceDate', operator: '<=', value: endOfDay },
      ],
    });

    const allRecords = records ?? [];
    const total = allRecords.length;
    const present = allRecords.filter((r: any) => r.attendanceStatus === 'present').length;
    const absent = allRecords.filter((r: any) => r.attendanceStatus === 'absent').length;
    const late = allRecords.filter((r: any) => r.attendanceStatus === 'late').length;
    const halfDay = allRecords.filter((r: any) => r.attendanceStatus === 'half_day').length;
    const leave = allRecords.filter((r: any) => r.attendanceStatus === 'leave').length;

    return {
      date: startOfDay,
      summary: { total, present, absent, late, halfDay, leave },
      records: allRecords,
    };
  }

  async getAttendanceStats(facultyId: string, params: { subjectId?: string; month?: number; year?: number }) {
    const whereConditions: { column: string; value: any }[] = [
      { column: 'facultyId', value: facultyId },
      { column: 'isDeleted', value: false },
    ];
    if (params.subjectId) whereConditions.push({ column: 'subjectId', value: params.subjectId });

    let extraWhere: { sql: string; params: any[] } | undefined;
    if (params.month || params.year) {
      if (params.year) {
        const m = params.month ?? 1;
        const start = new Date(params.year, m - 1, 1);
        const end = new Date(params.year, m, 1);
        extraWhere = { sql: `"attendance_date" >= $1 AND "attendance_date" < $2`, params: [start.toISOString(), end.toISOString()] };
      } else if (params.month) {
        const now = new Date();
        const start = new Date(now.getFullYear(), params.month - 1, 1);
        const end = new Date(now.getFullYear(), params.month, 1);
        extraWhere = { sql: `"attendance_date" >= $1 AND "attendance_date" < $2`, params: [start.toISOString(), end.toISOString()] };
      }
    }

    const records = await db.findMany('attendances', {
      where: whereConditions,
      extraWhere,
    });

    const allRecords = records ?? [];
    const total = allRecords.length;
    const present = allRecords.filter((r: any) => r.attendanceStatus === 'present').length;
    const absent = allRecords.filter((r: any) => r.attendanceStatus === 'absent').length;
    const late = allRecords.filter((r: any) => r.attendanceStatus === 'late').length;
    const halfDay = allRecords.filter((r: any) => r.attendanceStatus === 'half_day').length;
    const leave = allRecords.filter((r: any) => r.attendanceStatus === 'leave').length;
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    const subjectMap = new Map<string, { subjectId: string; subjectName: string; total: number; present: number; absent: number; late: number; halfDay: number; leave: number }>();
    for (const r of allRecords) {
      const sid = r.subjectId;
      if (!subjectMap.has(sid)) {
        subjectMap.set(sid, {
          subjectId: sid,
          subjectName: r.subject?.subjectName ?? 'Unknown',
          total: 0, present: 0, absent: 0, late: 0, halfDay: 0, leave: 0,
        });
      }
      const s = subjectMap.get(sid)!;
      s.total++;
      if (r.attendanceStatus === 'present') s.present++;
      else if (r.attendanceStatus === 'absent') s.absent++;
      else if (r.attendanceStatus === 'late') s.late++;
      else if (r.attendanceStatus === 'half_day') s.halfDay++;
      else if (r.attendanceStatus === 'leave') s.leave++;
    }

    const bySubject = Array.from(subjectMap.values()).map((s) => ({
      ...s,
      percentage: s.total > 0 ? Math.round(((s.present + s.late) / s.total) * 100) : 0,
    }));

    const monthMap = new Map<string, { month: number; year: number; total: number; present: number; absent: number; late: number; halfDay: number; leave: number }>();
    for (const r of allRecords) {
      const d = new Date(r.attendanceDate);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!monthMap.has(key)) {
        monthMap.set(key, {
          month: d.getMonth() + 1,
          year: d.getFullYear(),
          total: 0, present: 0, absent: 0, late: 0, halfDay: 0, leave: 0,
        });
      }
      const m = monthMap.get(key)!;
      m.total++;
      if (r.attendanceStatus === 'present') m.present++;
      else if (r.attendanceStatus === 'absent') m.absent++;
      else if (r.attendanceStatus === 'late') m.late++;
      else if (r.attendanceStatus === 'half_day') m.halfDay++;
      else if (r.attendanceStatus === 'leave') m.leave++;
    }

    const byMonth = Array.from(monthMap.values()).map((m) => ({
      ...m,
      percentage: m.total > 0 ? Math.round(((m.present + m.late) / m.total) * 100) : 0,
    }));

    return { total, present, absent, late, halfDay, leave, percentage, bySubject, byMonth };
  }
}

export const attendanceService = new AttendanceService();
