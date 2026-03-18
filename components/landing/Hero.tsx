'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useT } from '@/hooks/useTranslation';
import { Mic, ArrowRight, Play, CheckCircle2, CreditCard, TrendingUp } from 'lucide-react';
import DemoModal from '@/components/landing/DemoModal';

export default function Hero() {
  const { t } = useT();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-16">
      {/* Subtle bg element — single bottom-right gradient, not AI blob soup */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-gradient-to-tl from-primary-50 via-primary-50/20 to-transparent rounded-tl-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — copy */}
        <div className="text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-primary-200 bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full mb-8 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            {t('hero.badge')}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            <span className="text-gray-900 block">Facture en</span>
            <span className="relative inline-block text-primary-500">
              30 secondes.
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none">
                <path d="M0 5 Q50 1 100 4 Q150 7 200 3" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </svg>
            </span>
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
            L'app de facturation des freelancers qui n'ont pas le temps. Tu parles, l'IA crée ta facture et l'envoie.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-primary-200/60 hover:shadow-xl hover:shadow-primary-300/40 active:scale-[0.98]"
            >
              <Mic size={18} />
              {t('hero.cta')}
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-6 py-3.5 rounded-xl text-base border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                <Play size={10} className="text-white fill-white ml-0.5" />
              </div>
              Essaier sans inscription
            </button>
          </div>

          <p className="text-xs text-gray-400 mb-8">{t('hero.ctaSub')}</p>

          {/* Social proof */}
          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <div className="flex -space-x-2.5">
              {[
                { l: 'M', bg: 'bg-primary-500' },
                { l: 'T', bg: 'bg-blue-500' },
                { l: 'S', bg: 'bg-amber-500' },
                { l: 'A', bg: 'bg-purple-500' },
                { l: 'J', bg: 'bg-rose-500' },
              ].map(({ l, bg }, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                  {l}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">+1 200 indépendants</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <span className="text-amber-400">★★★★★</span> 4.9/5
              </p>
            </div>
          </div>
        </div>

        {/* Right — Phone mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative" style={{ width: 280 }}>
            {/* Drop shadow */}
            <div className="absolute inset-0 bg-gray-900 rounded-[3.5rem] opacity-20 blur-2xl scale-90 translate-y-6" />

            {/* Phone frame */}
            <div className="relative bg-gray-900 rounded-[3.5rem] p-[10px] ring-1 ring-white/10">
              {/* Side buttons */}
              <div className="absolute -left-[3px] top-28 w-[3px] h-10 bg-gray-700 rounded-l-md" />
              <div className="absolute -left-[3px] top-44 w-[3px] h-8 bg-gray-700 rounded-l-md" />
              <div className="absolute -right-[3px] top-36 w-[3px] h-14 bg-gray-700 rounded-r-md" />

              {/* Screen */}
              <div className="bg-gray-50 rounded-[3rem] overflow-hidden" style={{ height: 580 }}>
                {/* Status bar + notch */}
                <div className="bg-gray-900 h-8 flex items-center justify-center relative">
                  <div className="w-24 h-5 bg-gray-900 rounded-full absolute top-1" style={{ zIndex: 1 }} />
                  <div className="w-16 h-4 bg-black rounded-full" />
                </div>

                {/* App header */}
                <div className="bg-primary-500 px-5 pt-4 pb-5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-primary-100 text-[11px] font-medium">Bonjour</p>
                      <p className="text-white font-bold text-sm">Mon Entreprise</p>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">M</span>
                    </div>
                  </div>
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[['CA Mois', '4 250 €'], ['En attente', '3'], ['En retard', '1']].map(([label, val]) => (
                      <div key={label} className="bg-white/15 rounded-xl p-2 text-center">
                        <p className="text-primary-100 text-[9px] leading-tight">{label}</p>
                        <p className="text-white font-bold text-xs mt-0.5">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 py-3 space-y-2 bg-white/50">
                  {/* Chart placeholder */}
                  <div className="bg-white rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-gray-700">Chiffre d'affaires</p>
                      <TrendingUp size={12} className="text-primary-500" />
                    </div>
                    <div className="flex items-end gap-1 h-10">
                      {[30, 55, 40, 70, 60, 85, 75].map((h, i) => (
                        <div key={i} className="flex-1 bg-primary-100 rounded-t-sm" style={{ height: `${h}%` }}>
                          <div className="w-full bg-primary-500 rounded-t-sm" style={{ height: i === 5 ? '100%' : '60%' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-gray-500 px-1">Documents récents</p>
                  {[
                    { num: 'FACT-2026-012', client: 'Acme Corp', amount: '2 400 €', color: 'bg-green-500' },
                    { num: 'FACT-2026-011', client: 'Studio Leo', amount: '1 850 €', color: 'bg-blue-500' },
                    { num: 'DEVIS-2026-003', client: 'StartupX', amount: '5 000 €', color: 'bg-gray-300' },
                  ].map((inv) => (
                    <div key={inv.num} className="bg-white rounded-xl p-2.5 flex items-center gap-2.5 border border-gray-100">
                      <div className={`w-1.5 h-8 rounded-full ${inv.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-gray-400 font-medium truncate">{inv.num}</p>
                        <p className="text-xs font-semibold text-gray-800 truncate">{inv.client}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-900">{inv.amount}</span>
                    </div>
                  ))}

                  {/* Mic button */}
                  <div className="flex justify-center pt-1">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-200 animate-bounce-soft">
                      <Mic size={20} color="white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating notification — invoice created */}
            <div className="absolute -left-14 top-20 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 border border-gray-100 animate-float">
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={16} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Facture créée !</p>
                <p className="text-[10px] text-gray-400">en 28 secondes</p>
              </div>
            </div>

            {/* Floating notification — payment */}
            <div className="absolute -right-10 bottom-28 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 border border-gray-100 animate-float-delay">
              <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center">
                <CreditCard size={16} className="text-primary-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-green-600">+2 400 €</p>
                <p className="text-[10px] text-gray-400">Payé par Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
