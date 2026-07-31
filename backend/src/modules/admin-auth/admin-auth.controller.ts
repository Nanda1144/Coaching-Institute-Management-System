import { Response, NextFunction } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendCreated } from '../../shared/utils/api-response';
import { adminAuthService } from './admin-auth.service';
import { AdminRegistrationInput } from './admin-auth.validator';

export const register = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const data = req.body as AdminRegistrationInput;

  const user = await adminAuthService.register(data);

  sendCreated(res, { user }, 'Admin registration successful');
});
