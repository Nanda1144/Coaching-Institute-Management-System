import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  }
  return stripeInstance;
}

export const stripeGateway: {
  createPaymentIntent: (amount: number, currency?: string, metadata?: Record<string, string>) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
  confirmPayment: (paymentIntentId: string) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
  retrievePayment: (paymentIntentId: string) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
  constructWebhookEvent: (payload: Buffer, sig: string) => Stripe.Event;
} = {
  async createPaymentIntent(amount, currency = 'usd', metadata: Record<string, string> = {}) {
    const stripe = getStripe();
    return stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });
  },

  async confirmPayment(paymentIntentId) {
    const stripe = getStripe();
    return stripe.paymentIntents.confirm(paymentIntentId);
  },

  async retrievePayment(paymentIntentId) {
    const stripe = getStripe();
    return stripe.paymentIntents.retrieve(paymentIntentId);
  },

  constructWebhookEvent(payload: Buffer, sig: string): Stripe.Event {
    const stripe = getStripe();
    return stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  },
};
