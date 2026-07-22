import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'application/zip',
  'text/plain',
  'text/csv',
];

const FORBIDDEN_EXTENSIONS = ['.exe', '.bat', '.cmd', '.com', '.msi', '.scr', '.vbs', '.js', '.html', '.htm', '.svg', '.xml'];

const MAGIC_BYTES: Record<string, Uint8Array[]> = {
  'application/pdf': [new Uint8Array([0x25, 0x50, 0x44, 0x46])],
  'image/jpeg': [new Uint8Array([0xFF, 0xD8, 0xFF])],
  'image/png': [new Uint8Array([0x89, 0x50, 0x4E, 0x47])],
  'image/gif': [new Uint8Array([0x47, 0x49, 0x46])],
  'application/zip': [new Uint8Array([0x50, 0x4B, 0x03, 0x04])],
};

export function validateFileUpload(req: Request, _res: Response, next: NextFunction): void {
  const files = req.files as Express.Multer.File[] | undefined;
  const file = req.file as Express.Multer.File | undefined;

  const allFiles = files || (file ? [file] : []);
  if (allFiles.length === 0) {
    return next();
  }

  for (const f of allFiles) {
    const ext = '.' + f.originalname.split('.').pop()?.toLowerCase();
    if (FORBIDDEN_EXTENSIONS.includes(ext)) {
      return next(AppError.badRequest(`File type "${ext}" is not allowed`));
    }

    if (!ALLOWED_MIME_TYPES.includes(f.mimetype)) {
      return next(AppError.badRequest(`MIME type "${f.mimetype}" is not allowed`));
    }

    if (f.size > 50 * 1024 * 1024) {
      return next(AppError.badRequest('File size exceeds 50MB limit'));
    }

    const expectedMagic = MAGIC_BYTES[f.mimetype];
    if (expectedMagic) {
      const buffer = f.buffer || (awaitReadStream(f.path));
      if (buffer) {
        const matches = expectedMagic.some((magic) =>
          magic.every((byte, idx) => buffer[idx] === byte)
        );
        if (!matches) {
          return next(AppError.badRequest(`File content does not match expected type "${f.mimetype}"`));
        }
      }
    }
  }

  next();
}

function awaitReadStream(path: string): Uint8Array | null {
  try {
    const fs = require('fs');
    const fd = fs.openSync(path, 'r');
    const buffer = Buffer.alloc(8);
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);
    return new Uint8Array(buffer);
  } catch {
    return null;
  }
}
