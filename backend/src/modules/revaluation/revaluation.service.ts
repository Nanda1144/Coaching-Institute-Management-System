import * as db from '../../shared/utils/db';
import { query } from '../../config/database';

export const revaluationService = {
  async getAll(params: any) {
    const { page = 1, limit = 10, status, examId, studentId, sortBy = 'createdAt', sortOrder = 'DESC' } = params;
    const conditions: any[] = [];
    if (status) conditions.push({ column: 'status', value: status });
    if (examId) conditions.push({ column: 'examId', value: examId });
    if (studentId) conditions.push({ column: 'studentId', value: studentId });
    const records = await db.findMany('revaluation_requests', {
      where: conditions,
      orderBy: [{ column: sortBy, dir: sortOrder }],
      offset: (page - 1) * limit,
      limit,
    });
    const total = await db.count('revaluation_requests', conditions);
    return { data: records, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    return db.findUnique('revaluation_requests', [{ column: 'id', value: id }]);
  },

  async create(data: any) {
    return db.create('revaluation_requests', {
      examId: data.examId,
      studentId: data.studentId,
      subjectId: data.subjectId,
      currentMarks: data.currentMarks,
      expectedMarks: data.expectedMarks,
      reason: data.reason,
      status: 'pending',
    });
  },

  async updateStatus(id: string, data: any) {
    const updateData: any = { status: data.status };
    if (data.reviewedById) updateData.reviewedById = data.reviewedById;
    if (data.reviewedAt) updateData.reviewedAt = new Date(data.reviewedAt);
    if (data.remarks) updateData.remarks = data.remarks;
    if (data.revisedMarks) updateData.revisedMarks = data.revisedMarks;
    return db.update('revaluation_requests', [{ column: 'id', value: id }], updateData);
  },

  async getTimeline(id: string) {
    return db.findMany('revaluation_timelines', {
      where: [{ column: 'revaluationId', value: id }],
      orderBy: [{ column: 'createdAt', dir: 'ASC' }],
    });
  },

  async addTimelineEntry(revaluationId: string, action: string, comment?: string, performedBy?: string) {
    return db.create('revaluation_timelines', { revaluationId, action, comment, performedBy });
  },
};
