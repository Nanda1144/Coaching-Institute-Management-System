import api from './api'

export const subscriptionService = {
  getPlans: () => api.get('/subscription/plans'),
  getMySubscription: () => api.get('/subscription/my'),
  getStatus: () => api.get('/subscription/status'),
  createTrial: () => api.post('/subscription/trial'),
  subscribe: (planId: string) => api.post('/subscription/subscribe', { planId }),
}
