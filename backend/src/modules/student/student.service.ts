import * as db from '../../shared/utils/db';

export const studentService = {
  async getAll(params?: Record<string, unknown>) {
    const where: any[] = [{ column: 'isDeleted', value: false }];
    if (params?.search) {
      const s = String(params.search);
      where.push({ operator: 'OR', conditions: [
        { column: 'fullName', operator: 'ILIKE', value: s },
        { column: 'rollNumber', operator: 'ILIKE', value: s },
      ]});
    }
    if (params?.department && params.department !== 'all') {
      where.push({ column: 'department', value: String(params.department) });
    }
    return db.findMany('students', { where, orderBy: [{ column: 'createdAt', dir: 'DESC' }] });
  },

  async getById(id: string) {
    return db.findUnique('students', [{ column: 'id', value: id }]);
  },

  async create(data: Record<string, unknown>) {
    const fullName = (data.fullName as string) || `${data.firstName || ''} ${data.lastName || ''}`.trim();
    const firstName = data.firstName as string || (fullName || '').split(' ')[0] || '';
    const lastName = data.lastName as string || (fullName || '').split(' ').slice(1).join(' ') || '';
    const phone = (data.phone as string) || (data.phoneNumber as string) || '';
    const dateOfBirth = data.dateOfBirth || data.dob || '2000-01-01';
    return db.create('students', {
      studentId: `STU-${Date.now()}`,
      firstName,
      lastName,
      fullName,
      email: data.email,
      phone,
      rollNumber: data.rollNumber,
      department: data.department,
      course: data.course || '',
      semester: parseInt(data.year as string) || 1,
      batch: data.batch,
      section: data.section || '',
      gender: (data.gender as string) || 'Not specified',
      dateOfBirth: new Date(dateOfBirth as string),
      status: (data.status as string) || 'active',
      batchId: (data.batchId as string) || null,
      address: data.address || null,
      createdById: (data.createdById as string) || null,
    });
  },

  async update(id: string, data: Record<string, unknown>) {
    const updateData: Record<string, unknown> = {};
    if (data.fullName) updateData.fullName = data.fullName;
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.email) updateData.email = data.email;
    if (data.phone) updateData.phone = data.phone;
    if (data.rollNumber) updateData.rollNumber = data.rollNumber;
    if (data.department) updateData.department = data.department;
    if (data.course) updateData.course = data.course;
    if (data.semester) updateData.semester = data.semester;
    if (data.batch) updateData.batch = data.batch;
    if (data.batchId) updateData.batchId = data.batchId;
    if (data.section) updateData.section = data.section;
    if (data.gender) updateData.gender = data.gender;
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth as string);
    if (data.status) updateData.status = data.status;
    if (data.address) updateData.address = data.address;
    if (data.updatedById) updateData.updatedById = data.updatedById;
    return db.update('students', [{ column: 'id', value: id }], updateData);
  },

  async delete(id: string) {
    return db.remove('students', [{ column: 'id', value: id }], true);
  },
};
