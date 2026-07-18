import { prisma } from '../../config/database';
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

  const where: any = {
    isDeleted: false,
  };

  if (subjectId) where.subjectId = subjectId;
  if (batchId) where.batchId = batchId;
  if (categoryId) where.categoryId = categoryId;
  if (type) where.materialType = type;
  if (departmentId) where.departmentId = departmentId;
  if (courseId) where.courseId = courseId;
  if (semesterId) where.semesterId = semesterId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { materialCode: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [materials, total] = await Promise.all([
    prisma.studyMaterial.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true, facultyId: true },
        },
        subject: {
          select: { id: true, subjectName: true, subjectCode: true },
        },
        category: {
          select: { id: true, categoryName: true },
        },
        chapter: {
          select: { id: true, chapterName: true, chapterNumber: true },
        },
      },
    }),
    prisma.studyMaterial.count({ where }),
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
  const material = await prisma.studyMaterial.findFirst({
    where: { id, isDeleted: false },
    include: {
      uploadedBy: {
        select: { id: true, firstName: true, lastName: true, facultyId: true, email: true },
      },
      subject: {
        select: { id: true, subjectName: true, subjectCode: true },
      },
      category: {
        select: { id: true, categoryName: true },
      },
      chapter: {
        select: { id: true, chapterName: true, chapterNumber: true },
      },
      department: {
        select: { id: true, name: true, code: true },
      },
      course: {
        select: { id: true, name: true, code: true },
      },
      semester: {
        select: { id: true, semester: true, name: true },
      },
      batch: {
        select: { id: true, batchName: true },
      },
      attachments: true,
      downloads: {
        orderBy: { downloadedAt: 'desc' },
        take: 50,
      },
    },
  });

  if (!material) {
    throw AppError.notFound('Study material not found');
  }

  return material;
}

export async function create(data: CreateMaterialInput, userId: string) {
  const materialCode = generateMaterialCode();

  const material = await prisma.studyMaterial.create({
    data: {
      ...data,
      materialCode,
      uploadedById: userId,
      createdBy: userId,
      totalViews: 1,
    },
    include: {
      uploadedBy: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  });

  return material;
}

export async function update(id: string, data: UpdateMaterialInput, userId: string) {
  const existing = await prisma.studyMaterial.findFirst({
    where: { id, isDeleted: false },
  });

  if (!existing) {
    throw AppError.notFound('Study material not found');
  }

  const material = await prisma.studyMaterial.update({
    where: { id },
    data: {
      ...data,
      updatedBy: userId,
    },
    include: {
      uploadedBy: {
        select: { id: true, firstName: true, lastName: true },
      },
      subject: {
        select: { id: true, subjectName: true },
      },
    },
  });

  return material;
}

export async function deleteMaterial(id: string, userId: string) {
  const existing = await prisma.studyMaterial.findFirst({
    where: { id, isDeleted: false },
  });

  if (!existing) {
    throw AppError.notFound('Study material not found');
  }

  const material = await prisma.studyMaterial.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      updatedBy: userId,
    },
  });

  return material;
}

export async function recordDownload(id: string, downloadData: RecordDownloadInput, userId: string, role: string) {
  const existing = await prisma.studyMaterial.findFirst({
    where: { id, isDeleted: false },
  });

  if (!existing) {
    throw AppError.notFound('Study material not found');
  }

  const [material] = await Promise.all([
    prisma.studyMaterial.update({
      where: { id },
      data: {
        totalDownloads: { increment: 1 },
      },
    }),
    prisma.materialDownload.create({
      data: {
        studyMaterialId: id,
        downloadedById: userId,
        downloadedByRole: role,
        downloadedAt: new Date(),
        ipAddress: downloadData.ipAddress,
        deviceInfo: downloadData.deviceInfo,
        userAgent: downloadData.userAgent,
      },
    }),
  ]);

  return material;
}

export async function getByFaculty(facultyId: string) {
  const materials = await prisma.studyMaterial.findMany({
    where: {
      uploadedById: facultyId,
      isDeleted: false,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      subject: {
        select: { id: true, subjectName: true, subjectCode: true },
      },
      category: {
        select: { id: true, categoryName: true },
      },
    },
  });

  return materials;
}

async function getCategories() {
  const categories = await prisma.materialCategory.findMany({
    where: { isDeleted: false },
    orderBy: { categoryName: 'asc' },
    include: {
      _count: {
        select: { studyMaterials: true },
      },
    },
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
