import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowLeft, Mic } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Comment relancer un client qui ne paie pas – DictaBill',
  description: 'Guide étape par étape pour relancer un client impayé : email amiable, mise en demeure, injonction de payer. Modèles de mails inclus.',
  openGraph: {
    title: 'Comment relancer un client qui ne paie pas',
    description: 'Procédure complète pour récupérer votre argent : relances email, mise en demeure, injonction de payer.',
  },
  alternates: { canonical: 'https://dictabill.com/blog/relancer-client-impaye' },
};

export default function ArticleRelancerClientImpaye() {
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
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">Gestion</span>
            <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} /> 7 min de lecture</span>
            <span className="text-xs text-gray-400">25 mars 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
            Comment relancer un client qui ne paie pas
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Les impayés sont le cauchemar des freelances. En France, 25% des factures professionnelles sont payées en retard. Voici la procédure complète, étape par étape, pour récupérer votre argent sans perdre vos clients.
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">1. Avant tout : prévenir les impayés</h2>
            <p className="text-gray-600 leading-relaxed">
              Le meilleur traitement des impayés, c'est la prévention. Quelques règles à adopter systématiquement :
            </p>
            <ul className="space-y-2 text-sm text-gray-600 pl-4 list-disc">
              <li>Demandez un <strong>acompte de 30 à 50%</strong> avant de démarrer toute mission</li>
              <li>Faites signer un devis ou contrat avant chaque prestation</li>
              <li>Mentionnez clairement les délais et pénalités de retard sur chaque facture</li>
              <li>Envoyez vos factures immédiatement après la prestation, pas des semaines plus tard</li>
              <li>Vérifiez la solvabilité des nouveaux clients (societe.com, Pappers)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">2. La procédure de relance en 4 étapes</h2>

            <div className="space-y-4">
              <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <h3 className="font-bold text-gray-900">J+1 après échéance — Relance amiable (email)</h3>
                </div>
                <p className="text-sm text-gray-600 ml-10">Ton cordial, supposez une erreur ou un oubli. Pas de ton accusateur. Joignez une copie de la facture.</p>
                <div className="ml-10 mt-3 bg-white rounded-xl p-4 border border-green-200 text-xs text-gray-700 font-mono leading-relaxed">
                  Objet : Rappel facture [numéro] — [votre nom]<br /><br />
                  Bonjour [prénom],<br /><br />
                  Sauf erreur de ma part, la facture n°[numéro] d'un montant de [montant]€ TTC émise le [date] arrive à échéance le [date].<br /><br />
                  Je me permets de vous la rappeler en pièce jointe. N'hésitez pas à me contacter si vous avez une question.<br /><br />
                  Cordialement,<br />
                  [votre nom]
                </div>
              </div>

              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <h3 className="font-bold text-gray-900">J+15 — Deuxième relance (email + appel)</h3>
                </div>
                <p className="text-sm text-gray-600 ml-10">Ton plus ferme. Mentionnez les pénalités de retard applicables dès aujourd'hui. Essayez aussi d'appeler.</p>
                <div className="ml-10 mt-3 bg-white rounded-xl p-4 border border-amber-200 text-xs text-gray-700 font-mono leading-relaxed">
                  Objet : Relance — facture [numéro] impayée<br /><br />
                  Bonjour [prénom],<br /><br />
                  Malgré mon précédent message, la facture n°[numéro] de [montant]€ TTC reste impayée à ce jour.<br /><br />
                  Je vous rappelle que des pénalités de retard au taux de [taux]% s'appliquent depuis le [date d'échéance], ainsi qu'une indemnité forfaitaire de recouvrement de 40€.<br /><br />
                  Merci de régulariser votre situation dans les 8 jours.<br /><br />
                  [votre nom]
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <h3 className="font-bold text-gray-900">J+30 — Mise en demeure (LRAR)</h3>
                </div>
                <p className="text-sm text-gray-600 ml-10">Envoyez une lettre recommandée avec accusé de réception. C'est la dernière étape avant action juridique. Donnez un délai de 8 jours.</p>
                <p className="text-sm text-gray-600 ml-10 mt-2">La mise en demeure est le point de départ légal si vous décidez ensuite de saisir la justice. Elle est indispensable.</p>
              </div>

              <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  <h3 className="font-bold text-gray-900">J+45 — Injonction de payer</h3>
                </div>
                <p className="text-sm text-gray-600 ml-10">Procédure simple, gratuite, 100% en ligne sur <strong>service-public.fr</strong>. Le tribunal émet une ordonnance que vous faites signifier par huissier. Le débiteur a 1 mois pour contester.</p>
                <p className="text-sm text-gray-600 ml-10 mt-2">Pour les montants importants (+5 000€), considérez un avocat ou une société de recouvrement (commission : 10-20% du montant récupéré).</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">3. Calculer les pénalités de retard</h2>
            <p className="text-gray-600 leading-relaxed">
              Vous avez le droit de facturer des pénalités dès le premier jour de retard, sans mise en demeure préalable. Le taux minimum légal est de <strong>3 fois le taux d'intérêt légal</strong> (soit environ 12-15% en 2025).
            </p>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm text-gray-700">
              <p className="font-bold mb-2">Exemple de calcul :</p>
              <p>Facture de 2 000€ HT en retard de 30 jours, taux annuel de 12% :</p>
              <p className="font-mono mt-1">2 000 × 12% × (30/365) = <strong>19,73€ de pénalités</strong></p>
              <p className="mt-2">+ indemnité forfaitaire de <strong>40€</strong> (automatique, pas besoin de la réclamer)</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">4. Automatiser les relances</h2>
            <p className="text-gray-600 leading-relaxed">
              Faire les relances manuellement est chronophage et émotionnellement difficile. DictaBill <strong>Solo et Pro</strong> incluent des relances automatiques par email : vous définissez les délais (J+3, J+15, J+30), et l'outil envoie les emails à votre place, avec vos coordonnées et la facture en pièce jointe.
            </p>
            <p className="text-gray-600">
              Résultat : vos clients paient plus vite, et vous passez moins de temps à courir après votre argent.
            </p>
          </section>
        </div>

        <div className="mt-12 bg-primary-50 rounded-3xl p-8 text-center border border-primary-100">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mic size={22} color="white" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Relances automatiques incluses</h3>
          <p className="text-gray-500 text-sm mb-5">DictaBill envoie les relances à votre place. Concentrez-vous sur votre métier, pas sur la comptabilité.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-md shadow-primary-200">
            Essayer gratuitement
          </Link>
        </div>
      </article>

      <footer className="border-t border-gray-100 py-8 text-center">
        <p className="text-xs text-gray-400">© 2025 DictaBill · <Link href="/privacy" className="hover:text-gray-600">Confidentialité</Link></p>
      </footer>
    </div>
  );
}
