import { query } from '../../config/database';
import * as db from '../../shared/utils/db';

function generateTransactionId(): string {
  return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
}

function generateReceiptNumber(): string {
  return 'RCPT' + Date.now();
}

export const paymentService = {
  async getAll(params: any) {
    const { page = 1, limit = 10, status, gateway, fromDate, toDate, search, sortBy = 'createdAt', sortOrder = 'DESC' } = params;
    const conditions: any[] = [];
    if (status) conditions.push({ column: 'status', value: status });
    if (gateway) conditions.push({ column: 'gateway', value: gateway });
    if (fromDate) conditions.push({ column: 'createdAt', value: fromDate, operator: '>=' });
    if (toDate) conditions.push({ column: 'createdAt', value: toDate, operator: '<=' });
    if (search) conditions.push({ column: 'transactionId', value: search, operator: 'ILIKE' });

    const records = await db.findMany('payments', {
      where: conditions,
      orderBy: [{ column: sortBy, dir: sortOrder }],
      offset: (page - 1) * limit,
      limit,
    });
    const total = await db.count('payments', conditions);
    return { items: records, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    return db.findUnique('payments', [{ column: 'id', value: id }]);
  },

  async getByStudent(studentId: string, params: any) {
    const { page = 1, limit = 20 } = params;
    const conditions = [{ column: 'studentId', value: studentId }];
    const records = await db.findMany('payments', {
      where: conditions,
      orderBy: [{ column: 'createdAt', dir: 'DESC' }],
      offset: (page - 1) * limit,
      limit,
    });
    const total = await db.count('payments', conditions);
    return { items: records, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) };
  },

  async getHistory(params: any) {
    const { studentFeeId } = params;
    const conditions: any[] = [];
    if (studentFeeId) conditions.push({ column: 'studentFeeId', value: studentFeeId });
    return db.findMany('payments', { where: conditions, orderBy: [{ column: 'createdAt', dir: 'DESC' }] });
  },

  async getSummary(params: any) {
    const { studentId } = params;
    const conditions: any[] = [];
    if (studentId) conditions.push({ column: 'studentId', value: studentId });

    const [totalTransactions, revenueResult, paidCount, failedCount] = await Promise.all([
      db.count('payments', conditions),
      query(`SELECT COALESCE(SUM(amount), 0) as total FROM "payments" WHERE status = 'paid'${studentId ? ' AND "studentId" = $1' : ''}`, studentId ? [studentId] : []),
      db.count('payments', [...conditions, { column: 'status', value: 'paid' }]),
      db.count('payments', [...conditions, { column: 'status', value: 'failed' }]),
    ]);
    return { totalTransactions, totalRevenue: revenueResult.rows[0]?.total || 0, successfulCount: paidCount, failedCount };
  },

  async create(data: any) {
    const transactionId = generateTransactionId();
    const receiptNumber = generateReceiptNumber();
    return db.create('payments', { ...data, transactionId, receiptNumber });
  },

  async update(id: string, data: any) {
    return db.update('payments', [{ column: 'id', value: id }], data);
  },

  async delete(id: string) {
    return db.remove('payments', [{ column: 'id', value: id }], true);
  },

  async processRefund(id: string, data: any, userId?: string) {
    const payment = await db.findUnique('payments', [{ column: 'id', value: id }]);
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'paid') throw new Error('Only paid payments can be refunded');
    await db.update('payments', [{ column: 'id', value: id }], { status: 'refunded', refundReason: data.reason, refundedById: userId, refundedAt: new Date() });
    return { id, status: 'refunded' };
  },
};
