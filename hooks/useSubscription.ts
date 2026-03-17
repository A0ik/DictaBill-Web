'use client';
import { useAuthStore } from '@/stores/authStore';
import type { SubscriptionTier } from '@/types';

export function useSubscription() {
  const profile = useAuthStore((s) => s.profile);
  const tier = (profile?.subscription_tier as SubscriptionTier) || 'free';
  return {
    tier,
    isFree: tier === 'free',
    isSolo: tier === 'solo' || tier === 'pro',
    isPro: tier === 'pro',
    maxInvoices: tier === 'free' ? 5 : Infinity,
    canExportCsv: tier !== 'free',
    canSendReminder: tier !== 'free',
    canWhatsApp: tier === 'pro',
    canCustomTemplate: tier !== 'free',
    canRemoveWatermark: tier !== 'free',
    canStripePayment: tier === 'pro',
    canFacturX: tier === 'pro',
    canImportClients: tier !== 'free',
  };
}
