import { Request, Response, NextFunction } from 'express';

function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    const sanitized: any = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }
  return value;
}

export function xssSanitize(req: Request, _res: Response, next: NextFunction): void {
  if (req.body) (req as any).body = sanitizeValue(req.body);
  if (req.query) (req as any).query = sanitizeValue(req.query);
  if (req.params) (req as any).params = sanitizeValue(req.params);
  next();
}
