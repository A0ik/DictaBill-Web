"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "Je facturais en fin de journée, souvent le soir tard. Maintenant je le fais dans le taxi en rentrant du client. J'oublie plus jamais de facturer.",
    initials: "CR",
    name: "Camille R.",
    role: "Consultante SEO",
  },
  {
    text: "J'ai testé par curiosité. Première facture : 28 secondes chrono. C'est la seule façon que j'utilise maintenant.",
    initials: "ML",
    name: "Mehdi L.",
    role: "Développeur freelance",
  },
  {
    text: "Mes devis partent le jour même. Avant j'attendais d'avoir du temps pour bien faire — du coup je les envoyais jamais.",
    initials: "LV",
    name: "Lucie V.",
    role: "Designer UX",
  },
  {
    text: "Le gain de temps est réel. En deux phrases je crée une facture conforme avec TVA, numéro et tout. Mon comptable est bluffé.",
    initials: "TB",
    name: "Thomas B.",
    role: "Photographe indépendant",
  },
  {
    text: "J'avais peur que ce soit un gadget. Après 3 mois, c'est le premier outil que j'ouvre le matin.",
    initials: "IK",
    name: "Inès K.",
    role: "Traductrice freelance",
  },
  {
    text: "Parfait pour les missions courtes. Je facture depuis mon téléphone juste après le call client. Fini les oublis.",
    initials: "RM",
    name: "Raphaël M.",
    role: "Coach professionnel",
  },
  {
    text: "La dictée vocale comprend même mon accent. Les factures sortent bien formatées, conformes à la loi française.",
    initials: "AC",
    name: "Amina C.",
    role: "Consultante RH",
  },
  {
    text: "J'ai réduit le temps passé sur ma compta de moitié. Ce n'est pas grand chose mais en freelance, chaque heure compte.",
    initials: "PD",
    name: "Pierre D.",
    role: "Copywriter B2B",
  },
  {
    text: "Interface claire, zéro fioriture. Exactement ce dont j'avais besoin — pas un Excel déguisé.",
    initials: "ST",
    name: "Sarah T.",
    role: "Motion designer",
  },
];

const COLORS = [
  "bg-[#1D9E75]",
  "bg-blue-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-amber-500",
  "bg-rose-500",
];

function Avatar({ initials, colorClass }: { initials: string; colorClass: string }) {
  return (
    <div className={`w-9 h-9 rounded-full ${colorClass} flex items-center justify-center shrink-0`}>
      <span className="text-white text-xs font-bold">{initials}</span>
    </div>
  );
}

function TestimonialCard({ t, i }: { t: (typeof testimonials)[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <p className="text-sm text-gray-700 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <Avatar initials={t.initials} colorClass={COLORS[i % COLORS.length]} />
        <div>
          <p className="text-sm font-bold text-gray-900">{t.name}</p>
          <p className="text-xs text-gray-400">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const col1 = testimonials.filter((_, i) => i % 3 === 0);
  const col2 = testimonials.filter((_, i) => i % 3 === 1);
  const col3 = testimonials.filter((_, i) => i % 3 === 2);

  return (
    <section className="py-28 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-14 max-w-sm"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#0D0D0D] tracking-[-0.02em] leading-tight">
            Ce qu&apos;ils en disent.
          </h2>
          <p className="text-gray-500 mt-3 text-base leading-relaxed">
            Des freelances qui ont arrêté de procrastiner leurs factures.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-4">
            {col1.map((t, i) => <TestimonialCard key={i} t={t} i={i * 3} />)}
          </div>
          <div className="space-y-4 hidden md:block">
            {col2.map((t, i) => <TestimonialCard key={i} t={t} i={i * 3 + 1} />)}
          </div>
          <div className="space-y-4 hidden lg:block">
            {col3.map((t, i) => <TestimonialCard key={i} t={t} i={i * 3 + 2} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
