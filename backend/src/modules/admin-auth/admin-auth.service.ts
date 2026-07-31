import bcrypt from 'bcrypt';
import * as db from '../../shared/utils/db';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';
import { AdminRegistrationInput } from './admin-auth.validator';

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

async function register(data: AdminRegistrationInput) {
  const existingEmail = await db.findUnique('faculty', [{ column: 'email', value: data.email }]);
  if (existingEmail) {
    throw AppError.conflict('Email is already registered');
  }

  const existingPhone = await db.findUnique('faculty', [{ column: 'phone', value: data.phone }]);
  if (existingPhone) {
    throw AppError.conflict('Phone number is already registered');
  }

  const hashedPassword = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUNDS);
  const fullName = `${data.firstName} ${data.lastName}`;
  const username = data.email.split('@')[0];

  const faculty = await db.create('faculty', {
    facultyId: generateFacultyId(),
    firstName: data.firstName,
    lastName: data.lastName,
    fullName,
    gender: 'Not Specified',
    dateOfBirth: new Date(),
    email: data.email,
    phone: data.phone,
    employeeId: generateEmployeeId(),
    designation: data.designation || 'Administrator',
    department: 'Administration',
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
    role: 'ADMIN',
    permissions: ['*'],
    status: 'active',
    createdById: null,
    updatedById: null,
  });

  const { password: _, ...user } = faculty;
  return user;
}

export const adminAuthService = {
  register,
};
