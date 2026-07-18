import bcrypt from 'bcrypt';
import { prisma } from '../../config/database';
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
  while (await prisma.faculty.findUnique({ where: { username } })) {
    username = `${base}${suffix}`;
    suffix++;
  }
  return username;
}

export const facultyService = {
  async findAll(query: FacultyQueryInput) {
    const { page, limit, search, department, designation, status, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
        { facultyId: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (department) where.department = department;
    if (designation) where.designation = designation;
    if (status) where.status = status;

    const orderBy: any = {};
    orderBy[sortBy || 'createdAt'] = sortOrder || 'desc';

    const [data, total] = await Promise.all([
      prisma.faculty.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: {
            select: {
              attendanceMarkedBy: true,
              facultyAssignments: true,
              homeworks: true,
            },
          },
        },
      }),
      prisma.faculty.count({ where }),
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
    const faculty = await prisma.faculty.findFirst({
      where: { id, isDeleted: false },
      include: {
        facultyAssignments: { where: { isDeleted: false } },
        attendanceMarkedBy: { where: { isDeleted: false } },
        timetables: { where: { isDeleted: false } },
        studyMaterialsUploaded: { where: { isDeleted: false } },
      },
    });
    if (!faculty) throw AppError.notFound('Faculty not found');
    return faculty;
  },

  async create(data: CreateFacultyInput, userId: string) {
    const existingEmail = await prisma.faculty.findUnique({ where: { email: data.email } });
    if (existingEmail) throw AppError.conflict('Email already in use');

    const existingPhone = await prisma.faculty.findUnique({ where: { phone: data.phone } });
    if (existingPhone) throw AppError.conflict('Phone already in use');

    const existingEmployeeId = await prisma.faculty.findUnique({ where: { employeeId: data.employeeId } });
    if (existingEmployeeId) throw AppError.conflict('Employee ID already in use');

    const lastFaculty = await prisma.faculty.findFirst({
      orderBy: { facultyId: 'desc' },
      select: { facultyId: true },
    });
    const facultyId = generateFacultyId(lastFaculty?.facultyId);

    const username = await generateUsername(data.firstName, data.lastName);
    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
    const hashedPassword = await bcrypt.hash(tempPassword, env.BCRYPT_SALT_ROUNDS);

    const faculty = await prisma.faculty.create({
      data: {
        facultyId,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        dateOfBirth: new Date(data.dateOfBirth),
        designation: data.designation,
        department: data.department,
        employeeId: data.employeeId,
        joiningDate: new Date(data.joiningDate),
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
      },
    });

    return faculty;
  },

  async update(id: string, data: UpdateFacultyInput, userId: string) {
    const existing = await prisma.faculty.findFirst({
      where: { id, isDeleted: false },
    });
    if (!existing) throw AppError.notFound('Faculty not found');

    if (data.email && data.email !== existing.email) {
      const emailConflict = await prisma.faculty.findUnique({
        where: { email: data.email },
      });
      if (emailConflict) throw AppError.conflict('Email already in use');
    }

    if (data.phone && data.phone !== existing.phone) {
      const phoneConflict = await prisma.faculty.findUnique({
        where: { phone: data.phone },
      });
      if (phoneConflict) throw AppError.conflict('Phone already in use');
    }

    if (data.employeeId && data.employeeId !== existing.employeeId) {
      const empConflict = await prisma.faculty.findUnique({
        where: { employeeId: data.employeeId },
      });
      if (empConflict) throw AppError.conflict('Employee ID already in use');
    }

    const updateData: any = { ...data, updatedById: userId };
    if (data.firstName || data.lastName) {
      updateData.fullName = `${data.firstName || existing.firstName} ${data.lastName || existing.lastName}`;
    }
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.joiningDate) updateData.joiningDate = new Date(data.joiningDate);

    const updated = await prisma.faculty.update({
      where: { id },
      data: updateData,
    });

    await prisma.assignmentLog.create({
      data: {
        facultyId: id,
        action: 'UPDATE',
        entityType: 'Faculty',
        entityId: id,
        entityName: existing.fullName,
        oldValue: JSON.parse(JSON.stringify(existing)),
        newValue: JSON.parse(JSON.stringify(updated)),
        performedBy: userId,
      },
    });

    return updated;
  },

  async delete(id: string, userId: string) {
    const faculty = await prisma.faculty.findFirst({
      where: { id, isDeleted: false },
    });
    if (!faculty) throw AppError.notFound('Faculty not found');

    await prisma.faculty.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedById: userId,
      },
    });

    await prisma.assignmentLog.create({
      data: {
        facultyId: id,
        action: 'DELETE',
        entityType: 'Faculty',
        entityId: id,
        entityName: faculty.fullName,
        performedBy: userId,
      },
    });

    return { message: 'Faculty deleted successfully' };
  },

  async getProfile(id: string) {
    const faculty = await prisma.faculty.findFirst({
      where: { id, isDeleted: false },
      include: {
        _count: {
          select: {
            timetables: true,
            facultyAssignments: true,
            homeworks: true,
            studyMaterialsUploaded: true,
          },
        },
      },
    });
    if (!faculty) throw AppError.notFound('Faculty not found');
    return faculty;
  },

  async getDashboardStats(facultyId: string) {
    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
    });
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
        ? prisma.student.count({ where: { batchId: { in: batchIds }, isDeleted: false } })
        : Promise.resolve(0),
      prisma.timetable.count({ where: { facultyId, isDeleted: false } }),
      prisma.attendance.count({
        where: { facultyId, attendanceDate: { gte: today, lt: tomorrow } },
      }),
      prisma.assignment.count({
        where: { facultyId, status: 'active', deletedAt: null },
      }),
      prisma.timetable.findMany({
        where: { facultyId, isDeleted: false, startTime: { gte: new Date() } },
        orderBy: { startTime: 'asc' },
        take: 5,
        include: {
          subjectRef: { select: { subjectName: true, subjectCode: true } },
          batchRef: { select: { batchName: true } },
          classroom: { select: { roomNumber: true, building: true } },
        },
      }),
      prisma.assignmentLog.findMany({
        where: { facultyId },
        orderBy: { createdAt: 'desc' },
        take: 10,
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
