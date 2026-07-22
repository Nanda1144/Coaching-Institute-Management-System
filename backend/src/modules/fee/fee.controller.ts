import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { feeService } from './fee.service';

export const feeController = {
  getTransactions: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await feeService.getTransactions(req.query as any);
    sendSuccess(res, data, 'Fee transactions retrieved successfully');
  }),

  createTransaction: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await feeService.createTransaction(req.body);
    sendCreated(res, data, 'Fee transaction created successfully');
  }),

  updateTransaction: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await feeService.updateTransaction(req.params.id, req.body);
    if (!data) throw AppError.notFound('Fee transaction not found');
    sendSuccess(res, data, 'Fee transaction updated successfully');
  }),

  deleteTransaction: asyncHandler(async (req: IAuthRequest, res: Response) => {
    await feeService.deleteTransaction(req.params.id, req.user?.id);
    sendSuccess(res, null, 'Fee transaction deleted successfully');
  }),

  getPending: asyncHandler(async (_req: IAuthRequest, res: Response) => {
    const data = await feeService.getPending();
    sendSuccess(res, data, 'Pending fees retrieved successfully');
  }),

  createPending: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await feeService.createPending(req.body);
    sendCreated(res, data, 'Pending fee created successfully');
  }),

  getStructure: asyncHandler(async (_req: IAuthRequest, res: Response) => {
    const data = await feeService.getStructure();
    sendSuccess(res, data, 'Fee structure retrieved successfully');
  }),

  createStructure: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await feeService.createStructure(req.body);
    sendCreated(res, data, 'Fee structure created successfully');
  }),

  createInstallment: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await feeService.createInstallment(req.body);
    sendCreated(res, data, 'Installment created successfully');
  }),

  getInstallments: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await feeService.getInstallments(req.query.feeStructureId as string);
    sendSuccess(res, data, 'Installments retrieved');
  }),

  updateInstallment: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await feeService.updateInstallment(req.params.id, req.body);
    if (!data) throw AppError.notFound('Installment not found');
    sendSuccess(res, data, 'Installment updated');
  }),

  deleteInstallment: asyncHandler(async (req: IAuthRequest, res: Response) => {
    await feeService.deleteInstallment(req.params.id);
    sendSuccess(res, null, 'Installment deleted');
  }),

  getFeeAnalytics: asyncHandler(async (_req: IAuthRequest, res: Response) => {
    const data = await feeService.getFeeAnalytics();
    sendSuccess(res, data, 'Fee analytics retrieved');
  }),
};
