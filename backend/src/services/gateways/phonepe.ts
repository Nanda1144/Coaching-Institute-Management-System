import crypto from 'crypto';
import axios from 'axios';

const MERCHANT_ID = () => process.env.PHONEPE_MERCHANT_ID || '';
const SALT_KEY = () => process.env.PHONEPE_SALT_KEY || '';
const SALT_INDEX = () => process.env.PHONEPE_SALT_INDEX || '1';
const BASE_URL = () => process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/hermes';

export const phonepeGateway = {
  async initiatePayment(amount: number, merchantUserId: string, callbackUrl: string) {
    const merchantTransactionId = `MT${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const payload = {
      merchantId: MERCHANT_ID(),
      merchantTransactionId,
      merchantUserId,
      amount: Math.round(amount * 100),
      redirectUrl: callbackUrl,
      redirectMode: 'POST',
      paymentInstrument: { type: 'PAY_PAGE' },
    };
    const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const checksum = crypto.createHash('sha256').update(`${base64}/pg/v1/pay${SALT_KEY()}`).digest('hex') + '###' + SALT_INDEX();
    try {
      const response = await axios.post(`${BASE_URL()}/pg/v1/pay`, { request: base64 }, {
        headers: { 'Content-Type': 'application/json', 'X-VERIFY': checksum },
      });
      return { merchantTransactionId, data: response.data };
    } catch (err: any) {
      throw new Error(`PhonePe payment initiation failed: ${err.response?.data?.message || err.message}`);
    }
  },

  async verifyPayment(merchantTransactionId: string) {
    const checksum = crypto.createHash('sha256').update(`/pg/v1/status/${MERCHANT_ID()}/${merchantTransactionId}${SALT_KEY()}`).digest('hex') + '###' + SALT_INDEX();
    try {
      const response = await axios.get(`${BASE_URL()}/pg/v1/status/${MERCHANT_ID()}/${merchantTransactionId}`, {
        headers: { 'Content-Type': 'application/json', 'X-VERIFY': checksum, 'X-MERCHANT-ID': MERCHANT_ID() },
      });
      return response.data;
    } catch (err: any) {
      throw new Error(`PhonePe status check failed: ${err.response?.data?.message || err.message}`);
    }
  },
};
