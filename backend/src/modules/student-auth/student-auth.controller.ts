import { Response, NextFunction } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendError } from '../../shared/utils/api-response';
import { studentAuthService } from './student-auth.service';
import { StudentLoginInput } from './student-auth.validator';
import { env } from '../../config/env';

export const login = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const { email, password } = req.body as StudentLoginInput;
  const { user, accessToken, refreshToken } = await studentAuthService.login(email, password);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  sendSuccess(res, { user, accessToken }, 'Student login successful');
});

export const logout = asyncHandler(async (_req: IAuthRequest, res: Response, _next: NextFunction) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  sendSuccess(res, null, 'Logged out successfully');
});

export const refreshToken = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) {
    sendError(res, 400, 'Refresh token is required');
    return;
  }
  const { accessToken } = await studentAuthService.refreshAccessToken(token);
  sendSuccess(res, { accessToken }, 'Token refreshed successfully');
});

export const getMe = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    sendError(res, 401, 'Authentication required');
    return;
  }
  const user = await studentAuthService.getProfile(studentId);
  sendSuccess(res, { user }, 'Profile fetched successfully');
});
