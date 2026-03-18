import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Conditions générales d\'utilisation – DictaBill',
  description: 'Conditions générales d\'utilisation et de vente du service DictaBill.',
  alternates: { canonical: 'https://dictabill.com/terms' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-black">
          <span className="text-primary-500">Dicta</span><span className="text-gray-900">Bill</span>
        </Link>
        <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900">Se connecter</Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-black text-gray-900 mb-3">Conditions générales d'utilisation</h1>
        <p className="text-gray-400 text-sm mb-12">Dernière mise à jour : 1er mars 2025</p>

        <div className="space-y-10 text-gray-600 leading-relaxed text-sm">

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">1. Objet</h2>
            <p>
              Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation du service DictaBill,
              accessible sur dictabill.com et via l'application mobile éponyme. En créant un compte, vous acceptez sans réserve les présentes CGU.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">2. Description du service</h2>
            <p>
              DictaBill est un logiciel de facturation en ligne permettant aux indépendants, auto-entrepreneurs et petites entreprises de créer,
              gérer et envoyer des factures, devis et avoirs. Le service propose une fonctionnalité de dictée vocale reposant sur l'intelligence artificielle.
            </p>
            <p className="mt-3">
              DictaBill est un outil d'aide à la facturation. L'utilisateur reste seul responsable de la conformité légale et fiscale
              de ses documents. DictaBill ne fournit pas de conseil juridique ou fiscal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">3. Comptes et accès</h2>
            <ul className="space-y-2 pl-4 list-disc">
              <li>L'inscription est ouverte à toute personne physique ou morale exerçant une activité professionnelle</li>
              <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
              <li>Un compte est strictement personnel et non cessible</li>
              <li>DictaBill se réserve le droit de suspendre tout compte en cas d'utilisation abusive</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">4. Plans et facturation</h2>
            <p className="mb-3">
              DictaBill propose un plan gratuit (5 documents/mois) et des plans payants (Solo, Pro) facturés mensuellement ou annuellement.
            </p>
            <ul className="space-y-2 pl-4 list-disc">
              <li>Les paiements sont traités par Stripe et non remboursables sauf disposition légale contraire</li>
              <li>L'abonnement se renouvelle automatiquement. Vous pouvez résilier depuis vos paramètres à tout moment</li>
              <li>En cas de résiliation, l'accès aux fonctionnalités payantes cesse à la fin de la période en cours</li>
              <li>DictaBill se réserve le droit de modifier ses tarifs avec préavis de 30 jours</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">5. Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments composant DictaBill (code, design, marque, logo) sont la propriété exclusive de DictaBill SAS
              et protégés par les lois françaises et internationales sur la propriété intellectuelle. Toute reproduction ou utilisation
              non autorisée est interdite.
            </p>
            <p className="mt-3">
              Vos données (factures, clients, données d'entreprise) restent votre propriété exclusive. DictaBill ne revendique aucun droit sur vos contenus.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">6. Responsabilité</h2>
            <p>
              DictaBill s'engage à fournir le service avec soin mais ne peut garantir une disponibilité ininterrompue.
              La responsabilité de DictaBill est limitée au montant payé au cours des 12 derniers mois.
            </p>
            <p className="mt-3">
              DictaBill n'est pas responsable des erreurs dans les documents créés par l'utilisateur,
              ni de la non-conformité fiscale ou légale de ces documents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">7. Loi applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence exclusive des tribunaux de Paris,
              sauf disposition impérative contraire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">8. Contact</h2>
            <p>
              Pour toute question : <a href="mailto:support@dictabill.com" className="text-primary-600 hover:underline">support@dictabill.com</a>
            </p>
          </section>

        </div>
      </div>

      <footer className="border-t border-gray-100 py-8 text-center">
        <p className="text-xs text-gray-400">
          © 2025 DictaBill ·{' '}
          <Link href="/terms" className="hover:text-gray-600">Conditions générales</Link>
          {' · '}
          <Link href="/privacy" className="hover:text-gray-600">Confidentialité</Link>
        </p>
      </footer>
    </div>
  );
}
