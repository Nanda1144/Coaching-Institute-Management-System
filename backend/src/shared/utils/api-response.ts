import { Response } from 'express';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedData<T> {
  data: T[];
  pagination: PaginationMeta;
}

export function sendSuccess<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendPaginated<T>(res: Response, result: PaginatedData<T>, message: string = 'Data retrieved successfully'): void {
  res.status(200).json({
    success: true,
    message,
    data: result.data,
    pagination: result.pagination,
  });
}

export function sendCreated<T>(res: Response, data: T, message: string = 'Created successfully'): void {
  sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}

export function sendError(res: Response, statusCode: number, message: string, errors?: any): void {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
}
