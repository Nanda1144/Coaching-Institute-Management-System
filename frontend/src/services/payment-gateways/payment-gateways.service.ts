import api from '../api';

const paymentGatewayService = {
  async razorpayCreateOrder(orderData: Record<string, unknown>) {
    const { data } = await api.post('/payment-gateways/razorpay/create-order', orderData);
    return data;
  },

  async razorpayVerify(verificationData: Record<string, unknown>) {
    const { data } = await api.post('/payment-gateways/razorpay/verify', verificationData);
    return data;
  },

  async phonepeInitiate(paymentData: Record<string, unknown>) {
    const { data } = await api.post('/payment-gateways/phonepe/initiate', paymentData);
    return data;
  },

  async phonepeVerify(verificationData: Record<string, unknown>) {
    const { data } = await api.post('/payment-gateways/phonepe/verify', verificationData);
    return data;
  },

  async stripeCreateIntent(intentData: Record<string, unknown>) {
    const { data } = await api.post('/payment-gateways/stripe/create-payment-intent', intentData);
    return data;
  },

  async getHistory(params?: Record<string, unknown>) {
    const { data } = await api.get('/payment-gateways/history', { params });
    return data;
  },

  async getByGatewayOrderId(gatewayOrderId: string) {
    const { data } = await api.get(`/payment-gateways/lookup/${gatewayOrderId}`);
    return data;
  },
};

export default paymentGatewayService;
