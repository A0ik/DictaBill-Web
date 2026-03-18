'use client';
import { Mic2, FileText, Send, BarChart3, RefreshCw } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55 } },
};

export default function Features() {
  return (
    <section id="features" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="mb-12 max-w-xl"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#0D0D0D] tracking-[-0.02em] leading-tight mb-4">
            Tout ce dont vous avez besoin.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            De la dictée à l'encaissement, sans friction.
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Card 1 — spans 2 cols, dark */}
          <motion.div variants={card} className="md:col-span-2 bg-[#0D0D0D] text-white rounded-3xl p-8 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center mb-6">
              <Mic2 size={20} className="text-primary-400" />
            </div>
            <h3 className="text-xl font-black mb-3 tracking-tight">
              Dictez votre facture en une phrase
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Parlez naturellement. DictaBill transcrit votre voix avec Groq Whisper et extrait automatiquement
              le nom du client, le montant, la description et les conditions de paiement.
            </p>
            <div className="font-mono text-sm bg-white/10 rounded-lg px-4 py-3 text-gray-300 mt-auto">
              "Facture Acme Corp, dev web, 2 400€ HT, 30 jours"
            </div>
            <p className="text-primary-400 text-xs font-medium mt-4">
              Transcription Groq Whisper · LLaMA extraction
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={card} className="bg-gray-50 rounded-3xl p-7 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center mb-6">
              <FileText size={20} className="text-gray-700" />
            </div>
            <h3 className="text-lg font-black text-[#0D0D0D] mb-2 tracking-tight">
              PDF conforme en 1 clic
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Factures au format légal français avec toutes les mentions obligatoires, numérotation automatique et TVA.
            </p>
          </motion.div>

          {/* Card 3 — green */}
          <motion.div variants={card} className="bg-primary-500 text-white rounded-3xl p-7 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-6">
              <Send size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-black mb-2 tracking-tight">
              Envoi email instantané
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Envoyez directement depuis l'application. Votre client reçoit un email professionnel avec la facture en pièce jointe.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div variants={card} className="bg-gray-50 rounded-3xl p-7 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center mb-6">
              <BarChart3 size={20} className="text-gray-700" />
            </div>
            <h3 className="text-lg font-black text-[#0D0D0D] mb-2 tracking-tight">
              Tableau de bord
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Visualisez votre chiffre d'affaires, les factures en attente et les retards en un coup d'œil.
            </p>
          </motion.div>

          {/* Card 5 */}
          <motion.div variants={card} className="bg-gray-50 rounded-3xl p-7 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center mb-6">
              <RefreshCw size={20} className="text-gray-700" />
            </div>
            <h3 className="text-lg font-black text-[#0D0D0D] mb-2 tracking-tight">
              Relances auto
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Les relances partent automatiquement avant et après la date d'échéance. Vous n'avez plus à y penser.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
