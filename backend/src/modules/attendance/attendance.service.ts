import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import { AttendanceMethod, AttendanceStatus, Prisma } from '@prisma/client';
import { InputJsonValue } from '@prisma/client/runtime/library';

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
    const attendance = await prisma.attendance.create({
      data: {
        attendanceCode,
        studentId: data.studentId,
        facultyId: userId,
        subjectId: data.subjectId,
        batchId: data.batchId,
        classroomId: data.classroomId ?? '',
        attendanceDate: new Date(data.attendanceDate).toISOString(),
        startTime: data.startTime,
        endTime: data.endTime,
        attendanceMethod: data.attendanceMethod as AttendanceMethod,
        attendanceStatus: data.attendanceStatus as AttendanceStatus,
        remarks: data.remarks,
        createdById: userId,
        updatedById: userId,
      },
      include: {
        student: true,
        subject: true,
        batch: true,
        classroom: true,
      },
    });
    return attendance;
  }

  async findAll(query: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.AttendanceWhereInput = {
      isDeleted: false,
    };

    if (query.facultyId) where.facultyId = query.facultyId;
    if (query.subjectId) where.subjectId = query.subjectId;
    if (query.batchId) where.batchId = query.batchId;
    if (query.status) where.attendanceStatus = query.status as AttendanceStatus;
    if (query.method) where.attendanceMethod = query.method as AttendanceMethod;
    if (query.date) {
      const d = new Date(query.date);
      where.attendanceDate = {
        gte: new Date(d.setHours(0, 0, 0, 0)),
        lte: new Date(d.setHours(23, 59, 59, 999)),
      };
    }
    if (query.startDate || query.endDate) {
      where.attendanceDate = {
        ...(where.attendanceDate as object || {}),
        ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
        ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
      };
    }

    const [data, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          student: true,
          subject: true,
          batch: true,
          classroom: true,
          createdBy: true,
        },
      }),
      prisma.attendance.count({ where }),
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

  async findById(id: string) {
    const attendance = await prisma.attendance.findFirst({
      where: { id, isDeleted: false },
      include: {
        student: true,
        subject: true,
        batch: true,
        classroom: true,
        createdBy: true,
        updatedBy: true,
      },
    });
    if (!attendance) throw AppError.notFound('Attendance record not found');
    return attendance;
  }

  async update(id: string, data: any, userId: string) {
    const existing = await this.findById(id);
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

    const attendance = await prisma.attendance.update({
      where: { id },
      data: updateData,
      include: {
        student: true,
        subject: true,
        batch: true,
        classroom: true,
      },
    });
    return attendance;
  }

  async delete(id: string, userId: string) {
    await this.findById(id);
    await prisma.attendance.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date(), updatedById: userId },
    });
  }

  async getTodayAttendance(facultyId: string, date?: string) {
    const today = date ? new Date(date) : new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const records = await prisma.attendance.findMany({
      where: {
        facultyId,
        attendanceDate: { gte: startOfDay, lte: endOfDay },
        isDeleted: false,
      },
      include: {
        student: true,
        subject: true,
        batch: true,
      },
    });

    const total = records.length;
    const present = records.filter((r) => r.attendanceStatus === 'present').length;
    const absent = records.filter((r) => r.attendanceStatus === 'absent').length;
    const late = records.filter((r) => r.attendanceStatus === 'late').length;
    const halfDay = records.filter((r) => r.attendanceStatus === 'half_day').length;
    const leave = records.filter((r) => r.attendanceStatus === 'leave').length;

    return {
      date: startOfDay,
      summary: { total, present, absent, late, halfDay, leave },
      records,
    };
  }

  async getAttendanceStats(facultyId: string, params: { subjectId?: string; month?: number; year?: number }) {
    const where: Prisma.AttendanceWhereInput = {
      facultyId,
      isDeleted: false,
    };
    if (params.subjectId) where.subjectId = params.subjectId;
    if (params.month || params.year) {
      const dateFilter: any = {};
      if (params.year) {
        const m = params.month ?? 1;
        dateFilter.gte = new Date(params.year, m - 1, 1);
        dateFilter.lt = new Date(params.year, m, 1);
      } else if (params.month) {
        const now = new Date();
        dateFilter.gte = new Date(now.getFullYear(), params.month - 1, 1);
        dateFilter.lt = new Date(now.getFullYear(), params.month, 1);
      }
      where.attendanceDate = dateFilter;
    }

    const records = await prisma.attendance.findMany({
      where,
      include: { subject: true },
    });

    const total = records.length;
    const present = records.filter((r) => r.attendanceStatus === 'present').length;
    const absent = records.filter((r) => r.attendanceStatus === 'absent').length;
    const late = records.filter((r) => r.attendanceStatus === 'late').length;
    const halfDay = records.filter((r) => r.attendanceStatus === 'half_day').length;
    const leave = records.filter((r) => r.attendanceStatus === 'leave').length;
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    const subjectMap = new Map<string, { subjectId: string; subjectName: string; total: number; present: number; absent: number; late: number; halfDay: number; leave: number }>();
    for (const r of records) {
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
    for (const r of records) {
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
