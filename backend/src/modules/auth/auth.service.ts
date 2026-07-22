import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as db from '../../shared/utils/db';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';
import { IJwtPayload } from '../../shared/middleware/auth.middleware';
import { ROLE_PERMISSIONS } from '../../shared/enums';
import { sendPasswordResetEmail } from '../../services/email/email.service';

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

function generateAccessToken(user: { id: string; facultyId?: string; studentId?: string; role: string; permissions?: string[] }): string {
  const payload: IJwtPayload = {
    id: user.id,
    role: user.role,
    permissions: user.permissions ?? [],
  };
  if (user.facultyId) payload.facultyId = user.facultyId;
  if (user.studentId) payload.studentId = user.studentId;
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
}

function generateRefreshToken(user: { id: string; role?: string }): string {
  return jwt.sign({ id: user.id, type: 'refresh', role: user.role || 'FACULTY' }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
}

function generateTokens(user: { id: string; facultyId?: string; role: string; permissions: string[] }) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken({ id: user.id, role: user.role });
  return { accessToken, refreshToken };
}

function normalizeRole(role: string | undefined | null, detectedRole: string): string {
  if (!role) return detectedRole;
  const upper = role.toUpperCase();
  if (upper === 'SUPER_ADMIN' || upper === 'ADMIN' || upper === 'HOD') return upper;
  if (upper === 'FACULTY' || upper === 'STUDENT' || upper === 'PARENT') return upper;
  return detectedRole;
}

async function login(email: string, password: string) {
  let user: any = null;
  let detectedRole = 'FACULTY';

  user = await db.findUnique('faculty', [{ column: 'email', value: email }]);
  if (!user) {
    user = await db.findUnique('students', [{ column: 'email', value: email }]);
    if (user) {
      detectedRole = 'STUDENT';
    } else {
      user = await db.findUnique('parents', [{ column: 'email', value: email }]);
      if (user) {
        detectedRole = 'PARENT';
      }
    }
  }

  if (!user) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const passwordField = user.password;
  if (!passwordField) {
    throw AppError.unauthorized('Account not configured for login');
  }

  const isPasswordValid = await bcrypt.compare(password, passwordField);
  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const role = normalizeRole(user.role, detectedRole);

  if (detectedRole === 'FACULTY') {
    const { password: _, ...userData } = user;
    const tokens = generateTokens({ ...user, role });
    return { user: { ...userData, role }, ...tokens, role };
  } else if (detectedRole === 'STUDENT') {
    const { password: _, ...userData } = user;
    const studentPermissions = ROLE_PERMISSIONS.STUDENT ?? [];
    const accessToken = jwt.sign(
      { id: user.id, studentId: user.studentId, role: 'STUDENT', permissions: studentPermissions },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );
    const refreshToken = jwt.sign(
      { id: user.id, type: 'refresh', role: 'STUDENT' },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
    );
    return { user: { ...userData, role: 'STUDENT' }, accessToken, refreshToken, role: 'STUDENT' };
  } else {
    const { password: _, ...userData } = user;
    const parentPermissions = ROLE_PERMISSIONS.PARENT ?? [];
    const accessToken = jwt.sign(
      { id: user.id, role: 'PARENT', permissions: parentPermissions },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );
    const refreshToken = jwt.sign(
      { id: user.id, type: 'refresh', role: 'PARENT' },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
    );
    return { user: { ...userData, role: 'PARENT' }, accessToken, refreshToken, role: 'PARENT' };
  }
}

async function register(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}) {
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
    role: normalizeRole(data.role, 'FACULTY'),
    permissions: [],
    status: 'active',
    createdById: null,
    updatedById: null,
  });

  const { password: _, ...user } = faculty;
  return user;
}

async function refreshToken(token: string) {
  let decoded: { id: string; type: string; role?: string };
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; type: string; role?: string };
  } catch {
    throw AppError.unauthorized('Invalid or expired refresh token');
  }

  if (decoded.type !== 'refresh') {
    throw AppError.unauthorized('Invalid refresh token');
  }

  const role = decoded.role || 'FACULTY';
  let user: any = null;

  try {
    if (role === 'STUDENT') {
      user = await db.findUnique('students', [{ column: 'id', value: decoded.id }]);
    } else if (role === 'PARENT') {
      user = await db.findUnique('parents', [{ column: 'id', value: decoded.id }]);
    } else {
      user = await db.findUnique('faculty', [{ column: 'id', value: decoded.id }]);
    }
  } catch {
    throw AppError.internal('Database error during token refresh');
  }

  if (!user) {
    throw AppError.unauthorized('User not found');
  }

  const rolePermissions = role === 'STUDENT' ? ROLE_PERMISSIONS.STUDENT : role === 'PARENT' ? ROLE_PERMISSIONS.PARENT : user.permissions;
  const accessToken = generateAccessToken({ ...user, role, permissions: rolePermissions ?? [] });
  return { accessToken };
}

async function forgotPassword(email: string) {
  let user: any = null;
  let table = 'faculty';

  user = await db.findUnique('faculty', [{ column: 'email', value: email }]);
  if (!user) {
    user = await db.findUnique('students', [{ column: 'email', value: email }]);
    if (user) {
      table = 'students';
    } else {
      user = await db.findUnique('parents', [{ column: 'email', value: email }]);
      if (user) {
        table = 'parents';
      }
    }
  }

  if (!user) {
    throw AppError.notFound('No account found with this email address');
  }

  const resetToken = jwt.sign(
    { email: user.email, type: 'reset' },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const resetLink = `${env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  const userName = user.fullName || user.firstName || user.email;

  // Send email asynchronously (don't block response on failure)
  sendPasswordResetEmail(user.email, resetLink, userName).then((sent) => {
    if (sent) console.log(`Password reset email sent to ${user.email}`);
    else console.warn(`Failed to send password reset email to ${user.email}`);
  });

  return { resetToken, email: user.email, table };
}

async function resetPassword(token: string, newPassword: string) {
  let decoded: { email: string; type: string };
  try {
    decoded = jwt.verify(token, env.JWT_SECRET) as { email: string; type: string };
  } catch {
    throw AppError.unauthorized('Invalid or expired reset token');
  }

  if (decoded.type !== 'reset') {
    throw AppError.unauthorized('Invalid reset token');
  }

  let user: any = null;
  let table = 'faculty';

  user = await db.findUnique('faculty', [{ column: 'email', value: decoded.email }]);
  if (!user) {
    user = await db.findUnique('students', [{ column: 'email', value: decoded.email }]);
    if (user) {
      table = 'students';
    } else {
      user = await db.findUnique('parents', [{ column: 'email', value: decoded.email }]);
      if (user) {
        table = 'parents';
      }
    }
  }

  if (!user) {
    throw AppError.notFound('User not found');
  }

  const hashedPassword = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);
  await db.update(table, [{ column: 'email', value: decoded.email }], { password: hashedPassword });

  return { message: 'Password reset successful' };
}

async function changePassword(userId: string, role: string, oldPassword: string, newPassword: string) {
  let table: string;
  if (role === 'STUDENT') {
    table = 'students';
  } else if (role === 'PARENT') {
    table = 'parents';
  } else {
    table = 'faculty';
  }

  const user = await db.findUnique(table, [{ column: 'id', value: userId }]);
  if (!user) {
    throw AppError.notFound('User not found');
  }

  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordValid) {
    throw AppError.unauthorized('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);
  await db.update(table, [{ column: 'id', value: userId }], { password: hashedPassword });

  return { message: 'Password changed successfully' };
}

async function logout(token: string): Promise<void> {
  try {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.create('blacklisted_tokens', {
      token,
      expiresAt,
    });
  } catch {
    // Silently fail — token invalidation is best-effort
  }
}

export const authService = {
  login,
  register,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
};
