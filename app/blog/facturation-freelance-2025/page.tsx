import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowLeft, Mic } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Comment facturer en 2025 quand on est freelance – DictaBill',
  description: 'Guide complet : mentions obligatoires, TVA, délais de paiement, relances, outils de facturation. Tout ce qu\'un freelance doit savoir pour facturer correctement en 2025.',
  openGraph: {
    title: 'Comment facturer en 2025 quand on est freelance',
    description: 'Mentions légales, TVA, délais, relances — le guide complet de la facturation freelance 2025.',
  },
  alternates: { canonical: 'https://dictabill.com/blog/facturation-freelance-2025' },
};

export default function ArticleFacturation2025() {
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
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/blog" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors w-fit">
            <ArrowLeft size={14} /> Blog
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">Facturation</span>
            <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} /> 6 min de lecture</span>
            <span className="text-xs text-gray-400">15 mars 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
            Comment facturer en 2025 quand on est freelance
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            La facturation est une obligation légale pour tout freelance. Pourtant, beaucoup passent trop de temps dessus ou font des erreurs qui peuvent coûter cher. Voici le guide complet pour facturer correctement et rapidement en 2025.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">1. Les mentions obligatoires sur une facture</h2>
            <p className="text-gray-600 leading-relaxed">
              En France, une facture professionnelle doit obligatoirement contenir un certain nombre de mentions. Oubliez l'une d'elles et vous risquez un redressement fiscal ou des difficultés à vous faire payer.
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 my-4 border border-gray-100">
              <p className="text-sm font-bold text-gray-800 mb-3">Mentions obligatoires :</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  'Date d\'émission de la facture',
                  'Numéro de facture unique et chronologique',
                  'Vos coordonnées complètes (nom, adresse, SIRET)',
                  'Coordonnées complètes du client',
                  'Date de la prestation ou livraison',
                  'Description détaillée des produits ou services',
                  'Prix unitaire HT, quantité, taux de TVA, total TTC',
                  'Conditions de paiement (délai, mode)',
                  'Pénalités de retard et indemnité forfaitaire de 40€',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-primary-500 shrink-0 mt-0.5">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-gray-600">
              <strong>Pour les auto-entrepreneurs et micro-entreprises en franchise de TVA</strong>, il faut également ajouter la mention : <em>"TVA non applicable, article 293 B du CGI"</em>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">2. TVA : êtes-vous concerné ?</h2>
            <p className="text-gray-600 leading-relaxed">
              En 2025, les seuils de franchise en base de TVA pour les prestations de services sont fixés à <strong>36 800€ de chiffre d'affaires annuel</strong>. En dessous de ce seuil, vous n'êtes pas assujetti à la TVA et n'avez pas à la facturer.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Au-delà, vous devez facturer la TVA (généralement 20% pour les services intellectuels) et la reverser à l'administration fiscale. Deux régimes existent : la déclaration mensuelle ou trimestrielle selon votre CA.
            </p>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-sm text-amber-800">
              <strong>Attention :</strong> si vous dépassez le seuil en cours d'année, vous devenez assujetti à la TVA dès le 1er jour du mois de dépassement. Mettez à jour vos factures immédiatement.
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">3. Les délais de paiement légaux</h2>
            <p className="text-gray-600 leading-relaxed">
              La loi LME (Loi de Modernisation de l'Économie) encadre strictement les délais de paiement entre professionnels :
            </p>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex gap-2"><span className="font-bold text-gray-800">30 jours</span> — délai légal par défaut si rien n'est mentionné</li>
              <li className="flex gap-2"><span className="font-bold text-gray-800">60 jours</span> — délai maximum autorisé par accord contractuel</li>
              <li className="flex gap-2"><span className="font-bold text-gray-800">45 jours fin de mois</span> — délai maximum pour certains secteurs</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              En cas de retard, vous pouvez appliquer des pénalités de retard (taux légal minimum : 3 fois le taux d'intérêt légal) et une indemnité forfaitaire de recouvrement de 40€.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">4. Numérotation des factures</h2>
            <p className="text-gray-600 leading-relaxed">
              La numérotation doit être <strong>chronologique, continue et sans rupture</strong>. Vous ne pouvez pas supprimer une facture émise — si vous faites une erreur, vous devez émettre un avoir.
            </p>
            <p className="text-gray-600">
              Format recommandé : <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">FACT-2025-001</code>, <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">FACT-2025-002</code>, etc. La numérotation peut recommencer chaque année.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">5. Comment gérer les impayés ?</h2>
            <p className="text-gray-600 leading-relaxed">
              Les impayés sont la hantise des freelances. Voici la procédure à suivre :
            </p>
            <ol className="space-y-3 text-sm text-gray-600 list-decimal pl-4">
              <li><strong>J+30 :</strong> Relance par email, ton amical. "Juste un rappel, la facture XXX est due."</li>
              <li><strong>J+45 :</strong> Deuxième relance, ton plus ferme. Mentionnez les pénalités applicables.</li>
              <li><strong>J+60 :</strong> Mise en demeure par LRAR. Dernier délai de 8 jours avant action.</li>
              <li><strong>J+75 :</strong> Injonction de payer (procédure simple, gratuite, en ligne sur service-public.fr).</li>
            </ol>
            <p className="text-gray-600 mt-3">DictaBill Solo et Pro incluent des <strong>relances automatiques par email</strong> pour vous éviter ce travail manuel.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">6. Quel outil de facturation choisir en 2025 ?</h2>
            <p className="text-gray-600 leading-relaxed">
              Le bon outil de facturation doit être rapide, conforme, et s'adapter à votre façon de travailler. Pour les freelances qui enchaînent les missions, la vitesse de création est primordiale.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>DictaBill</strong> est pensé exactement pour ça : vous dictez votre facture en une phrase ("Facture pour Acme, développement, 2 000€ HT, 30 jours"), et le document est généré en moins de 30 secondes. C'est la différence entre 30 secondes et 15 minutes.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-primary-50 rounded-3xl p-8 text-center border border-primary-100">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mic size={22} color="white" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Essaie DictaBill gratuitement</h3>
          <p className="text-gray-500 text-sm mb-5">5 factures/mois gratuites. Sans carte bancaire. Créez votre première facture en 30 secondes.</p>
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
