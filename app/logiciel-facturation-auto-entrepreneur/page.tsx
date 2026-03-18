import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Mic, FileText, Clock, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Logiciel de facturation auto-entrepreneur gratuit – DictaBill',
  description: 'DictaBill est le logiciel de facturation par voix pensé pour les auto-entrepreneurs. Créez vos factures conformes en 30 secondes. Gratuit, sans CB.',
  openGraph: {
    title: 'Logiciel de facturation auto-entrepreneur – DictaBill',
    description: 'Facturez vos clients en 30 secondes avec votre voix. Conforme loi française, TVA automatique, PDF pro.',
  },
  alternates: { canonical: 'https://dictabill.com/logiciel-facturation-auto-entrepreneur' },
};

const FEATURES = [
  { icon: Mic, title: 'Facturation vocale', desc: 'Dictez votre facture naturellement. "Facture pour Dupont, mission web, 800€ HT." L\'IA fait le reste.' },
  { icon: FileText, title: 'PDF conforme auto-entrepreneur', desc: 'Toutes les mentions légales obligatoires : numéro de SIRET, franchise de TVA ou TVA applicable, numérotation chronologique.' },
  { icon: Clock, title: '30 secondes chrono', desc: 'Plus besoin de passer 20 minutes sur un logiciel compliqué. Créez votre facture pendant que votre client est encore en ligne.' },
  { icon: Shield, title: 'Conforme loi française', desc: 'Format PDF archivable, numérotation continue, mentions légales auto-entrepreneur. Tout est géré automatiquement.' },
];

export default function AutoEntrepreneurPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100 py-4 px-6">
        <Link href="/" className="flex items-center gap-1 w-fit">
          <span className="text-xl font-black"><span className="text-primary-500">Dicta</span><span className="text-gray-900">Bill</span></span>
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 border border-primary-200 bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          Auto-entrepreneur
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
          Le logiciel de facturation<br className="hidden sm:block" />
          <span className="text-primary-500"> pensé pour les auto-entrepreneurs</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          Finis les logiciels complexes. Avec DictaBill, tu crées une facture conforme en 30 secondes, par la voix. Sans formation, sans prise de tête.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-primary-200">
            <Mic size={18} /> Commencer gratuitement
          </Link>
          <Link href="/pricing" className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-all">
            Voir les tarifs
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">5 factures/mois gratuites · Sans carte bancaire</p>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">
            Tout ce qu'un auto-entrepreneur attend d'un logiciel de facturation
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
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

      {/* What's included */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-4">Plan Gratuit — ce qui est inclus</h2>
        <p className="text-gray-500 text-center mb-10">Parfait pour démarrer en tant qu'auto-entrepreneur</p>
        <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {[
            '5 factures par mois',
            'Facturation vocale IA',
            'Génération PDF pro',
            '1 template de facturation',
            'Envoi par email',
            'Mentions légales auto',
            'TVA gérée automatiquement',
            'Accès mobile & web',
          ].map((f) => (
            <div key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
              <Check size={15} className="text-primary-500 shrink-0" /> {f}
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/register" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary-200 text-lg">
            Créer mon compte gratuitement
          </Link>
        </div>
      </section>

      {/* SEO content */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-gray">
          <h2 className="text-2xl font-black text-gray-900">Quel logiciel de facturation choisir quand on est auto-entrepreneur ?</h2>
          <p className="text-gray-600 leading-relaxed">En tant qu'auto-entrepreneur, la loi française vous oblige à émettre des factures conformes pour toute prestation. Un bon logiciel de facturation doit inclure les mentions obligatoires (numéro SIRET, date, numéro séquentiel, TVA ou mention "TVA non applicable, art. 293 B du CGI"), générer un PDF archivable et être simple à utiliser.</p>
          <p className="text-gray-600 leading-relaxed">DictaBill va plus loin : grâce à sa technologie de reconnaissance vocale, vous créez une facture complète en moins de 30 secondes, sans saisir aucun champ manuellement. Dites simplement "Facture pour [client], [description], [montant] euros" et le document est généré automatiquement.</p>
          <h3 className="text-xl font-bold text-gray-900">Facturation auto-entrepreneur : les obligations légales</h3>
          <ul className="text-gray-600 space-y-1">
            <li>Numéro de SIRET et forme juridique</li>
            <li>Numérotation chronologique et continue des factures</li>
            <li>Date d'émission et date de prestation</li>
            <li>Identité complète du client</li>
            <li>Description détaillée de la prestation</li>
            <li>Montant HT, TVA (ou mention d'exonération), montant TTC</li>
            <li>Conditions de paiement et pénalités de retard</li>
          </ul>
          <p className="text-gray-600">Tous ces éléments sont automatiquement intégrés par DictaBill dans chaque facture générée.</p>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="border-t border-gray-100 py-8 text-center">
        <p className="text-xs text-gray-400">© 2025 DictaBill · <Link href="/privacy" className="hover:text-gray-600">Confidentialité</Link> · <Link href="/terms" className="hover:text-gray-600">CGU</Link></p>
      </footer>
    </div>
  );
}
