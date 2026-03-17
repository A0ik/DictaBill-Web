'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import I18nProvider from '@/components/I18nProvider';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { PLANS } from '@/lib/stripe';
import { useT } from '@/hooks/useTranslation';
import toast from 'react-hot-toast';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useT();
  const { user, initialized, initialize } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const plan = searchParams.get('plan') as keyof typeof PLANS | null;
  const interval = searchParams.get('interval') as 'monthly' | 'annual' | null;

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (initialized && !user) {
      const next = encodeURIComponent(`/checkout?plan=${plan}&interval=${interval}`);
      router.push(`/register?next=${next}`);
    }
  }, [initialized, user, plan, interval, router]);

  const planData = plan ? PLANS[plan] : null;

  const price = planData
    ? interval === 'annual'
      ? planData.annualPrice
      : planData.monthlyPrice
    : 0;

  const priceLabel = interval === 'annual'
    ? `${price}€${t('pricing.perYear')}`
    : `${price}€${t('pricing.perMonth')}`;

  const features = planData?.features[lang === 'en' ? 'en' : 'fr'] || [];

  const handleCheckout = async () => {
    if (!plan || !interval) return;
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, interval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Erreur lors du paiement');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-500" />
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t('checkout.notFound')}</p>
          <Link href="/pricing">
            <Button variant="outline">{t('checkout.seePricing')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1">
            <span className="text-3xl font-black text-primary-500">Dicta</span>
            <span className="text-3xl font-black text-gray-900">Bill</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <Link href="/pricing" className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-6">
            <ArrowLeft size={16} /> {t('checkout.backToPricing')}
          </Link>

          <h1 className="text-2xl font-black text-gray-900 mb-1">{t('checkout.title')}</h1>
          <p className="text-sm text-gray-500 mb-6">{t('checkout.subtitle')}</p>

          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-primary-600 uppercase tracking-wide">{t('checkout.selectedPlan')}</p>
                <p className="text-2xl font-black text-gray-900 mt-0.5">{planData.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-primary-600">{priceLabel}</p>
                {interval === 'annual' && (
                  <p className="text-xs text-green-600 font-semibold mt-0.5">{t('pricing.billedAnnually')}</p>
                )}
              </div>
            </div>

            <ul className="space-y-2 mt-4 pt-4 border-t border-primary-100">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check size={14} className="text-primary-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {user?.email && (
            <div className="text-sm text-gray-500 mb-6">
              {t('checkout.loggedAs')} <span className="font-semibold text-gray-800">{user.email}</span>
            </div>
          )}

          <Button onClick={handleCheckout} loading={loading} fullWidth size="lg" className="gap-2">
            {t('checkout.payBtn')}
          </Button>

          <p className="text-xs text-gray-400 text-center mt-4">{t('checkout.legal')}</p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <I18nProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary-500" /></div>}>
        <CheckoutContent />
      </Suspense>
    </I18nProvider>
  );
}
