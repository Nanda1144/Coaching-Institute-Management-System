import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }
  return razorpayInstance;
}

export const razorpayGateway = {
  async createOrder(amount: number, currency = 'INR', receipt = '', notes: Record<string, string> = {}) {
    const rzp = getRazorpay();
    const order = await rzp.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
      notes,
    });
    return order;
  },

  verifyPayment(orderId: string, paymentId: string, signature: string): boolean {
    const body = `${orderId}|${paymentId}`;
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(body).digest('hex');
    return expected === signature;
  },

  async fetchPayment(paymentId: string) {
    const rzp = getRazorpay();
    return rzp.payments.fetch(paymentId);
  },

  async capturePayment(paymentId: string, amount: number) {
    const rzp = getRazorpay();
    return rzp.payments.capture(paymentId, Math.round(amount * 100), 'INR');
  },
};
