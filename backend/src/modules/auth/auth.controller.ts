import { Response, NextFunction } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated, sendError } from '../../shared/utils/api-response';
import { authService } from './auth.service';
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput, ChangePasswordInput } from './auth.validator';
import { env } from '../../config/env';
import * as db from '../../shared/utils/db';

export const login = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const { email, password } = req.body as LoginInput;

  const { user, accessToken, refreshToken } = await authService.login(email, password);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  sendSuccess(res, { user, accessToken, refreshToken }, 'Login successful');
});

export const register = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const data = req.body as RegisterInput;

  const user = await authService.register(data);

  sendCreated(res, { user }, 'Registration successful');
});

export const refreshToken = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    sendError(res, 400, 'Refresh token is required');
    return;
  }

  const { accessToken } = await authService.refreshToken(token);

  sendSuccess(res, { accessToken }, 'Token refreshed successfully');
});

export const logout = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    await authService.logout(token);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });

  sendSuccess(res, null, 'Logged out successfully');
});

export const forgotPassword = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const { email } = req.body as ForgotPasswordInput;

  const result = await authService.forgotPassword(email);

  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    sendSuccess(res, { resetToken: result.resetToken, email: result.email }, 'Password reset link sent. In dev mode, token is returned.');
  } else {
    sendSuccess(res, { email: result.email }, 'If an account exists with this email, a reset link has been sent.');
  }
});

export const resetPassword = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const { token, password } = req.body as ResetPasswordInput;

  const result = await authService.resetPassword(token, password);

  sendSuccess(res, result, 'Password reset successful');
});

export const changePassword = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  if (!req.user) {
    sendError(res, 401, 'Not authenticated');
    return;
  }

  const { oldPassword, newPassword } = req.body as ChangePasswordInput;

  const result = await authService.changePassword(req.user.id, req.user.role, oldPassword, newPassword);

  sendSuccess(res, result, 'Password changed successfully');
});

export const getMe = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  if (!req.user) {
    sendError(res, 401, 'Not authenticated');
    return;
  }

  let userData: any = null;
  const role = req.user.role;

  if (role === 'STUDENT') {
    userData = await db.findUnique('students', [{ column: 'id', value: req.user.id || req.user.studentId }]);
  } else if (role === 'PARENT') {
    userData = await db.findUnique('parents', [{ column: 'id', value: req.user.id }]);
  } else {
    userData = await db.findUnique('faculty', [{ column: 'id', value: req.user.id || req.user.facultyId }]);
  }

  if (!userData) {
    sendSuccess(res, { user: { ...req.user } }, 'User profile fetched (limited)');
    return;
  }

  const { password: _, ...safeUser } = userData;
  sendSuccess(res, { user: { ...safeUser, role, permissions: req.user.permissions } }, 'User profile fetched successfully');
});
