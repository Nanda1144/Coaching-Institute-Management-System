import * as db from '../../shared/utils/db';
import { query } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import type { CreateMaterialInput, UpdateMaterialInput, MaterialQueryInput, RecordDownloadInput } from './material.validator';

function generateMaterialCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'MAT-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function findAll(query: MaterialQueryInput) {
  const { page, limit, subjectId, batchId, categoryId, type, search, departmentId, courseId, semesterId } = query;
  const skip = (page - 1) * limit;

  const where: any[] = [{ column: 'isDeleted', value: false }];

  if (subjectId) where.push({ column: 'subjectId', value: subjectId });
  if (batchId) where.push({ column: 'batchId', value: batchId });
  if (categoryId) where.push({ column: 'categoryId', value: categoryId });
  if (type) where.push({ column: 'materialType', value: type });
  if (departmentId) where.push({ column: 'departmentId', value: departmentId });
  if (courseId) where.push({ column: 'courseId', value: courseId });
  if (semesterId) where.push({ column: 'semesterId', value: semesterId });
  if (search) {
    const p = `%${search}%`;
    where.push({
      column: 'search',
      operator: 'raw',
      value: `title ILIKE $1 OR description ILIKE $2 OR material_code ILIKE $3`,
      params: [p, p, p],
    });
  }

  const [materials, total] = await Promise.all([
    db.findMany('study_materials', {
      where,
      offset: skip,
      limit,
      orderBy: [{ column: 'createdAt', dir: 'desc' }],
    }),
    db.count('study_materials', where),
  ]);

  return {
    data: materials,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findById(id: string) {
  const material = await db.findFirst('study_materials', {
    where: [
      { column: 'id', value: id },
      { column: 'isDeleted', value: false },
    ],
  });

  if (!material) {
    throw AppError.notFound('Study material not found');
  }

  return material;
}

export async function create(data: CreateMaterialInput, userId: string) {
  const materialCode = generateMaterialCode();

  const material = await db.create('study_materials', {
    ...data,
    materialCode,
    uploadedById: userId,
    createdBy: userId,
    totalViews: 1,
  });

  return material;
}

export async function update(id: string, data: UpdateMaterialInput, userId: string) {
  const existing = await db.findFirst('study_materials', {
    where: [
      { column: 'id', value: id },
      { column: 'isDeleted', value: false },
    ],
  });

  if (!existing) {
    throw AppError.notFound('Study material not found');
  }

  const material = await db.update('study_materials',
    [{ column: 'id', value: id }],
    {
      ...data,
      updatedBy: userId,
    },
  );

  return material;
}

export async function deleteMaterial(id: string, userId: string) {
  const existing = await db.findFirst('study_materials', {
    where: [
      { column: 'id', value: id },
      { column: 'isDeleted', value: false },
    ],
  });

  if (!existing) {
    throw AppError.notFound('Study material not found');
  }

  const material = await db.update('study_materials',
    [{ column: 'id', value: id }],
    {
      isDeleted: true,
      deletedAt: new Date(),
      updatedBy: userId,
    },
  );

  return material;
}

export async function recordDownload(id: string, downloadData: RecordDownloadInput, userId: string, role: string) {
  const existing = await db.findFirst('study_materials', {
    where: [
      { column: 'id', value: id },
      { column: 'isDeleted', value: false },
    ],
  });

  if (!existing) {
    throw AppError.notFound('Study material not found');
  }

  const [material] = await Promise.all([
    (async () => {
      await query('UPDATE study_materials SET total_downloads = total_downloads + 1 WHERE id = $1', [id]);
      return db.findUnique('study_materials', [{ column: 'id', value: id }]);
    })(),
    db.create('material_downloads', {
      studyMaterialId: id,
      downloadedById: userId,
      downloadedByRole: role,
      downloadedAt: new Date(),
      ipAddress: downloadData.ipAddress,
      deviceInfo: downloadData.deviceInfo,
      userAgent: downloadData.userAgent,
    }),
  ]);

  return material;
}

export async function getByFaculty(facultyId: string) {
  const materials = await db.findMany('study_materials', {
    where: [
      { column: 'uploadedById', value: facultyId },
      { column: 'isDeleted', value: false },
    ],
    orderBy: [{ column: 'createdAt', dir: 'desc' }],
  });

  return materials;
}

async function getCategories() {
  const categories = await db.findMany('material_categories', {
    where: [{ column: 'isDeleted', value: false }],
    orderBy: [{ column: 'categoryName', dir: 'asc' }],
  });

  return categories;
}

export const materialService = {
  findAll,
  findById,
  create,
  update,
  delete: deleteMaterial,
  recordDownload,
  getByFaculty,
  getCategories,
};
