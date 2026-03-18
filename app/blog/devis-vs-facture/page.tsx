import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowLeft, Mic } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Devis vs Facture : quelle différence ? – DictaBill',
  description: "Devis ou facture ? Découvrez les différences légales, quand utiliser l'un ou l'autre, et comment convertir un devis en facture en 1 clic avec DictaBill.",
  openGraph: {
    title: 'Devis vs Facture : quelle différence ?',
    description: 'Différences légales, obligations, et comment convertir un devis en facture facilement.',
  },
  alternates: { canonical: 'https://dictabill.com/blog/devis-vs-facture' },
};

export default function ArticleDevisVsFacture() {
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
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">Facturation</span>
            <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} /> 5 min de lecture</span>
            <span className="text-xs text-gray-400">20 mars 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
            Devis vs Facture : quelle différence ?
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Devis et facture sont deux documents distincts avec des valeurs légales différentes. Comprendre la différence vous évitera des litiges et vous permettra de gérer votre activité sereinement.
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">1. Le devis : un engagement commercial</h2>
            <p className="text-gray-600 leading-relaxed">
              Le devis est un document <strong>précontractuel</strong> qui décrit les prestations ou produits que vous proposez, avec leur prix, avant que la commande soit passée. Il engage les deux parties une fois signé par le client.
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-sm font-bold text-gray-800 mb-3">Ce que doit contenir un devis :</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  'Date de rédaction et durée de validité (généralement 1 à 3 mois)',
                  'Vos coordonnées complètes (nom, adresse, SIRET)',
                  'Coordonnées du client',
                  'Description détaillée des prestations',
                  'Prix unitaire HT, quantité, taux de TVA, total TTC',
                  'Délai de réalisation',
                  'Conditions de paiement et d\'acompte',
                  'Mention "Devis gratuit et sans engagement" si applicable',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-primary-500 shrink-0 mt-0.5">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-gray-600 mt-4">
              Un devis signé par le client a valeur de <strong>bon de commande</strong>. Si vous ne respectez pas les termes du devis accepté, votre client peut se retourner contre vous.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">2. La facture : une obligation légale</h2>
            <p className="text-gray-600 leading-relaxed">
              La facture est un document comptable et fiscal <strong>obligatoire</strong> émis après la réalisation d'une prestation ou la livraison d'un produit. Contrairement au devis, elle doit être conservée pendant au moins 10 ans.
            </p>
            <p className="text-gray-600 leading-relaxed">
              La facture est la preuve que la vente a eu lieu. Sans facture, vous ne pouvez pas légalement réclamer le paiement, et vous risquez des sanctions fiscales. C'est aussi le document qui déclenche les délais de paiement légaux.
            </p>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-sm text-amber-800">
              <strong>Important :</strong> Emettre une facture est obligatoire entre professionnels, quelle que soit la somme. Entre un professionnel et un particulier, la facture est obligatoire au-delà de 25€ ou sur demande du client.
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">3. Tableau comparatif</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-bold text-gray-800 border border-gray-200">Critère</th>
                    <th className="text-left p-3 font-bold text-primary-600 border border-gray-200">Devis</th>
                    <th className="text-left p-3 font-bold text-gray-700 border border-gray-200">Facture</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {[
                    ['Moment d\'émission', 'Avant la prestation', 'Après la prestation'],
                    ['Valeur légale', 'Engagement commercial', 'Document fiscal obligatoire'],
                    ['Numérotation obligatoire', 'Non (recommandé)', 'Oui (chronologique)'],
                    ['Durée de conservation', '5 ans minimum', '10 ans minimum'],
                    ['Déclenche un paiement', 'Non', 'Oui'],
                    ['Modifiable', 'Oui (avant signature)', 'Non (émettre un avoir)'],
                  ].map(([critere, devis, facture]) => (
                    <tr key={critere} className="border-b border-gray-100">
                      <td className="p-3 font-medium border border-gray-200">{critere}</td>
                      <td className="p-3 border border-gray-200">{devis}</td>
                      <td className="p-3 border border-gray-200">{facture}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">4. Convertir un devis en facture</h2>
            <p className="text-gray-600 leading-relaxed">
              Lorsque le client accepte votre devis et que vous avez réalisé la prestation, vous devez émettre une facture. Deux approches :
            </p>
            <ol className="space-y-3 text-sm text-gray-600 list-decimal pl-4">
              <li><strong>Manuellement :</strong> Recopiez les éléments du devis dans une facture, changez le type de document et la date d'émission, et ajoutez un numéro de facture.</li>
              <li><strong>Avec un outil :</strong> DictaBill permet de <strong>convertir un devis en facture en 1 clic</strong>. Les informations sont reprises automatiquement, et seul le numéro change.</li>
            </ol>
            <p className="text-gray-600 mt-3">
              Cette conversion est essentielle pour un suivi comptable propre. Ne jamais facturer sans avoir un devis signé pour les prestations importantes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">5. L'avoir : quand une facture est erronée</h2>
            <p className="text-gray-600 leading-relaxed">
              Vous ne pouvez jamais supprimer une facture émise. Si vous avez fait une erreur (montant, client, prestation), vous devez émettre un <strong>avoir</strong> (ou note de crédit). L'avoir annule tout ou partie de la facture initiale et doit référencer le numéro de facture original.
            </p>
            <p className="text-gray-600">
              DictaBill génère automatiquement les avoirs avec la référence à la facture initiale, sans risque d'erreur de numérotation.
            </p>
          </section>
        </div>

        <div className="mt-12 bg-primary-50 rounded-3xl p-8 text-center border border-primary-100">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mic size={22} color="white" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Créez devis et factures en 30 secondes</h3>
          <p className="text-gray-500 text-sm mb-5">Dictez votre devis ou facture à voix haute. DictaBill s'occupe du reste. 5 documents/mois gratuits.</p>
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
