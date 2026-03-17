'use client';
import Link from 'next/link';
import { useT } from '@/hooks/useTranslation';
import { Mic, ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  const { t } = useT();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-white pt-16">
      {/* Background blobs */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-100/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — copy */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full mb-8 border border-primary-100">
            <span className="text-base">🎙</span>
            {t('hero.badge')}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6">
            <span className="text-gray-900">{t('hero.title')}</span>{' '}
            <span className="text-primary-500 relative">
              {t('hero.titleAccent')}
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M2 6 Q100 1 198 6" stroke="#1D9E75" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 active:scale-95"
            >
              <Mic size={22} />
              {t('hero.cta')}
              <ArrowRight size={18} />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold px-6 py-4 rounded-2xl text-base border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
              <Play size={16} className="text-primary-500" fill="#1D9E75" />
              {t('hero.demo')}
            </button>
          </div>

          <p className="text-xs text-gray-400">{t('hero.ctaSub')}</p>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start">
            <div className="flex -space-x-2">
              {['M', 'T', 'S', 'A', 'J'].map((l, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  {l}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-800">+1 200</span> indépendants · <span className="text-primary-600 font-semibold">★ 4.9/5</span>
            </p>
          </div>
        </div>

        {/* Right — App mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-72 sm:w-80">
            {/* Phone frame */}
            <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
              <div className="bg-white rounded-[2.5rem] overflow-hidden" style={{ height: 580 }}>
                {/* Status bar */}
                <div className="bg-primary-500 px-6 pt-10 pb-5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-primary-100 text-xs">Bonjour 👋</p>
                      <p className="text-white font-bold text-base">Mon Entreprise</p>
                    </div>
                    <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">M</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[['CA Mois', '4 250 €'], ['Attente', '3'], ['Retard', '1']].map(([label, val]) => (
                      <div key={label} className="bg-white/15 rounded-xl p-2.5 text-center">
                        <p className="text-primary-100 text-xs">{label}</p>
                        <p className="text-white font-bold text-sm">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-700">Documents récents</p>
                    <span className="text-xs text-primary-500 font-semibold">Voir tout</span>
                  </div>
                  {[
                    { num: 'FACT-2026-012', client: 'Acme Corp', amount: '2 400 €', status: 'Payée', statusColor: 'bg-green-100 text-green-700' },
                    { num: 'FACT-2026-011', client: 'Studio Leo', amount: '1 850 €', status: 'Envoyée', statusColor: 'bg-blue-100 text-blue-700' },
                    { num: 'DEVIS-2026-003', client: 'StartupX', amount: '5 000 €', status: 'Brouillon', statusColor: 'bg-gray-100 text-gray-600' },
                  ].map((inv) => (
                    <div key={inv.num} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between border-l-4 border-primary-300">
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{inv.num}</p>
                        <p className="text-sm font-semibold text-gray-800">{inv.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{inv.amount}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${inv.statusColor}`}>{inv.status}</span>
                      </div>
                    </div>
                  ))}

                  {/* Mic button */}
                  <div className="flex justify-center pt-2">
                    <div className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-200 animate-bounce-soft">
                      <Mic size={24} color="white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-12 top-24 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-gray-100">
              <span className="text-2xl">🎙</span>
              <div>
                <p className="text-xs font-bold text-gray-800">Facture créée !</p>
                <p className="text-xs text-gray-400">en 28 secondes</p>
              </div>
            </div>
            <div className="absolute -right-8 bottom-32 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-gray-100">
              <span className="text-2xl">💳</span>
              <div>
                <p className="text-xs font-bold text-green-600">+2 400 €</p>
                <p className="text-xs text-gray-400">Payé par Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
