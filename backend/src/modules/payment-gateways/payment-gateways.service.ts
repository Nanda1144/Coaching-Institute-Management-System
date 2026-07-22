import * as db from '../../shared/utils/db';
import { razorpayGateway } from '../../services/gateways/razorpay';
import { phonepeGateway } from '../../services/gateways/phonepe';
import { stripeGateway } from '../../services/gateways/stripe';

export const paymentGatewayService = {
  // =========== Razorpay ===========
  async razorpayCreateOrder(amount: number, currency = 'INR', receipt = '', studentId?: string, description?: string) {
    const order = await razorpayGateway.createOrder(amount, currency, receipt);
    const payment = await db.create('payments', {
      studentId: studentId || null,
      studentName: '',
      amount,
      status: 'created',
      gateway: 'razorpay',
      gatewayOrderId: order.id,
      description: description || receipt || 'Razorpay payment',
      transactionId: receipt || `TXN_${order.id}`,
      currency,
    });
    return { order, payment };
  },

  async razorpayVerify(orderId: string, paymentId: string, signature: string) {
    const valid = razorpayGateway.verifyPayment(orderId, paymentId, signature);
    if (!valid) throw new Error('Invalid payment signature');
    // Find the payment by gatewayOrderId and update
    const existing = await db.findFirst('payments', {
      where: [{ column: 'gatewayOrderId', value: orderId }, { column: 'gateway', value: 'razorpay' }],
    });
    if (existing) {
      await db.update('payments', [{ column: 'id', value: existing.id }], {
        gatewayPaymentId: paymentId,
        gatewaySignature: signature,
        status: 'paid',
        verifiedAt: new Date(),
      });
    }
    return { valid, paymentId, orderId };
  },

  // =========== PhonePe ===========
  async phonepeInitiate(amount: number, merchantUserId: string, callbackUrl: string, studentId?: string, description?: string) {
    const result = await phonepeGateway.initiatePayment(amount, merchantUserId, callbackUrl);
    const payment = await db.create('payments', {
      studentId: studentId || null,
      studentName: '',
      amount,
      status: 'created',
      gateway: 'phonepe',
      merchantOrderId: result.merchantTransactionId,
      description: description || 'PhonePe payment',
      transactionId: `TXN_${result.merchantTransactionId}`,
      currency: 'INR',
    });
    return { ...result, payment };
  },

  async phonepeVerify(merchantTransactionId: string) {
    const result = await phonepeGateway.verifyPayment(merchantTransactionId);
    const paymentStatus = result?.code === 'PAYMENT_SUCCESS' ? 'paid' : 'failed';
    const existing = await db.findFirst('payments', {
      where: [{ column: 'merchantOrderId', value: merchantTransactionId }, { column: 'gateway', value: 'phonepe' }],
    });
    if (existing) {
      await db.update('payments', [{ column: 'id', value: existing.id }], {
        status: paymentStatus,
        providerReferenceId: result?.data?.transactionId || null,
        verifiedAt: new Date(),
        rawResponse: JSON.stringify(result),
      });
    }
    return { status: paymentStatus, data: result };
  },

  // =========== Stripe ===========
  async stripeCreateIntent(amount: number, currency = 'usd', studentId?: string, description?: string) {
    const intent = await stripeGateway.createPaymentIntent(amount, currency, { description: description || '' });
    const payment = await db.create('payments', {
      studentId: studentId || null,
      studentName: '',
      amount,
      status: 'created',
      gateway: 'stripe',
      stripePaymentIntentId: intent.id,
      stripeClientSecret: intent.client_secret || '',
      description: description || 'Stripe payment',
      transactionId: `TXN_${intent.id}`,
      currency,
    });
    return { clientSecret: intent.client_secret, payment };
  },

  // =========== Generic ===========
  async getPaymentByGatewayOrderId(gatewayOrderId: string) {
    return db.findFirst('payments', {
      where: [{ column: 'gatewayOrderId', value: gatewayOrderId }],
    });
  },

  async getHistory(params: { page?: number; limit?: number; studentId?: string; gateway?: string; status?: string }) {
    const { page = 1, limit = 10, studentId, gateway, status } = params;
    const conditions: any[] = [{ column: 'isDeleted', value: false }];
    if (studentId) conditions.push({ column: 'studentId', value: studentId });
    if (gateway) conditions.push({ column: 'gateway', value: gateway });
    if (status) conditions.push({ column: 'status', value: status });
    const records = await db.findMany('payments', {
      where: conditions,
      orderBy: [{ column: 'createdAt', dir: 'DESC' }],
      offset: (page - 1) * limit,
      limit,
    });
    const total = await db.count('payments', conditions);
    return { data: records, total, page, limit, totalPages: Math.ceil(total / limit) };
  },
};
