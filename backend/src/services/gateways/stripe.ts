import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  }
  return stripeInstance;
}

export const stripeGateway = {
  async createPaymentIntent(amount: number, currency = 'usd', metadata: Record<string, string> = {}) {
    const stripe = getStripe();
    return stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });
  },

  async confirmPayment(paymentIntentId: string) {
    const stripe = getStripe();
    return stripe.paymentIntents.confirm(paymentIntentId);
  },

  async retrievePayment(paymentIntentId: string) {
    const stripe = getStripe();
    return stripe.paymentIntents.retrieve(paymentIntentId);
  },

  constructWebhookEvent(payload: Buffer, sig: string): Stripe.Event {
    const stripe = getStripe();
    return stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  },
};
