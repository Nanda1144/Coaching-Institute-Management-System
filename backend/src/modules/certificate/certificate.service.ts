import * as db from '../../shared/utils/db';
import PDFDocument from 'pdfkit';

export const certificateService = {
  async getAll(params: any) {
    const { page = 1, limit = 10, status, studentId, sortBy = 'createdAt', sortOrder = 'DESC' } = params;
    const conditions: any[] = [];
    if (status) conditions.push({ column: 'status', value: status });
    if (studentId) conditions.push({ column: 'studentId', value: studentId });
    const records = await db.findMany('certificates', {
      where: conditions,
      orderBy: [{ column: sortBy, dir: sortOrder }],
      offset: (page - 1) * limit,
      limit,
    });
    const total = await db.count('certificates', conditions);
    return { items: records, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    return db.findUnique('certificates', [{ column: 'id', value: id }]);
  },

  async getPreview(id: string) {
    const cert = await db.findUnique('certificates', [{ column: 'id', value: id }]);
    if (!cert) return null;
    return {
      id: cert.id,
      templateName: cert.templateName || 'Standard',
      studentName: cert.studentName || '',
      studentId: cert.studentId || '',
      courseName: cert.courseName || '',
      completionDate: cert.completionDate || '',
      grade: cert.grade || '',
      certificateNumber: cert.certificateNumber || '',
      issueDate: cert.issueDate || '',
      templateStyle: cert.templateStyle || 'classic',
    };
  },

  async getPlaceholders(id: string) {
    const cert = await db.findUnique('certificates', [{ column: 'id', value: id }]);
    if (!cert) return [];
    return [
      { label: 'studentName', value: cert.studentName || '' },
      { label: 'courseName', value: cert.courseName || '' },
      { label: 'grade', value: cert.grade || '' },
      { label: 'completionDate', value: cert.completionDate || '' },
    ];
  },

  async generateDownload(id: string, format: string) {
    const cert = await db.findUnique('certificates', [{ column: 'id', value: id }]);
    if (!cert) return null;

    if (format === 'pdf') {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => {});

      doc.fontSize(28).text('Certificate of Completion', { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(20).text(cert.studentName || 'Student Name', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text('has successfully completed the course', { align: 'center' });
      doc.moveDown();
      doc.fontSize(18).text(cert.courseName || 'Course Name', { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(12).text(`Grade: ${cert.grade || 'N/A'}`, { align: 'center' });
      doc.text(`Date: ${cert.completionDate || 'N/A'}`, { align: 'center' });
      doc.moveDown(3);
      doc.fontSize(10).text(`Certificate No: ${cert.certificateNumber || id}`, { align: 'left' });
      doc.end();
      return Buffer.concat(buffers);
    }
    return null;
  },

  async create(data: any) {
    return db.create('certificates', data);
  },

  async update(id: string, data: any) {
    return db.update('certificates', [{ column: 'id', value: id }], data);
  },

  async updatePlaceholders(id: string, placeholders: any[]) {
    const updateData: any = {};
    for (const ph of placeholders) {
      updateData[ph.label] = ph.value;
    }
    return db.update('certificates', [{ column: 'id', value: id }], updateData);
  },

  async delete(id: string) {
    return db.remove('certificates', [{ column: 'id', value: id }], true);
  },
};
