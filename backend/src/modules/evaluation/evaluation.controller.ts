import { Response, NextFunction } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { evaluationService } from './evaluation.service';
import { EvaluationQueryInput, CreateEvaluationInput, UpdateEvaluationInput } from './evaluation.validator';

export const getAll = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const query = req.query as unknown as EvaluationQueryInput;
  const result = await evaluationService.findAll(query);
  sendSuccess(res, result, 'Evaluations fetched successfully');
});

export const getById = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const evaluation = await evaluationService.findById(id);
  sendSuccess(res, evaluation, 'Evaluation fetched successfully');
});

export const create = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const data = req.body as CreateEvaluationInput;
  const userId = req.user!.id;
  const evaluation = await evaluationService.create(data, userId);
  sendCreated(res, evaluation, 'Evaluation created successfully');
});

export const update = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const data = req.body as UpdateEvaluationInput;
  const userId = req.user!.id;
  const evaluation = await evaluationService.update(id, data, userId);
  sendSuccess(res, evaluation, 'Evaluation updated successfully');
});

export const deleteEvaluation = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  await evaluationService.remove(id, req.user!.id);
  sendSuccess(res, null, 'Evaluation deleted successfully');
});

export const publish = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const evaluation = await evaluationService.publish(id, userId);
  sendSuccess(res, evaluation, 'Evaluation published successfully');
});

export const getByFaculty = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const { facultyId } = req.params;
  const evaluations = await evaluationService.getByFaculty(facultyId);
  sendSuccess(res, evaluations, 'Evaluations fetched successfully');
});
