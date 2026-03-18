'use client';
import { motion, type Variants } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    title: 'Dictez en une phrase',
    desc: "Dites simplement : \"Facture pour Acme, développement web, 2 400€ HT, délai 30 jours\". C'est tout.",
    example: '"Facture pour Acme, 2 400€ HT, 30 jours"',
  },
  {
    num: '02',
    title: "L'IA génère la facture",
    desc: 'Groq Whisper transcrit, LLaMA extrait les données. Votre facture est prête en quelques secondes, mise en page comprise.',
    example: null,
  },
  {
    num: '03',
    title: 'Envoyez ou téléchargez',
    desc: 'Un clic pour envoyer par email à votre client, ou téléchargez le PDF conforme pour votre comptable.',
    example: null,
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
};

const stepVariant: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HowItWorks() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="mb-16 max-w-xl"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#0D0D0D] tracking-[-0.02em] leading-tight mb-4">
            Simple par conception.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Trois étapes. Moins d'une minute. Vraiment.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid md:grid-cols-3 gap-12"
        >
          {STEPS.map((step) => (
            <motion.div key={step.num} variants={stepVariant} whileHover={{ y: -8, transition: { duration: 0.25 } }} className="flex flex-col cursor-default">
              <p
                className="text-[120px] font-black text-gray-100 leading-none mb-0 select-none"
                aria-hidden="true"
              >
                {step.num}
              </p>
              <div className="-mt-6">
                <h3 className="text-2xl font-black text-[#0D0D0D] mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{step.desc}</p>
                {step.example && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-sm text-gray-600">
                    {step.example}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
