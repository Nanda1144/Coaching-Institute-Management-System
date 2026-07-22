import bcrypt from 'bcrypt';
import * as db from '../../shared/utils/db';
import { query } from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';
import type { CreateFacultyInput, UpdateFacultyInput, FacultyQueryInput } from './faculty.validator';

function generateFacultyId(lastId?: string): string {
  const lastNum = lastId ? parseInt(lastId.split('-')[1], 10) : 0;
  return `FAC-${String(lastNum + 1).padStart(5, '0')}`;
}

async function generateUsername(firstName: string, lastName: string): Promise<string> {
  const base = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  let username = base;
  let suffix = 1;
  while (await db.findUnique('faculty', [{ column: 'username', value: username }])) {
    username = `${base}${suffix}`;
    suffix++;
  }
  return username;
}

export const facultyService = {
  async findAll(query: FacultyQueryInput) {
    const { page, limit, search, department, designation, status, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: any[] = [{ column: 'isDeleted', value: false }];

    if (search) {
      const p = `%${search}%`;
      where.push({
        column: 'search',
        operator: 'raw',
        value: `first_name ILIKE $1 OR last_name ILIKE $2 OR email ILIKE $3 OR employee_id ILIKE $4 OR faculty_id ILIKE $5`,
        params: [p, p, p, p, p],
      });
    }
    if (department) where.push({ column: 'department', value: department });
    if (designation) where.push({ column: 'designation', value: designation });
    if (status) where.push({ column: 'status', value: status });

    const orderBy: any = {};
    orderBy[sortBy || 'createdAt'] = sortOrder || 'desc';

    const [data, total] = await Promise.all([
      db.findMany('faculty', {
        where,
        offset: skip,
        limit,
        orderBy: [{ column: sortBy || 'createdAt', dir: sortOrder || 'desc' }],
      }),
      db.count('faculty', where),
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
  },

  async findById(id: string) {
    const faculty = await db.findFirst('faculty', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });
    if (!faculty) throw AppError.notFound('Faculty not found');
    return faculty;
  },

  async create(data: any, userId: string) {
    const firstName = data.fullName ? data.fullName.split(' ')[0] || '' : data.firstName || '';
    const lastName = data.fullName ? data.fullName.split(' ').slice(1).join(' ') || '' : data.lastName || '';
    const dateOfBirth = data.dateOfBirth || data.dob;
    const employeeId = data.employeeId || data.facultyId;
    const joiningDate = data.joiningDate;

    const existingEmail = await db.findUnique('faculty', [{ column: 'email', value: data.email }]);
    if (existingEmail) throw AppError.conflict('Email already in use');

    const existingPhone = await db.findUnique('faculty', [{ column: 'phone', value: data.phone }]);
    if (existingPhone) throw AppError.conflict('Phone already in use');

    if (employeeId) {
      const existingEid = await db.findUnique('faculty', [{ column: 'employeeId', value: employeeId }]);
      if (existingEid) throw AppError.conflict('Employee ID already in use');
    }

    const lastFaculty = await db.findFirst('faculty', {
      orderBy: [{ column: 'facultyId', dir: 'desc' }],
    });
    const fId = generateFacultyId(lastFaculty?.facultyId);

    const username = await generateUsername(firstName, lastName);
    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
    const hashedPassword = await bcrypt.hash(tempPassword, env.BCRYPT_SALT_ROUNDS);

    const faculty = await db.create('faculty', {
      facultyId: fId,
      firstName,
      lastName,
      fullName: data.fullName || `${firstName} ${lastName}`.trim(),
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      designation: data.designation,
      department: data.department,
      employeeId: employeeId || fId,
      joiningDate: joiningDate ? new Date(joiningDate) : undefined,
      username,
      password: hashedPassword,
      specialization: [],
      qualification: [],
      experience: 0,
      employmentType: 'full-time',
      branch: 'main',
      campus: 'main',
      address: {},
      emergencyContact: {},
      permissions: [],
      assignedCourses: [],
      assignedSubjects: [],
      assignedBatches: [],
      assignedSemesters: [],
      transferHistory: [],
      createdById: userId,
    });

    return faculty;
  },

  async update(id: string, data: UpdateFacultyInput, userId: string) {
    const existing = await db.findFirst('faculty', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });
    if (!existing) throw AppError.notFound('Faculty not found');

    if (data.email && data.email !== existing.email) {
      const emailConflict = await db.findUnique('faculty', [{ column: 'email', value: data.email }]);
      if (emailConflict) throw AppError.conflict('Email already in use');
    }

    if (data.phone && data.phone !== existing.phone) {
      const phoneConflict = await db.findUnique('faculty', [{ column: 'phone', value: data.phone }]);
      if (phoneConflict) throw AppError.conflict('Phone already in use');
    }

    if (data.employeeId && data.employeeId !== existing.employeeId) {
      const empConflict = await db.findUnique('faculty', [{ column: 'employeeId', value: data.employeeId }]);
      if (empConflict) throw AppError.conflict('Employee ID already in use');
    }

    const updateData: any = { ...data, updatedById: userId };
    if (data.firstName || data.lastName) {
      updateData.fullName = `${data.firstName || existing.firstName} ${data.lastName || existing.lastName}`;
    }
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.joiningDate) updateData.joiningDate = new Date(data.joiningDate);

    return db.transact(async () => {
      const updated = await db.update('faculty',
        [{ column: 'id', value: id }],
        updateData,
      );

      await db.create('assignment_logs', {
        facultyId: id,
        action: 'UPDATE',
        entityType: 'Faculty',
        entityId: id,
        entityName: existing.fullName,
        oldValue: JSON.parse(JSON.stringify(existing)),
        newValue: JSON.parse(JSON.stringify(updated)),
        performedBy: userId,
      });

      return updated;
    });
  },

  async delete(id: string, userId: string) {
    const faculty = await db.findFirst('faculty', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });
    if (!faculty) throw AppError.notFound('Faculty not found');

    await db.transact(async () => {
      await db.update('faculty',
        [{ column: 'id', value: id }],
        {
          isDeleted: true,
          deletedAt: new Date(),
          updatedById: userId,
        },
      );

      await db.create('assignment_logs', {
        facultyId: id,
        action: 'DELETE',
        entityType: 'Faculty',
        entityId: id,
        entityName: faculty.fullName,
        performedBy: userId,
      });
    });

    return { message: 'Faculty deleted successfully' };
  },

  async getProfile(id: string) {
    const faculty = await db.findFirst('faculty', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });
    if (!faculty) throw AppError.notFound('Faculty not found');
    return faculty;
  },

  async getDashboardStats(facultyId: string) {
    const faculty = await db.findUnique('faculty', [{ column: 'id', value: facultyId }]);
    if (!faculty) throw AppError.notFound('Faculty not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const assignedSubjectIds = (faculty.assignedSubjects as string[]) || [];
    const batchIds = (faculty.assignedBatches as string[]) || [];

    const [
      totalStudents,
      totalClasses,
      todayAttendance,
      assignments,
      upcomingSchedule,
      recentActivities,
    ] = await Promise.all([
      batchIds.length > 0
        ? db.count('students', [
          { column: 'batchId', operator: 'in', value: batchIds },
          { column: 'isDeleted', value: false },
        ])
        : Promise.resolve(0),
      db.count('timetables', [
        { column: 'facultyId', value: facultyId },
        { column: 'isDeleted', value: false },
      ]),
      db.count('attendances', [
        { column: 'facultyId', value: facultyId },
        { column: 'attendanceDate', operator: 'gte', value: today },
        { column: 'attendanceDate', operator: 'lt', value: tomorrow },
      ]),
      db.count('assignments', [
        { column: 'facultyId', value: facultyId },
        { column: 'status', value: 'active' },
        { column: 'deletedAt', value: null, operator: 'is' },
      ]),
      db.findMany('timetables', {
        where: [
          { column: 'facultyId', value: facultyId },
          { column: 'isDeleted', value: false },
          { column: 'startTime', operator: 'gte', value: new Date() },
        ],
        orderBy: [{ column: 'startTime', dir: 'asc' }],
        limit: 5,
      }),
      db.findMany('assignment_logs', {
        where: [{ column: 'facultyId', value: facultyId }],
        orderBy: [{ column: 'createdAt', dir: 'desc' }],
        limit: 10,
      }),
    ]);

    return {
      totalStudents,
      totalSubjects: assignedSubjectIds.length,
      totalClasses,
      todayAttendance,
      assignments,
      pendingWork: assignments,
      upcomingSchedule,
      recentActivities,
    };
  },
};
