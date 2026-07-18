import { Response, NextFunction } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated, sendError } from '../../shared/utils/api-response';
import { authService } from './auth.service';
import { LoginInput, RegisterInput } from './auth.validator';
import { env } from '../../config/env';

export const login = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const { email, password } = req.body as LoginInput;

  const { user, accessToken, refreshToken } = await authService.login(email, password);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  sendSuccess(res, { user, accessToken }, 'Login successful');
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

export const logout = asyncHandler(async (_req: IAuthRequest, res: Response, _next: NextFunction) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  sendSuccess(res, null, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  sendSuccess(res, { user: req.user }, 'User profile fetched successfully');
});
