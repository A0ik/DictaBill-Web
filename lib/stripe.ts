import Stripe from 'stripe';

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
  });
}

export const PLANS = {
  solo: {
    name: 'Solo',
    monthlyPrice: 9.99,
    annualPrice: 95.9,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_SOLO_MONTHLY!,
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_SOLO_ANNUAL!,
    tier: 'solo' as const,
    features: {
      fr: ['Factures illimitées', 'Sans marque DictaBill', '3 templates', 'Relances automatiques', 'Export CSV/FEC', 'Import clients IA'],
      en: ['Unlimited invoices', 'No DictaBill watermark', '3 templates', 'Auto reminders', 'CSV/FEC export', 'AI client import'],
    },
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 24.99,
    annualPrice: 239.9,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY!,
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL!,
    tier: 'pro' as const,
    features: {
      fr: ['Tout Solo +', 'Paiement Stripe intégré', 'WhatsApp Business', 'Factur-X (e-facture)', 'API comptable', 'Support prioritaire'],
      en: ['Everything in Solo', 'Integrated Stripe payments', 'WhatsApp Business', 'Factur-X (e-invoice)', 'Accounting API', 'Priority support'],
    },
  },
};
