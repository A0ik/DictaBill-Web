'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQ = [
  {
    q: "Est-ce vraiment possible de créer une facture en moins d'une minute ?",
    a: "Oui — si vous connaissez le nom de votre client et le montant. Vous dictez une phrase comme « Facture Acme 1 200€ dev web 30 jours », DictaBill génère le PDF avec TVA, numérotation séquentielle et toutes les mentions légales. Vous pouvez l'envoyer directement depuis l'application.",
  },
  {
    q: "Qu'est-ce que Factur-X et pourquoi c'est important pour 2026 ?",
    a: "Factur-X est le standard de facturation électronique B2B qui deviendra obligatoire en France à partir de septembre 2026 (réforme loi de finances). Un PDF Factur-X intègre un fichier XML structuré (norme EN 16931) directement dans le PDF — lisible à la fois par les humains et les logiciels comptables ou plateformes EDI. DictaBill Pro génère ces PDF conformes automatiquement.",
  },
  {
    q: "Mes factures sont-elles légalement conformes ?",
    a: "DictaBill génère des factures avec toutes les mentions obligatoires requises par la législation française : numéro séquentiel, date d'émission, coordonnées complètes du vendeur et du client, description des prestations, prix HT, taux de TVA, total TTC et date d'échéance. La numérotation est continue et non modifiable.",
  },
  {
    q: "Que se passe-t-il quand j'atteins la limite de 5 factures en plan Gratuit ?",
    a: "Vous ne pouvez plus créer de nouvelles factures jusqu'au début du mois suivant, ou jusqu'à la mise à niveau vers Solo. Vos factures existantes restent accessibles, consultables et téléchargeables à tout moment.",
  },
  {
    q: "Est-ce que ça fonctionne sur mobile ?",
    a: "Oui — DictaBill est disponible en application mobile (iOS et Android) et en version web. Votre compte, vos clients et vos factures sont synchronisés entre tous vos appareils via votre espace Supabase.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Toutes les données sont chiffrées en transit (HTTPS/TLS) et au repos. L'infrastructure est hébergée en Europe (Supabase), conforme au RGPD. DictaBill ne vend aucune donnée à des tiers. Vous pouvez supprimer votre compte et toutes vos données à tout moment.",
  },
  {
    q: "Puis-je annuler mon abonnement à tout moment ?",
    a: "Oui, sans engagement minimum. Vous annulez en un clic depuis vos paramètres. Votre accès aux fonctionnalités payantes reste actif jusqu'à la fin de la période déjà facturée, puis bascule automatiquement vers le plan Gratuit.",
  },
];

function Item({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.06 }}
      className="border border-gray-100 rounded-2xl overflow-hidden"
    >
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors gap-4"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-gray-900 leading-snug">{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={16} className="text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection() {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#0D0D0D] tracking-[-0.02em] leading-tight mb-3">
            Questions fréquentes.
          </h2>
          <p className="text-gray-500 text-base">
            Tout ce que vous voulez savoir avant de vous lancer.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <Item key={i} q={item.q} a={item.a} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
