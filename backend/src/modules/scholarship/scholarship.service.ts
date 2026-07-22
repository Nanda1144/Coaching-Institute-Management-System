import * as db from '../../shared/utils/db';

export const scholarshipService = {
  async getAll(params: any) {
    const { page = 1, limit = 10, status, type, studentId, sortBy = 'createdAt', sortOrder = 'DESC' } = params;
    const conditions: any[] = [{ column: 'isDeleted', value: false }];
    if (status) conditions.push({ column: 'status', value: status });
    if (type) conditions.push({ column: 'type', value: type });
    if (studentId) conditions.push({ column: 'studentId', value: studentId });
    const records = await db.findMany('scholarships', {
      where: conditions,
      orderBy: [{ column: sortBy, dir: sortOrder }],
      offset: (page - 1) * limit,
      limit,
    });
    const total = await db.count('scholarships', conditions);
    return { data: records, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    return db.findUnique('scholarships', [{ column: 'id', value: id }]);
  },

  async create(data: any) {
    return db.create('scholarships', {
      studentId: data.studentId,
      scholarshipName: data.scholarshipName,
      type: data.type,
      amount: data.amount,
      percentage: data.percentage,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      status: data.status || 'active',
      description: data.description,
    });
  },

  async update(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    return db.update('scholarships', [{ column: 'id', value: id }], updateData);
  },

  async delete(id: string) {
    return db.remove('scholarships', [{ column: 'id', value: id }], false);
  },
};
