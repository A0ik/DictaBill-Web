'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useT } from '@/hooks/useTranslation';
import { PLANS } from '@/lib/stripe';

export default function PricingSection() {
  const { t, lang } = useT();
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-badge">{t('pricing.badge')}</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">{t('pricing.title')}</h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">{t('pricing.subtitle')}</p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!annual ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${annual ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
            >
              {t('pricing.annual')}
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{t('pricing.save')}</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
          {/* Free */}
          <div className="card p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-900">{t('pricing.free.name')}</h3>
              <p className="text-gray-400 text-sm mt-1">{t('pricing.free.desc')}</p>
              <div className="mt-4">
                <span className="text-4xl font-black text-gray-900">{t('pricing.free.price')}</span>
                <span className="text-gray-400 text-sm">{t('pricing.perMonth')}</span>
              </div>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {(t('pricing.free.features', { returnObjects: true }) as string[]).map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <Check size={16} className="text-gray-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block text-center border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all">
              {t('pricing.free.cta')}
            </Link>
          </div>

          {/* Solo */}
          <div className="relative card p-8 flex flex-col border-2 border-primary-500 shadow-xl shadow-primary-100">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
              {t('pricing.solo.badge')}
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-900">{t('pricing.solo.name')}</h3>
              <p className="text-gray-400 text-sm mt-1">{t('pricing.solo.desc')}</p>
              <div className="mt-4">
                <span className="text-4xl font-black text-primary-600">
                  {annual ? `${PLANS.solo.annualPrice}€` : `${PLANS.solo.monthlyPrice}€`}
                </span>
                <span className="text-gray-400 text-sm">{annual ? t('pricing.perYear') : t('pricing.perMonth')}</span>
              </div>
              {annual && <p className="text-xs text-green-600 font-semibold mt-1">{t('pricing.billedAnnually')}</p>}
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {PLANS.solo.features[lang === 'en' ? 'en' : 'fr'].map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Check size={16} className="text-primary-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/checkout?plan=solo&interval=${annual ? 'annual' : 'monthly'}`}
              className="block text-center bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-primary-200 hover:shadow-lg"
            >
              {t('pricing.solo.cta')}
            </Link>
          </div>

          {/* Pro */}
          <div className="relative card p-8 flex flex-col border-2 border-gray-900">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
              {t('pricing.pro.badge')}
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-900">{t('pricing.pro.name')}</h3>
              <p className="text-gray-400 text-sm mt-1">{t('pricing.pro.desc')}</p>
              <div className="mt-4">
                <span className="text-4xl font-black text-gray-900">
                  {annual ? `${PLANS.pro.annualPrice}€` : `${PLANS.pro.monthlyPrice}€`}
                </span>
                <span className="text-gray-400 text-sm">{annual ? t('pricing.perYear') : t('pricing.perMonth')}</span>
              </div>
              {annual && <p className="text-xs text-green-600 font-semibold mt-1">{t('pricing.billedAnnually')}</p>}
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {PLANS.pro.features[lang === 'en' ? 'en' : 'fr'].map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Check size={16} className="text-gray-700 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/checkout?plan=pro&interval=${annual ? 'annual' : 'monthly'}`}
              className="block text-center bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all"
            >
              {t('pricing.pro.cta')}
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">{t('pricing.legal')}</p>
      </div>
    </section>
  );
}
