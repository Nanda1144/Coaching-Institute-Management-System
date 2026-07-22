import { query } from '../../config/database';
import * as db from '../../shared/utils/db';

export const batchService = {
  async getAll(params: any) {
    const { page = 1, limit = 10, search, status, mode, courseId, facultyId, sortBy = 'createdAt', sortOrder = 'DESC' } = params;
    const conditions: any[] = [{ column: 'isDeleted', value: false }];
    if (status) conditions.push({ column: 'status', value: status });
    if (mode) conditions.push({ column: 'mode', value: mode });
    if (courseId) conditions.push({ column: 'courseId', value: courseId });
    if (facultyId) conditions.push({ column: 'facultyId', value: facultyId });
    if (search) {
      const searchCond: any[] = [];
      searchCond.push({ column: 'batchName', value: search, operator: 'ILIKE' });
      searchCond.push({ column: 'batchCode', value: search, operator: 'ILIKE' });
      conditions.push({ operator: 'OR', conditions: searchCond });
    }
    const records = await db.findMany('batches', {
      where: conditions,
      orderBy: [{ column: sortBy, dir: sortOrder }],
      offset: (page - 1) * limit,
      limit,
    });
    const total = await db.count('batches', conditions);
    return { data: records, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    return db.findUnique('batches', [{ column: 'id', value: id }]);
  },

  async create(data: any) {
    if (data.batchCode) {
      const dup = await db.findUnique('batches', [{ column: 'batchCode', value: data.batchCode }]);
      if (dup) throw new Error('Batch code already exists');
    }
    const mapped = {
      ...data,
      batchName: data.batchName || data.name,
      academicYear: data.academicYear || data.year,
      batchTiming: data.batchTiming || data.schedule,
    };
    delete mapped.name;
    delete mapped.year;
    delete mapped.schedule;
    return db.create('batches', {
      ...mapped,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    });
  },

  async update(id: string, data: any) {
    if (data.batchCode) {
      const dup = await db.findMany('batches', {
        where: [{ column: 'batchCode', value: data.batchCode }, { column: 'id', operator: '!=', value: id }],
        limit: 1,
      });
      if (dup.length > 0) throw new Error('Batch code already in use');
    }
    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    return db.update('batches', [{ column: 'id', value: id }], updateData);
  },

  async delete(id: string) {
    return db.remove('batches', [{ column: 'id', value: id }], false);
  },

  async allocateStudent(batchId: string, studentId: string) {
    const batch = await db.findUnique('batches', [{ column: 'id', value: batchId }]);
    if (!batch) throw new Error('Batch not found');
    const student = await db.findUnique('students', [{ column: 'id', value: studentId }]);
    if (!student) throw new Error('Student not found');
    const dup = await db.findUnique('batch_students', [{ column: 'batchId', value: batchId }, { column: 'studentId', value: studentId }]);
    if (dup) throw new Error('Student already allocated to this batch');
    if (batch.status === 'active') {
      const other = await db.findMany('batch_students', {
        where: [
          { column: 'studentId', value: studentId },
          { column: 'batch', operator: 'raw', value: { column: 'status', value: 'active' } },
        ],
        limit: 1,
      });
      if (other.length > 0) throw new Error('Student already in an active batch');
    }
    const capacity = await this.getCapacity(batchId);
    if (capacity.isFull) throw new Error('Batch is full');
    const allocation = await db.create('batch_students', { batchId, studentId });
    await db.update('batches', [{ column: 'id', value: batchId }], {
      currentStrength: (batch.currentStrength || 0) + 1,
    });
    return allocation;
  },

  async deallocateStudent(batchId: string, studentId: string) {
    const batch = await db.findUnique('batches', [{ column: 'id', value: batchId }]);
    if (!batch) throw new Error('Batch not found');
    await db.remove('batch_students', [{ column: 'batchId', value: batchId }, { column: 'studentId', value: studentId }], true);
    await db.update('batches', [{ column: 'id', value: batchId }], {
      currentStrength: Math.max(0, (batch.currentStrength || 0) - 1),
    });
    return { deallocated: true };
  },

  async getBatchStudents(batchId: string) {
    const rows = await query(
      `SELECT bs.id, bs.student_id, bs.allocated_at, s.student_id as "studentCode", s.first_name, s.last_name, s.full_name, s.email, s.phone
       FROM batch_students bs JOIN students s ON s.id = bs.student_id WHERE bs.batch_id = $1 ORDER BY bs.allocated_at DESC`,
      [batchId]
    );
    return rows.rows;
  },

  async assignFaculty(batchId: string, facultyId: string) {
    const batch = await db.findUnique('batches', [{ column: 'id', value: batchId }]);
    if (!batch) throw new Error('Batch not found');
    const faculty = await db.findUnique('faculty', [{ column: 'id', value: facultyId }]);
    if (!faculty) throw new Error('Faculty not found');
    const existing = await db.findMany('batches', {
      where: [
        { column: 'facultyId', value: facultyId },
        { column: 'id', operator: '!=', value: batchId },
        { column: 'status', value: 'active' },
      ],
      limit: 1,
    });
    if (existing.length > 0) throw new Error('Faculty already assigned to another active batch');
    return db.update('batches', [{ column: 'id', value: batchId }], { facultyId });
  },

  async removeFaculty(batchId: string) {
    const batch = await db.findUnique('batches', [{ column: 'id', value: batchId }]);
    if (!batch) throw new Error('Batch not found');
    if (!batch.facultyId) throw new Error('No faculty assigned to this batch');
    return db.update('batches', [{ column: 'id', value: batchId }], { facultyId: null });
  },

  async getBatchFaculty(batchId: string) {
    const rows = await query(
      `SELECT f.id, f.faculty_id as "facultyCode", f.first_name, f.last_name, f.full_name, f.email, f.specialization
       FROM batches b JOIN faculty f ON f.id = b.faculty_id WHERE b.id = $1`,
      [batchId]
    );
    return rows.rows[0] || null;
  },

  async transferStudent(studentId: string, oldBatchId: string, newBatchId: string, reason?: string) {
    if (oldBatchId === newBatchId) throw new Error('Source and destination batches must be different');
    const oldBatch = await db.findUnique('batches', [{ column: 'id', value: oldBatchId }]);
    if (!oldBatch) throw new Error('Source batch not found');
    const newBatch = await db.findUnique('batches', [{ column: 'id', value: newBatchId }]);
    if (!newBatch) throw new Error('Destination batch not found');
    const alloc = await db.findUnique('batch_students', [{ column: 'batchId', value: oldBatchId }, { column: 'studentId', value: studentId }]);
    if (!alloc) throw new Error('Student not found in source batch');
    const dup = await db.findUnique('batch_students', [{ column: 'batchId', value: newBatchId }, { column: 'studentId', value: studentId }]);
    if (dup) throw new Error('Student already in destination batch');
    const capacity = await this.getCapacity(newBatchId);
    if (capacity.isFull) throw new Error('Destination batch is full');
    await db.remove('batch_students', [{ column: 'batchId', value: oldBatchId }, { column: 'studentId', value: studentId }], true);
    await db.update('batches', [{ column: 'id', value: oldBatchId }], { currentStrength: Math.max(0, (oldBatch.currentStrength || 0) - 1) });
    await db.create('batch_students', { batchId: newBatchId, studentId });
    await db.update('batches', [{ column: 'id', value: newBatchId }], { currentStrength: (newBatch.currentStrength || 0) + 1 });
    return db.create('batch_transfers', { studentId, oldBatchId, newBatchId, reason });
  },

  async getTransferHistory(studentId: string) {
    const rows = await query(
      `SELECT bt.id, bt.transfer_date, bt.reason,
              ob.batch_name as "oldBatchName", ob.batch_code as "oldBatchCode",
              nb.batch_name as "newBatchName", nb.batch_code as "newBatchCode"
       FROM batch_transfers bt
       JOIN batches ob ON ob.id = bt.old_batch_id
       JOIN batches nb ON nb.id = bt.new_batch_id
       WHERE bt.student_id = $1 ORDER BY bt.transfer_date DESC`,
      [studentId]
    );
    return rows.rows;
  },

  async getCapacity(batchId: string) {
    const batch = await db.findUnique('batches', [{ column: 'id', value: batchId }]);
    if (!batch) throw new Error('Batch not found');
    const cap = batch.capacity || 0;
    const strength = batch.currentStrength || 0;
    return {
      batchId: batch.id,
      batchName: batch.batchName,
      capacity: cap,
      currentStrength: strength,
      availableSeats: cap - strength,
      isFull: cap > 0 && strength >= cap,
    };
  },

  async validateCapacity(batchId: string, count: number = 1) {
    const cap = await this.getCapacity(batchId);
    return { canAllocate: cap.availableSeats >= count, ...cap };
  },

  async getAnalytics(batchId: string) {
    const [batchInfo, totalStudents, transfers] = await Promise.all([
      db.findUnique('batches', [{ column: 'id', value: batchId }]),
      query(`SELECT COUNT(*) as count FROM batch_students WHERE batch_id = $1`, [batchId]),
      query(`SELECT COUNT(*) as count FROM batch_transfers WHERE old_batch_id = $1 OR new_batch_id = $1`, [batchId]),
    ]);
    if (!batchInfo) throw new Error('Batch not found');
    const strength = batchInfo.currentStrength || 0;
    const cap = batchInfo.capacity || 0;
    return {
      batchInfo: {
        id: batchInfo.id,
        batchCode: batchInfo.batchCode,
        batchName: batchInfo.batchName,
        batchTiming: batchInfo.batchTiming,
        mode: batchInfo.mode,
        status: batchInfo.status,
        classroom: batchInfo.classroom,
      },
      totalStudents: parseInt(totalStudents.rows[0]?.count || '0'),
      availableSeats: cap - strength,
      capacityUtilizationPercent: cap > 0 ? Math.round((strength / cap) * 10000) / 100 : 0,
    };
  },
};
