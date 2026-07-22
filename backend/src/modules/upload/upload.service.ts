import path from 'path';
import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';

function generateUniqueFileName(originalName: string): string {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}_${timestamp}_${random}${ext}`;
}

export const uploadService = {
  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    role: string,
    module?: string,
    moduleId?: string
  ) {
    const ext = path.extname(file.originalname).toLowerCase();
    const fileName = generateUniqueFileName(file.originalname);

    const upload = await db.create('uploads', {
      originalName: file.originalname,
      fileName,
      mimeType: file.mimetype,
      extension: ext,
      size: file.size,
      url: `/uploads/${fileName}`,
      uploadedById: userId,
      uploadedByRole: role,
      module: module || null,
      moduleId: moduleId || null,
    });

    return upload;
  },

  async findAll(query: { page: number; limit: number }) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      db.findMany('uploads', {
        where: [{ column: 'isDeleted', value: false }],
        offset: skip,
        limit,
        orderBy: [{ column: 'createdAt', dir: 'desc' }],
      }),
      db.count('uploads', [{ column: 'isDeleted', value: false }]),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async delete(id: string, userId: string) {
    const upload = await db.findFirst('uploads', {
      where: [
        { column: 'id', value: id },
        { column: 'isDeleted', value: false },
      ],
    });

    if (!upload) {
      throw AppError.notFound('Upload not found');
    }

    const updated = await db.update('uploads',
      [{ column: 'id', value: id }],
      { isDeleted: true, deletedAt: new Date() },
    );

    return updated;
  },
};
