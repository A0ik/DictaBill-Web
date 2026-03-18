import type { Metadata } from 'next';
import Link from 'next/link';
import { Mic, Check, ShieldCheck, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Logiciel facturation micro-entreprise 2025 – Simple & conforme – DictaBill',
  description: 'DictaBill simplifie la facturation pour micro-entreprises. Mentions légales, franchise TVA, PDF conforme. Essai gratuit. Sans engagement.',
  openGraph: {
    title: 'Facturation micro-entreprise – DictaBill',
    description: 'Logiciel de facturation simple, conforme et rapide pour micro-entrepreneurs.',
  },
  alternates: { canonical: 'https://dictabill.com/facturation-micro-entreprise' },
};

export default function MicroEntreprisePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6">
        <Link href="/" className="flex items-center gap-1 w-fit">
          <span className="text-xl font-black"><span className="text-primary-500">Dicta</span><span className="text-gray-900">Bill</span></span>
        </Link>
      </header>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 border border-primary-200 bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          Micro-entreprise
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
          Facturation micro-entreprise<br className="hidden sm:block" />
          <span className="text-primary-500"> simple, rapide et conforme</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          DictaBill gère automatiquement toutes les mentions légales pour votre micro-entreprise : franchise de TVA, SIRET, numérotation chronologique. Créez votre première facture en 30 secondes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-primary-200">
            <Mic size={18} /> Commencer gratuitement
          </Link>
          <Link href="/pricing" className="inline-flex items-center justify-center border border-gray-200 text-gray-700 font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-all">
            Voir les tarifs
          </Link>
        </div>
        <p className="text-xs text-gray-400">5 factures/mois gratuites · Sans carte bancaire</p>
      </section>

      {/* Compliance features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-4">Conforme aux exigences légales 2025</h2>
          <p className="text-gray-500 text-center mb-10">DictaBill gère automatiquement la conformité de vos factures micro-entreprise</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: ShieldCheck,
                title: 'Franchise TVA',
                desc: 'Si votre CA ne dépasse pas le seuil, DictaBill intègre automatiquement la mention "TVA non applicable, art. 293 B du CGI".',
              },
              {
                icon: FileText,
                title: 'Mentions obligatoires',
                desc: 'SIRET, date, numéro séquentiel, identité client, description, montant — tout est inclus dans chaque PDF.',
              },
              {
                icon: Mic,
                title: 'Voix IA',
                desc: 'Dictez votre facture en une phrase. L\'IA extrait toutes les informations et génère le document conforme.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Included free */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Gratuit pour démarrer</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {[
            '5 factures gratuites par mois',
            'Mentions légales automatiques',
            'PDF professionnel téléchargeable',
            'Numérotation chronologique auto',
            'Envoi par email depuis l\'app',
            'Accès web & mobile',
            'Pas de carte bancaire',
            'Sans engagement',
          ].map((f) => (
            <div key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
              <Check size={14} className="text-primary-500 shrink-0" /> {f}
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/register" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary-200 text-base">
            Créer mon compte gratuit
          </Link>
        </div>
      </section>

      {/* Content for SEO */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Facturation micro-entreprise : tout ce que vous devez savoir</h2>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>En France, les micro-entreprises (anciennement auto-entrepreneurs) sont soumises à des obligations de facturation strictes. Toute prestation de service ou vente doit faire l'objet d'une facture conforme, conservée pendant 10 ans.</p>
            <p>La principale particularité de la facturation en micro-entreprise est la <strong>franchise en base de TVA</strong> : si votre chiffre d'affaires annuel ne dépasse pas les seuils légaux (36 800€ pour les services en 2025), vous n'êtes pas assujetti à la TVA et devez obligatoirement mentionner "TVA non applicable, article 293 B du CGI" sur chaque facture.</p>
            <p>Avec DictaBill, cette mention est gérée automatiquement en fonction du paramétrage de votre compte. Vous n'avez pas à vous souvenir des règles — le logiciel s'en charge.</p>
            <h3 className="text-base font-bold text-gray-900 mt-4">Les mentions obligatoires sur une facture micro-entreprise</h3>
            <ul className="space-y-1 list-disc pl-4">
              <li>Date d'émission de la facture</li>
              <li>Numéro unique et chronologique</li>
              <li>Vos coordonnées complètes + numéro SIRET</li>
              <li>Coordonnées complètes du client</li>
              <li>Description précise de la prestation ou du produit</li>
              <li>Quantité, prix unitaire et total HT</li>
              <li>Mention TVA ou mention d'exonération</li>
              <li>Date de règlement et pénalités de retard</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center">
        <p className="text-xs text-gray-400">© 2025 DictaBill · <Link href="/privacy" className="hover:text-gray-600">Confidentialité</Link> · <Link href="/terms" className="hover:text-gray-600">CGU</Link></p>
      </footer>
    </div>
  );
}
