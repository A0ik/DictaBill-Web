"use client";
import { motion } from "framer-motion";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";

const testimonials = [
  {
    text: "Je facturais en fin de journée, souvent le soir tard. Maintenant je le fais dans le taxi en rentrant du client. J'oublie plus jamais de facturer.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Camille R.",
    role: "Consultante SEO, Paris",
  },
  {
    text: "J'ai testé par curiosité. Première facture : 28 secondes chrono. C'est la seule façon que j'utilise maintenant.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Mehdi L.",
    role: "Développeur freelance, Lyon",
  },
  {
    text: "Mes devis partent le jour même. Avant j'attendais d'avoir du temps pour bien faire — du coup je les envoyais jamais.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Lucie V.",
    role: "Designer UX, remote",
  },
  {
    text: "Le gain de temps est réel. En deux phrases je crée une facture conforme avec TVA, numéro et tout. Mon comptable est bluffé.",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Thomas B.",
    role: "Photographe indépendant",
  },
  {
    text: "J'avais peur que ce soit un gadget. Après 3 mois, c'est le premier outil que j'ouvre le matin.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Inès K.",
    role: "Traductrice freelance",
  },
  {
    text: "Parfait pour les missions courtes. Je facture depuis mon téléphone juste après le call client. Fini les oublis.",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
    name: "Raphaël M.",
    role: "Coach professionnel",
  },
  {
    text: "La dictée vocale comprend même mon accent. Les factures sortent bien formatées, conformes à la loi française.",
    image: "https://randomuser.me/api/portraits/women/90.jpg",
    name: "Amina C.",
    role: "Consultante RH",
  },
  {
    text: "J'ai réduit le temps passé sur ma compta de moitié. Ce n'est pas grand chose mais en freelance, chaque heure compte.",
    image: "https://randomuser.me/api/portraits/men/14.jpg",
    name: "Pierre D.",
    role: "Copywriter B2B",
  },
  {
    text: "Interface claire, zéro fioriture. Exactement ce dont j'avais besoin — pas un Excel déguisé.",
    image: "https://randomuser.me/api/portraits/women/36.jpg",
    name: "Sarah T.",
    role: "Motion designer",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function Testimonials() {
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
            1 247 freelances utilisent DictaBill chaque semaine.
          </p>
        </motion.div>

        <div className="flex justify-start gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[640px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={22} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={16} />
        </div>
      </div>
    </section>
  );
}
