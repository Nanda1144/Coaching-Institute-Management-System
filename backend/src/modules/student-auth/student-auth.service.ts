import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';

export interface IStudentJwtPayload {
  id: string;
  studentId: string;
  role: 'STUDENT';
}

function generateAccessToken(student: { id: string; studentId: string }): string {
  const payload: IStudentJwtPayload = {
    id: student.id,
    studentId: student.studentId,
    role: 'STUDENT',
  };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
}

function generateRefreshToken(student: { id: string }): string {
  return jwt.sign({ id: student.id, type: 'refresh', role: 'STUDENT' }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
}

async function login(email: string, password: string) {
  const student = await prisma.student.findUnique({ where: { email } });
  if (!student) {
    throw AppError.unauthorized('Invalid email or password');
  }

  if (!student.password) {
    throw AppError.unauthorized('Student account not configured for login');
  }

  const isPasswordValid = await bcrypt.compare(password, student.password);
  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const accessToken = generateAccessToken(student);
  const refreshToken = generateRefreshToken(student);

  return {
    user: {
      id: student.id,
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      rollNumber: student.rollNumber,
      department: student.department,
      course: student.course,
      semester: student.semester,
      batch: student.batch,
      section: student.section,
      profileImage: student.profileImage,
    },
    accessToken,
    refreshToken,
  };
}

async function getProfile(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      batchRef: { select: { id: true, batchName: true } },
    },
  });
  if (!student) throw AppError.notFound('Student not found');
  return student;
}

async function refreshAccessToken(token: string) {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; type: string; role: string };
    if (decoded.type !== 'refresh' || decoded.role !== 'STUDENT') {
      throw AppError.unauthorized('Invalid refresh token');
    }
    const student = await prisma.student.findUnique({ where: { id: decoded.id } });
    if (!student) throw AppError.unauthorized('Student not found');
    const accessToken = generateAccessToken(student);
    return { accessToken };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw AppError.unauthorized('Invalid or expired refresh token');
  }
}

export const studentAuthService = {
  login,
  getProfile,
  refreshAccessToken,
  generateAccessToken,
  generateRefreshToken,
};
