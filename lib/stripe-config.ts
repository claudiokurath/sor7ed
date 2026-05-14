// lib/stripe-config.ts
export const CONCIERGE_CREDIT_PACKS = {
  starter: {
    name: 'Starter Pack',
    price_gbp: 15,
    credits: 1,
    sla_hours: 72,
    description: 'Perfect for testing the waters',
    price_id: process.env.STRIPE_PRICE_ID_STARTER!,
  },
  value: {
    name: 'Value Pack',
    price_gbp: 45,
    credits: 4,
    sla_hours: 48,
    description: 'Most popular choice',
    price_id: process.env.STRIPE_PRICE_ID_VALUE!,
  },
  premium: {
    name: 'Premium Pack',
    price_gbp: 75,
    credits: 10,
    sla_hours: 24,
    description: 'Maximum efficiency for busy professionals',
    price_id: process.env.STRIPE_PRICE_ID_PREMIUM!,
  },
} as const;

export type CreditPackType = keyof typeof CONCIERGE_CREDIT_PACKS;
