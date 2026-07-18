import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';
import { IJwtPayload } from '../../shared/middleware/auth.middleware';

function generateFacultyId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FAC-${timestamp}${random}`;
}

function generateEmployeeId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EMP-${timestamp}${random}`;
}

function generateAccessToken(faculty: { id: string; facultyId: string; role: string; permissions: string[] }): string {
  const payload: IJwtPayload = {
    id: faculty.id,
    facultyId: faculty.facultyId,
    role: faculty.role,
    permissions: faculty.permissions,
  };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
}

function generateRefreshToken(faculty: { id: string }): string {
  return jwt.sign({ id: faculty.id, type: 'refresh' }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
}

function generateTokens(faculty: { id: string; facultyId: string; role: string; permissions: string[] }) {
  const accessToken = generateAccessToken(faculty);
  const refreshToken = generateRefreshToken(faculty);
  return { accessToken, refreshToken };
}

async function login(email: string, password: string) {
  const faculty = await prisma.faculty.findUnique({ where: { email } });
  if (!faculty) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, faculty.password);
  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const { password: _, ...user } = faculty;
  const tokens = generateTokens(faculty);

  return { user, ...tokens };
}

async function register(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}) {
  const existingEmail = await prisma.faculty.findUnique({ where: { email: data.email } });
  if (existingEmail) {
    throw AppError.conflict('Email is already registered');
  }

  const existingPhone = await prisma.faculty.findUnique({ where: { phone: data.phone } });
  if (existingPhone) {
    throw AppError.conflict('Phone number is already registered');
  }

  const hashedPassword = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUNDS);
  const fullName = `${data.firstName} ${data.lastName}`;
  const username = data.email.split('@')[0];

  const faculty = await prisma.faculty.create({
    data: {
      facultyId: generateFacultyId(),
      firstName: data.firstName,
      lastName: data.lastName,
      fullName,
      gender: 'Not Specified',
      dateOfBirth: new Date(),
      email: data.email,
      phone: data.phone,
      employeeId: generateEmployeeId(),
      designation: 'Faculty',
      department: 'General',
      specialization: [],
      qualification: [],
      experience: 0,
      joiningDate: new Date(),
      employmentType: 'Full-time',
      branch: 'Main',
      campus: 'Main Campus',
      address: {},
      emergencyContact: {},
      username,
      password: hashedPassword,
      role: data.role?.toLowerCase() || 'faculty',
      permissions: [],
      status: 'active',
      createdById: null,
      updatedById: null,
    },
  });

  const { password: _, ...user } = faculty;
  return user;
}

async function refreshToken(token: string) {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; type: string };

    if (decoded.type !== 'refresh') {
      throw AppError.unauthorized('Invalid refresh token');
    }

    const faculty = await prisma.faculty.findUnique({ where: { id: decoded.id } });
    if (!faculty) {
      throw AppError.unauthorized('Faculty not found');
    }

    const accessToken = generateAccessToken(faculty);
    return { accessToken };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw AppError.unauthorized('Invalid or expired refresh token');
  }
}

export const authService = {
  login,
  register,
  refreshToken,
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
};
