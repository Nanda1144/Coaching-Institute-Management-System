import * as db from '../../shared/utils/db';
import { uploadFile, deleteFile } from '../../services/cloud/provider';

export const cloudDocumentsService = {
  async getAll(params: any) {
    const { page = 1, limit = 10, studentId, documentType, cloudProvider } = params;
    const conditions: any[] = [];
    if (studentId) conditions.push({ column: 'studentId', value: studentId });
    if (documentType) conditions.push({ column: 'documentType', value: documentType });
    if (cloudProvider) conditions.push({ column: 'cloudProvider', value: cloudProvider });
    const records = await db.findMany('cloud_documents', {
      where: conditions,
      orderBy: [{ column: 'createdAt', dir: 'DESC' }],
      offset: (page - 1) * limit,
      limit,
    });
    const total = await db.count('cloud_documents', conditions);
    return { data: records, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    return db.findUnique('cloud_documents', [{ column: 'id', value: id }]);
  },

  async upload(file: Express.Multer.File, studentId: string, documentType: string) {
    const result = await uploadFile(file, 'student_documents');
    return db.create('cloud_documents', {
      studentId,
      documentType,
      cloudProvider: result.provider,
      cloudFileId: result.cloudFileId,
      fileUrl: result.fileUrl,
      mimeType: file.mimetype,
      fileSize: file.size,
      originalFileName: file.originalname,
    });
  },

  async delete(id: string) {
    const doc = await this.getById(id);
    if (!doc) return null;
    try {
      await deleteFile(doc.cloudFileId);
    } catch {
      // Continue even if cloud delete fails
    }
    return db.remove('cloud_documents', [{ column: 'id', value: id }], false);
  },

  async getByStudent(studentId: string) {
    return db.findMany('cloud_documents', {
      where: [{ column: 'studentId', value: studentId }],
      orderBy: [{ column: 'createdAt', dir: 'DESC' }],
    });
  },
};
