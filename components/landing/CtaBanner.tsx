'use client';
import Link from 'next/link';
import { Mic, ArrowRight } from 'lucide-react';
import { useT } from '@/hooks/useTranslation';

export default function CtaBanner() {
  const { t } = useT();
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">{t('cta.title')}</h2>
        <p className="text-lg text-gray-500 mb-10">{t('cta.subtitle')}</p>
        <Link
          href="/register"
          className="inline-flex items-center gap-3 bg-primary-500 hover:bg-primary-600 text-white font-bold px-10 py-5 rounded-2xl text-lg transition-all shadow-xl shadow-primary-200 hover:shadow-2xl hover:shadow-primary-300 active:scale-95"
        >
          <Mic size={22} />
          {t('cta.btn')}
          <ArrowRight size={18} />
        </Link>
        <p className="text-xs text-gray-400 mt-4">{t('cta.sub')}</p>
      </div>
    </section>
  );
}
