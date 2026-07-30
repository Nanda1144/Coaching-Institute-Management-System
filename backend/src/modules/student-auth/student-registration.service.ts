import bcrypt from 'bcrypt';
import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';
import { notificationService } from '../notification/notification.service';
import { env } from '../../config/env';

async function sendNotification(title: string, message: string, target: string) {
  try {
    await notificationService.send({ title, message, target });
  } catch {
    // Silently fail — notifications are best-effort
  }
}

export const studentRegistrationService = {
  async create(data: Record<string, unknown>) {
    const existing = await db.findUnique('student_registration_requests', [{ column: 'email', value: data.email as string }]);
    if (existing) {
      throw AppError.conflict('A registration request with this email already exists');
    }

    const fullName = `${data.firstName} ${data.lastName}`;
    const hashedPassword = await bcrypt.hash(data.password as string, env.BCRYPT_SALT_ROUNDS);

    const request = await db.create('student_registration_requests', {
      firstName: data.firstName,
      lastName: data.lastName,
      fullName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      gender: data.gender || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth as string) : null,
      address: data.address || null,
      department: data.department,
      course: data.course || null,
      semester: data.semester ? parseInt(data.semester as string) : null,
      batch: data.batch || null,
      preferredFacultyId: data.preferredFacultyId || null,
      parentName: data.parentName || null,
      parentEmail: data.parentEmail || null,
      parentPhone: data.parentPhone || null,
      documents: data.documents ? JSON.stringify(data.documents) : null,
      status: 'PENDING',
    });

    if (data.preferredFacultyId) {
      await sendNotification(
        'New Registration Request',
        `${fullName} has registered and selected you as preferred faculty.`,
        data.preferredFacultyId as string
      );
    }

    return request;
  },

  async getAll(params?: Record<string, unknown>) {
    const where: any[] = [];
    if (params?.status) {
      where.push({ column: 'status', value: String(params.status) });
    }
    if (params?.facultyId) {
      where.push({ column: 'preferredFacultyId', value: String(params.facultyId) });
    }
    return db.findMany('student_registration_requests', {
      where,
      orderBy: [{ column: 'createdAt', dir: 'DESC' }],
    });
  },

  async review(id: string, status: string, remarks?: string, userId?: string, extra?: { batchId?: string; batch?: string; joiningDate?: Date }) {
    const request = await db.findUnique('student_registration_requests', [{ column: 'id', value: id }]);
    if (!request) {
      throw AppError.notFound('Registration request not found');
    }
    if (request.status !== 'PENDING') {
      throw AppError.badRequest('Registration request has already been processed');
    }

    const updated = await db.update('student_registration_requests', [{ column: 'id', value: id }], {
      status,
      remarks: remarks || null,
      reviewedById: userId || null,
      reviewedAt: new Date(),
    });

    if (status === 'APPROVED') {
      const hashedPassword = request.password || await bcrypt.hash('welcome@123', env.BCRYPT_SALT_ROUNDS);
      const student = await db.create('students', {
        studentId: `STU-${Date.now()}`,
        rollNumber: `ROLL-${Date.now()}`,
        firstName: request.firstName,
        lastName: request.lastName,
        fullName: request.fullName,
        email: request.email,
        phone: request.phone || '',
        password: hashedPassword,
        department: request.department,
        course: request.course || '',
        semester: request.semester || 1,
        batch: extra?.batch || request.batch || '',
        batchId: extra?.batchId || null,
        gender: request.gender || 'Not specified',
        dateOfBirth: request.dateOfBirth || new Date('2000-01-01'),
        address: request.address || null,
        status: 'active',
        createdById: userId || null,
      });

      // Auto-assign to batch if batchId provided or faculty has assigned batches
      const targetBatchId = extra?.batchId || null;
      if (targetBatchId) {
        try {
          const allocated = await db.findUnique('batch_students', [{ column: 'batchId', value: targetBatchId }, { column: 'studentId', value: student.id }]);
          if (!allocated) {
            const batch = await db.findUnique('batches', [{ column: 'id', value: targetBatchId }]);
            if (batch) {
              await db.create('batch_students', { batchId: targetBatchId, studentId: student.id });
              await db.update('batches', [{ column: 'id', value: targetBatchId }], {
                currentStrength: (batch.currentStrength || 0) + 1,
              });
            }
          }
        } catch {
          // Best-effort batch allocation
        }
      }

      if (request.parentEmail) {
        const parentExists = await db.findUnique('parents', [{ column: 'email', value: request.parentEmail }]);
        if (!parentExists) {
          const parentPassword = await bcrypt.hash('parent@123', env.BCRYPT_SALT_ROUNDS);
          await db.create('parents', {
            fullName: request.parentName || 'Parent',
            email: request.parentEmail,
            phone: request.parentPhone || '',
            password: parentPassword,
            linkedRoll: request.email,
            status: 'active',
          });
        }
      }

      const reasonText = remarks ? ` Message: ${remarks}` : '';
      await sendNotification('Registration Approved', `Your registration has been approved. You can now log in with your credentials.${reasonText}`, request.email);
    } else if (status === 'HOLD') {
      await sendNotification('Registration On Hold', `Your registration has been put on hold. Reason: ${remarks || 'Pending verification'}`, request.email);
    } else if (status === 'REJECTED') {
      await sendNotification('Registration Rejected', `Your registration has been rejected. Reason: ${remarks || 'Not specified'}`, request.email);
    }

    return updated;
  },
};
