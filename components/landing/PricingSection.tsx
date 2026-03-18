'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, X as XIcon, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useT } from '@/hooks/useTranslation';
import { PLANS } from '@/lib/stripe';

const FAQ = [
  {
    q: 'Puis-je annuler à tout moment ?',
    a: 'Oui. Sans engagement, tu peux annuler à tout moment depuis ton espace client. Tu conserves l\'accès jusqu\'à la fin de la période payée.',
  },
  {
    q: 'Que se passe-t-il après 5 factures en plan Gratuit ?',
    a: 'Tu peux continuer à consulter et télécharger tes factures existantes, mais tu ne pourras plus en créer de nouvelles. Un rappel te proposera de passer au plan Solo.',
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: 'Oui. Toutes les données sont chiffrées et hébergées en Europe. DictaBill est conforme RGPD. Nous ne vendons aucune donnée.',
  },
  {
    q: 'Y a-t-il une période d\'essai Solo ?',
    a: 'Oui — 3 jours d\'essai Solo offerts sans carte bancaire. Tu bascules automatiquement sur le plan Gratuit si tu ne souscrits pas.',
  },
  {
    q: 'Les factures sont-elles conformes à la loi française ?',
    a: 'Oui. DictaBill génère des factures conformes aux exigences légales françaises : numérotation continue, mentions obligatoires, TVA, format PDF archivable.',
  },
];

const COMPETITORS = [
  { name: 'DictaBill', solo: '9,99€', voice: true, pdf: true, reminder: true, facturx: false, highlight: true },
  { name: 'Freebe', solo: '12€', voice: false, pdf: true, reminder: true, facturx: false, highlight: false },
  { name: 'Zervant', solo: '12€', voice: false, pdf: true, reminder: false, facturx: false, highlight: false },
  { name: 'Factur-X', solo: '15€+', voice: false, pdf: true, reminder: false, facturx: true, highlight: false },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-semibold text-gray-900">{q}</span>
        {open ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function PricingSection() {
  const { t, lang } = useT();
  const [annual, setAnnual] = useState(false);

  const soloMonthlyEquiv = (PLANS.solo.annualPrice / 12).toFixed(2);
  const proMonthlyEquiv = (PLANS.pro.annualPrice / 12).toFixed(2);

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                {t('pricing.save')}
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 items-start max-w-5xl mx-auto">
          {/* Free */}
          <div className="card p-8 flex flex-col">
            <h3 className="text-xl font-black text-gray-900">{t('pricing.free.name')}</h3>
            <p className="text-gray-400 text-sm mt-1">{t('pricing.free.desc')}</p>
            <div className="mt-4 mb-6">
              <span className="text-4xl font-black text-gray-900">{t('pricing.free.price')}</span>
              <span className="text-gray-400 text-sm"> /mois</span>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {(t('pricing.free.features', { returnObjects: true }) as string[]).map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <Check size={15} className="text-gray-400 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block text-center border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all text-sm">
              {t('pricing.free.cta')}
            </Link>
          </div>

          {/* Solo — recommended */}
          <div className="relative card p-8 flex flex-col border-2 border-primary-500 shadow-xl shadow-primary-100">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
              <Zap size={11} fill="white" /> {t('pricing.solo.badge')}
            </div>
            <h3 className="text-xl font-black text-gray-900">{t('pricing.solo.name')}</h3>
            <p className="text-gray-400 text-sm mt-1">{t('pricing.solo.desc')}</p>
            <div className="mt-4 mb-1">
              <span className="text-4xl font-black text-primary-600">
                {annual ? `${soloMonthlyEquiv}€` : `${PLANS.solo.monthlyPrice}€`}
              </span>
              <span className="text-gray-400 text-sm"> /mois</span>
            </div>
            {annual && (
              <p className="text-xs text-gray-400 mb-4">
                Soit <span className="font-bold text-gray-700">{PLANS.solo.annualPrice}€/an</span> — <span className="text-green-600 font-semibold">économisez 20%</span>
              </p>
            )}
            {!annual && <p className="text-xs text-primary-600 font-semibold mb-4">3 jours d'essai gratuit · Sans CB</p>}
            <ul className="space-y-3 flex-1 mb-8">
              {PLANS.solo.features[lang === 'en' ? 'en' : 'fr'].map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Check size={15} className="text-primary-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/checkout?plan=solo&interval=${annual ? 'annual' : 'monthly'}`}
              className="block text-center bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-primary-200 hover:shadow-lg text-sm"
            >
              {t('pricing.solo.cta')}
            </Link>
          </div>

          {/* Pro */}
          <div className="relative card p-8 flex flex-col border-2 border-gray-900">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
              {t('pricing.pro.badge')}
            </div>
            <h3 className="text-xl font-black text-gray-900">{t('pricing.pro.name')}</h3>
            <p className="text-gray-400 text-sm mt-1">{t('pricing.pro.desc')}</p>
            <div className="mt-4 mb-1">
              <span className="text-4xl font-black text-gray-900">
                {annual ? `${proMonthlyEquiv}€` : `${PLANS.pro.monthlyPrice}€`}
              </span>
              <span className="text-gray-400 text-sm"> /mois</span>
            </div>
            {annual && (
              <p className="text-xs text-gray-400 mb-4">
                Soit <span className="font-bold text-gray-700">{PLANS.pro.annualPrice}€/an</span> — <span className="text-green-600 font-semibold">économisez 17%</span>
              </p>
            )}
            {!annual && <div className="mb-4" />}
            <ul className="space-y-3 flex-1 mb-8">
              {PLANS.pro.features[lang === 'en' ? 'en' : 'fr'].map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Check size={15} className="text-gray-700 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/checkout?plan=pro&interval=${annual ? 'annual' : 'monthly'}`}
              className="block text-center bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all text-sm"
            >
              {t('pricing.pro.cta')}
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">{t('pricing.legal')}</p>

        {/* ── Competitor comparison ── */}
        <div className="mt-20">
          <h3 className="text-2xl font-black text-gray-900 text-center mb-2">Pourquoi DictaBill ?</h3>
          <p className="text-gray-500 text-center text-sm mb-8">Comparez avec les alternatives du marché</p>
          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Outil</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">Prix Solo/mois</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">Voix IA</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">PDF pro</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">Relances auto</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.map((c) => (
                  <tr key={c.name} className={c.highlight ? 'bg-primary-50 rounded-xl' : 'border-t border-gray-100'}>
                    <td className={`py-3.5 px-4 text-sm font-bold ${c.highlight ? 'text-primary-700' : 'text-gray-700'}`}>
                      {c.name} {c.highlight && <span className="ml-1.5 text-[10px] bg-primary-500 text-white px-1.5 py-0.5 rounded-full font-bold">Vous</span>}
                    </td>
                    <td className={`py-3.5 px-4 text-center text-sm font-semibold ${c.highlight ? 'text-primary-700' : 'text-gray-600'}`}>{c.solo}</td>
                    <td className="py-3.5 px-4 text-center">{c.voice ? <Check size={16} className="text-primary-500 mx-auto" /> : <XIcon size={16} className="text-gray-300 mx-auto" />}</td>
                    <td className="py-3.5 px-4 text-center">{c.pdf ? <Check size={16} className="text-primary-500 mx-auto" /> : <XIcon size={16} className="text-gray-300 mx-auto" />}</td>
                    <td className="py-3.5 px-4 text-center">{c.reminder ? <Check size={16} className="text-primary-500 mx-auto" /> : <XIcon size={16} className="text-gray-300 mx-auto" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h3 className="text-2xl font-black text-gray-900 text-center mb-8">Questions fréquentes</h3>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
