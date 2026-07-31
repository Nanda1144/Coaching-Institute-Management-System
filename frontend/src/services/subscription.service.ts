import api from './api'

export const subscriptionService = {
  getPlans: () => api.get('/subscription/plans'),
  getMySubscription: () => api.get('/subscription/my'),
  getStatus: () => api.get('/subscription/status'),
  createTrial: () => api.post('/subscription/trial'),
  subscribe: (planId: string) => api.post('/subscription/subscribe', { planId }),
  createRazorpayOrder: (planId: string) => api.post('/subscription/create-razorpay-order', { planId }),
  verifyRazorpayPayment: (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; planId: string }) =>
    api.post('/subscription/verify-razorpay-payment', data),
  createPhonePeOrder: (planId: string, callbackUrl: string) => api.post('/subscription/create-phonepe-order', { planId, callbackUrl }),
  verifyPhonePePayment: (merchantTransactionId: string, planId: string) =>
    api.post('/subscription/verify-phonepe-payment', { merchantTransactionId, planId }),
}
