import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de confidentialité – DictaBill',
  description: 'Comment DictaBill collecte, utilise et protège vos données personnelles.',
  alternates: { canonical: 'https://dictabill.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-black">
          <span className="text-primary-500">Dicta</span><span className="text-gray-900">Bill</span>
        </Link>
        <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900">Se connecter</Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-black text-gray-900 mb-3">Politique de confidentialité</h1>
        <p className="text-gray-400 text-sm mb-12">Dernière mise à jour : 1er mars 2025</p>

        <div className="space-y-10 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">1. Qui sommes-nous ?</h2>
            <p>
              DictaBill est un service de facturation en ligne édité par DictaBill SAS, entreprise française.
              Nous sommes responsable du traitement de vos données personnelles au sens du Règlement Général sur la Protection des Données (RGPD).
            </p>
            <p className="mt-3">
              Pour toute question relative à cette politique, vous pouvez nous contacter à : <a href="mailto:privacy@dictabill.com" className="text-primary-600 hover:underline">privacy@dictabill.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">2. Données collectées</h2>
            <p className="mb-3">Nous collectons les données suivantes :</p>
            <ul className="space-y-2 pl-4 list-disc text-sm">
              <li><strong>Données de compte :</strong> adresse email, nom de société, SIRET, adresse postale — nécessaires pour créer et gérer votre compte</li>
              <li><strong>Données de facturation :</strong> informations sur vos clients, montants, descriptions de prestations — stockées pour générer vos documents</li>
              <li><strong>Données vocales :</strong> les enregistrements audio sont envoyés à l'API Groq pour transcription et immédiatement supprimés. Nous ne conservons que la transcription textuelle et les données extraites.</li>
              <li><strong>Données de paiement :</strong> gérées intégralement par Stripe. DictaBill ne stocke aucun numéro de carte bancaire.</li>
              <li><strong>Données de navigation :</strong> adresse IP, navigateur, pages visitées — à des fins analytiques via des outils conformes RGPD.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">3. Base légale du traitement</h2>
            <ul className="space-y-2 pl-4 list-disc text-sm">
              <li><strong>Exécution du contrat :</strong> traitement des données nécessaires à la fourniture du service</li>
              <li><strong>Obligation légale :</strong> conservation des factures conformément aux obligations comptables et fiscales françaises</li>
              <li><strong>Intérêt légitime :</strong> amélioration du service, sécurité, détection de fraude</li>
              <li><strong>Consentement :</strong> envoi de communications marketing (révocable à tout moment)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">4. Partage des données</h2>
            <p className="mb-3">Vos données ne sont jamais vendues. Elles peuvent être partagées avec :</p>
            <ul className="space-y-2 pl-4 list-disc text-sm">
              <li><strong>Supabase</strong> (hébergement base de données, Allemagne) — pour le stockage sécurisé de vos données</li>
              <li><strong>Groq</strong> (États-Unis) — uniquement pour la transcription vocale, données non conservées</li>
              <li><strong>Stripe</strong> (États-Unis) — pour le traitement des paiements, encadré par des clauses contractuelles types</li>
              <li><strong>Resend</strong> — pour l'envoi des emails de facturation</li>
            </ul>
            <p className="mt-3 text-sm">
              Ces sous-traitants sont liés par des accords de traitement des données conformes au RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">5. Durée de conservation</h2>
            <ul className="space-y-2 pl-4 list-disc text-sm">
              <li>Données de compte : durée de l'abonnement + 3 ans après clôture du compte</li>
              <li>Factures et documents : 10 ans (obligation comptable légale française)</li>
              <li>Données de navigation : 13 mois maximum</li>
              <li>Transcriptions vocales : durée de l'abonnement actif</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">6. Vos droits</h2>
            <p className="mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="space-y-2 pl-4 list-disc text-sm">
              <li><strong>Accès</strong> : obtenir une copie de vos données</li>
              <li><strong>Rectification</strong> : corriger des données inexactes</li>
              <li><strong>Effacement</strong> : demander la suppression (sous réserve des obligations légales)</li>
              <li><strong>Portabilité</strong> : recevoir vos données dans un format structuré</li>
              <li><strong>Opposition</strong> : vous opposer à certains traitements</li>
              <li><strong>Limitation</strong> : demander la limitation du traitement</li>
            </ul>
            <p className="mt-3 text-sm">
              Pour exercer ces droits, contactez : <a href="mailto:privacy@dictabill.com" className="text-primary-600 hover:underline">privacy@dictabill.com</a>.
              Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">7. Sécurité</h2>
            <p className="text-sm">
              Toutes les communications sont chiffrées via TLS/HTTPS. Les données au repos sont chiffrées par Supabase. Nous appliquons le principe du moindre privilège pour les accès aux données.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">8. Cookies</h2>
            <p className="text-sm">
              DictaBill utilise uniquement des cookies fonctionnels essentiels au fonctionnement du service (authentification, préférences de langue). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.
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
