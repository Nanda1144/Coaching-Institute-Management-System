import * as db from '../../shared/utils/db';
import { sendNotification } from '../../shared/utils/notification-helper';
import { query } from '../../config/database';

export const feeService = {
  async getTransactions(params?: Record<string, unknown>) {
    const where: any[] = [{ column: 'isDeleted', value: false }];
    if (params?.search) {
      where.push({ column: 'student', operator: 'ILIKE', value: String(params.search) });
    }
    return db.findMany('fee_transactions', { where, orderBy: [{ column: 'createdAt', dir: 'DESC' }] });
  },

  async createTransaction(data: Record<string, unknown>) {
    const transaction = await db.create('fee_transactions', {
      ...data,
      date: data.date ? new Date(data.date as string) : new Date(),
      status: data.status || 'paid',
    });

    await sendNotification(
      'Fee Record Created',
      `A fee record of ${data.amount} has been created for semester ${data.semester}`,
      (data.studentId || data.student) as string
    );

    return transaction;
  },

  async updateTransaction(id: string, data: Record<string, unknown>) {
    return db.update('fee_transactions', [{ column: 'id', value: id }], data);
  },

  async deleteTransaction(id: string, userId?: string) {
    const updateData: Record<string, unknown> = { isDeleted: true, deletedAt: new Date() };
    if (userId) updateData.updatedById = userId;
    return db.update('fee_transactions', [{ column: 'id', value: id }], updateData);
  },

  async getPending() {
    return db.findMany('fee_pending', { where: [{ column: 'isDeleted', value: false }] });
  },

  async createPending(data: Record<string, unknown>) {
    return db.create('fee_pending', {
      ...data,
      dueDate: new Date(data.dueDate as string),
      daysOverdue: 0,
    });
  },

  async getStructure() {
    return db.findMany('fee_structure', { where: [{ column: 'isDeleted', value: false }] });
  },

  async createStructure(data: Record<string, unknown>) {
    const dupCheck = await db.findMany('fee_structure', {
      where: [
        { column: 'type', value: data.type },
        { column: 'isDeleted', value: false },
      ],
      limit: 1,
    });
    if (dupCheck.length > 0) throw new Error('Fee structure with this type already exists');

    const regFee = parseFloat(String(data.registrationFee || 0));
    const tuitFee = parseFloat(String(data.tuitionFee || 0));
    const examFee = parseFloat(String(data.examinationFee || 0));
    const miscFee = parseFloat(String(data.miscellaneousFee || 0));
    const computedTotal = regFee + tuitFee + examFee + miscFee;

    const structure = await db.create('fee_structure', {
      type: data.type,
      amount: data.amount || Math.round(computedTotal),
      dueDate: data.dueDate,
      semester: data.semester,
      courseId: data.courseId,
      batchId: data.batchId,
      academicYear: data.academicYear,
      registrationFee: regFee,
      tuitionFee: tuitFee,
      examinationFee: examFee,
      miscellaneousFee: miscFee,
      totalFee: computedTotal || data.amount || 0,
      installmentCount: data.installmentCount || 1,
      status: 'active',
    });

    const installmentCount = parseInt(String(data.installmentCount || 1));
    if (installmentCount > 1) {
      const totalAmt = computedTotal || parseFloat(String(data.amount || 0));
      const perInstallment = Math.round((totalAmt / installmentCount) * 100) / 100;
      const baseDate = new Date();
      for (let i = 0; i < installmentCount; i++) {
        const due = new Date(baseDate);
        due.setMonth(due.getMonth() + i * 3);
        const amount = i === installmentCount - 1
          ? totalAmt - perInstallment * (installmentCount - 1)
          : perInstallment;
        await db.create('installments', {
          feeStructureId: structure.id,
          installmentNumber: i + 1,
          dueDate: due,
          amount,
          status: 'pending',
        });
      }
    }

    return structure;
  },

  async createInstallment(data: any) {
    return db.create('installments', data);
  },

  async getInstallments(feeStructureId?: string) {
    const where: any[] = [];
    if (feeStructureId) where.push({ column: 'feeStructureId', value: feeStructureId });
    return db.findMany('installments', { where, orderBy: [{ column: 'installmentNumber', dir: 'ASC' }] });
  },

  async updateInstallment(id: string, data: any) {
    return db.update('installments', [{ column: 'id', value: id }], data);
  },

  async deleteInstallment(id: string) {
    return db.remove('installments', [{ column: 'id', value: id }], false);
  },

  async getFeeAnalytics() {
    const [totalCollected, totalPending, totalStructure, avgFee] = await Promise.all([
      query(`SELECT COALESCE(SUM(amount), 0) as total FROM fee_transactions WHERE status = 'paid' AND is_deleted = false`),
      query(`SELECT COALESCE(SUM(amount), 0) as total FROM fee_pending WHERE is_deleted = false`),
      query(`SELECT COUNT(*) as count FROM fee_structure WHERE is_deleted = false`),
      query(`SELECT COALESCE(AVG(amount), 0) as avg FROM fee_structure WHERE is_deleted = false`),
    ]);
    return {
      totalCollected: parseFloat(totalCollected.rows[0]?.total || '0'),
      totalPending: parseFloat(totalPending.rows[0]?.total || '0'),
      totalStructures: parseInt(totalStructure.rows[0]?.count || '0'),
      averageFee: parseFloat(avgFee.rows[0]?.avg || '0'),
    };
  },
};
