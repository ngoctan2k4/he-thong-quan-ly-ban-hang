import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export const ok = <T>(res: Response, data: T, status = 200) => res.status(status).json({ success: true, data });
export const normalize = (value: unknown) => String(value ?? '').trim().toLocaleLowerCase('vi-VN');
export const optionalText = (value?: string) => value?.trim() || undefined;
export const asId = (value: string) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'ID không hợp lệ.');
  return id;
};
export const pageParams = (request: Request) => {
  const page = Math.max(1, Number(request.query.page) || 1);
  const size = Math.min(100, Math.max(1, Number(request.query.size) || 10));
  return { page, size };
};
export const paginate = <T>(items: T[], page: number, size: number) => ({
  content: items.slice((page - 1) * size, page * size), page, size,
  totalElements: items.length, totalPages: Math.ceil(items.length / size),
});

export function notFound(_request: Request, _response: Response, next: NextFunction) {
  next(new HttpError(404, 'Không tìm thấy API.'));
}

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return response.status(400).json({ success: false, message: error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' });
  }
  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({ success: false, message: 'Nội dung JSON không hợp lệ.' });
  }
  if (typeof error === 'object' && error !== null && 'code' in error && String(error.code).startsWith('23')) {
    return response.status(409).json({ success: false, message: 'Dữ liệu xung đột với bản ghi hiện có.' });
  }
  const status = error instanceof HttpError ? error.status : 500;
  const message = error instanceof HttpError ? error.message : 'Lỗi hệ thống.';
  if (status >= 500) console.error(error);
  return response.status(status).json({ success: false, message });
}
