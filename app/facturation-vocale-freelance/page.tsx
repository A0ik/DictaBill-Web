import type { Metadata } from 'next';
import Link from 'next/link';
import { Mic, Clock, Send, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Facturation vocale pour freelances – Créez vos factures en 30s – DictaBill',
  description: 'DictaBill est la première app de facturation vocale par IA pour freelances. Créez une facture complète en dictant une phrase. Essai gratuit, sans CB.',
  openGraph: {
    title: 'Facturation vocale freelance – DictaBill',
    description: 'Créez vos factures en 30 secondes avec votre voix. L\'IA s\'occupe de tout.',
  },
  alternates: { canonical: 'https://dictabill.com/facturation-vocale-freelance' },
};

export default function FacturationVocalePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6">
        <Link href="/" className="flex items-center gap-1 w-fit">
          <span className="text-xl font-black"><span className="text-primary-500">Dicta</span><span className="text-gray-900">Bill</span></span>
        </Link>
      </header>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 border border-primary-200 bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          Freelance
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
          La facturation vocale<br className="hidden sm:block" />
          <span className="text-primary-500"> pour les freelances</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          Tu n'as pas le temps de te battre avec un logiciel de facturation. DictaBill transcrit ta voix en facture professionnelle en moins de 30 secondes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-primary-200">
            <Mic size={18} /> Essayer gratuitement
          </Link>
        </div>
        <p className="text-xs text-gray-400">Aucune carte bancaire · 5 factures/mois offertes</p>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Mic, step: '01', title: 'Tu parles', desc: '"Facture pour BrandCo, identité visuelle, 2 200 euros HT, paiement 15 jours"' },
              { icon: Clock, step: '02', title: 'L\'IA structure', desc: 'DictaBill extrait le client, les lignes de facturation, la TVA et l\'échéance automatiquement.' },
              { icon: Send, step: '03', title: 'Tu envoies', desc: 'Vérifie le PDF, ajuste si besoin, puis envoie directement depuis l\'app.' },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4 relative">
                  <Icon size={22} color="white" />
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-900 text-white text-[10px] font-black rounded-full flex items-center justify-center">{step}</div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 italic">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Time saved */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-4">Le temps que tu vas gagner</h2>
        <p className="text-gray-500 text-center mb-10">Les freelances DictaBill économisent en moyenne 3 heures par semaine</p>
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          {[
            { value: '30s', label: 'par facture créée', sub: 'vs. 15 min en moyenne' },
            { value: '3h', label: 'économisées/semaine', sub: 'pour 10 factures/mois' },
            { value: '0€', label: 'pour commencer', sub: 'Plan gratuit sans CB' },
          ].map(({ value, label, sub }) => (
            <div key={value} className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
              <p className="text-4xl font-black text-primary-600">{value}</p>
              <p className="text-sm font-bold text-gray-800 mt-1">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Included */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Tout ce qu'un freelance a besoin</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Facturation vocale par IA',
              'PDF professionnel + logo',
              'Factures, devis, avoirs',
              'Envoi par email intégré',
              'Relances automatiques',
              'Tableau de bord CA',
              'Gestion des clients',
              'Paiement Stripe (Pro)',
              'Import clients IA (Solo+)',
              'Conforme loi française',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-gray-700 bg-white rounded-xl px-4 py-3 border border-gray-100">
                <Check size={14} className="text-primary-500 shrink-0" /> {f}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/register" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary-200 text-lg">
              Créer mon compte gratuit
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center">
        <p className="text-xs text-gray-400">© 2025 DictaBill · <Link href="/privacy" className="hover:text-gray-600">Confidentialité</Link> · <Link href="/terms" className="hover:text-gray-600">CGU</Link></p>
      </footer>
    </div>
  );
}
