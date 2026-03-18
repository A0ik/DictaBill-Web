import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowLeft, Mic } from 'lucide-react';

export const metadata: Metadata = {
  title: '5 erreurs de facturation qui coûtent cher aux freelances – DictaBill',
  description: 'TVA mal calculée, mentions manquantes, numérotation incorrecte... Ces 5 erreurs de facturation peuvent vous coûter cher. Apprenez à les éviter.',
  openGraph: {
    title: '5 erreurs de facturation qui coûtent cher aux freelances',
    description: 'Les erreurs de facturation les plus courantes et comment les éviter pour protéger votre activité.',
  },
  alternates: { canonical: 'https://dictabill.com/blog/erreurs-facturation-freelance' },
};

export default function ArticleEreursFacturation() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-black"><span className="text-primary-500">Dicta</span><span className="text-gray-900">Bill</span></span>
        </Link>
        <Link href="/register" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          Commencer gratuitement →
        </Link>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link href="/blog" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors w-fit">
            <ArrowLeft size={14} /> Blog
          </Link>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">Conseils</span>
            <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} /> 6 min de lecture</span>
            <span className="text-xs text-gray-400">1 avril 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
            5 erreurs de facturation qui coûtent cher aux freelances
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Une facture mal rédigée peut entraîner un redressement fiscal, des retards de paiement, voire des litiges coûteux. Voici les 5 erreurs les plus fréquentes — et comment les éviter une bonne fois pour toutes.
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">

          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <span className="w-9 h-9 bg-red-500 text-white rounded-xl flex items-center justify-center font-black text-base shrink-0">1</span>
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Oublier des mentions obligatoires</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Une facture incomplète n'est pas légalement valable. L'administration fiscale peut refuser le droit à déduction de TVA à votre client, ce qui le mettra en colère — et peut retarder votre paiement.
                </p>
                <div className="mt-3 bg-white rounded-xl p-3 border border-red-100">
                  <p className="text-xs font-bold text-gray-700 mb-1">Les mentions souvent oubliées :</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>→ Le numéro de SIRET du vendeur</li>
                    <li>→ La mention TVA non applicable (pour les auto-entrepreneurs)</li>
                    <li>→ La date d'échéance et les pénalités de retard</li>
                    <li>→ L'indemnité forfaitaire de recouvrement de 40€</li>
                  </ul>
                </div>
                <p className="text-xs text-gray-500 mt-3 italic">DictaBill remplit automatiquement toutes les mentions légales selon votre statut. Zéro oubli possible.</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <span className="w-9 h-9 bg-red-500 text-white rounded-xl flex items-center justify-center font-black text-base shrink-0">2</span>
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Numérotation irrégulière ou avec des trous</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  La numérotation des factures doit être <strong>chronologique, continue et sans saut</strong>. Si vous passez de FACT-2025-003 à FACT-2025-005, l'administration fiscale peut supposer que vous avez dissimulé une facture (FACT-2025-004) pour ne pas déclarer les revenus correspondants.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mt-2">
                  Vous ne pouvez pas non plus supprimer une facture. Si vous avez fait une erreur, vous devez émettre un <strong>avoir</strong> qui annule la facture incorrecte, puis créer une nouvelle facture avec le bon numéro suivant.
                </p>
                <p className="text-xs text-gray-500 mt-3 italic">DictaBill numérote automatiquement vos factures dans l'ordre. Impossible de créer un trou dans la séquence.</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <span className="w-9 h-9 bg-red-500 text-white rounded-xl flex items-center justify-center font-black text-base shrink-0">3</span>
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Mal gérer la TVA (ou oublier de la déclarer)</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Deux erreurs fréquentes et opposées :
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mt-2">
                  <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">→</span> <strong>Facturer la TVA alors qu'on est en franchise</strong> : vous devez alors la reverser à l'État, mais vous n'avez pas le droit de la récupérer sur vos achats.</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 shrink-0">→</span> <strong>Dépasser le seuil de franchise sans le savoir</strong> : si vous passez 36 800€ de CA sans avoir facturé la TVA, vous devrez la reverser à l'État de votre propre poche sur les factures passées.</li>
                </ul>
                <div className="mt-3 bg-white rounded-xl p-3 border border-red-100 text-xs text-gray-700">
                  <strong>Seuils 2025 :</strong> 36 800€ pour les prestations de services. Si vous êtes proche, surveillez votre CA mensuel de près.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <span className="w-9 h-9 bg-red-500 text-white rounded-xl flex items-center justify-center font-black text-base shrink-0">4</span>
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Envoyer la facture trop tard</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Beaucoup de freelances attendent la fin du mois pour envoyer toutes leurs factures. C'est une erreur : plus vous attendez, plus le paiement tarde. Les services comptables des entreprises traitent les factures dans l'ordre de réception.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mt-2">
                  <strong>Règle d'or :</strong> émettez votre facture le jour même de la livraison ou de la fin de la prestation. Avec DictaBill, ça prend 30 secondes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <span className="w-9 h-9 bg-red-500 text-white rounded-xl flex items-center justify-center font-black text-base shrink-0">5</span>
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Ne pas relancer les impayés</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Par peur de "froisser" le client, beaucoup de freelances n'osent pas relancer. Résultat : certaines factures ne sont jamais payées, simplement parce que le client sait qu'il ne recevra jamais de rappel.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mt-2">
                  Relancer un client n'est pas agressif — c'est professionnel. Un simple email 3 jours après l'échéance suffit souvent à déclencher le paiement. Les relances automatiques de DictaBill s'en chargent à votre place.
                </p>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">La solution : automatiser pour éliminer les erreurs</h2>
            <p className="text-gray-600 leading-relaxed">
              La plupart de ces erreurs viennent du fait que la facturation est faite à la main, dans Excel ou Word, sous pression. Un outil dédié comme DictaBill élimine structurellement ces risques :
            </p>
            <ul className="space-y-2 text-sm text-gray-600 pl-4 list-disc">
              <li>Mentions légales complètes et adaptées à votre statut</li>
              <li>Numérotation automatique, chronologique, sans erreur</li>
              <li>Calcul de TVA automatique selon le taux renseigné</li>
              <li>Envoi immédiat par email après création</li>
              <li>Relances automatiques configurables (J+3, J+15, J+30)</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 bg-primary-50 rounded-3xl p-8 text-center border border-primary-100">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mic size={22} color="white" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Facturez sans erreur dès aujourd'hui</h3>
          <p className="text-gray-500 text-sm mb-5">DictaBill génère des factures légalement complètes en 30 secondes. 5 factures/mois gratuites.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-md shadow-primary-200">
            Commencer gratuitement
          </Link>
        </div>
      </article>

      <footer className="border-t border-gray-100 py-8 text-center">
        <p className="text-xs text-gray-400">© 2025 DictaBill · <Link href="/privacy" className="hover:text-gray-600">Confidentialité</Link></p>
      </footer>
    </div>
  );
}
