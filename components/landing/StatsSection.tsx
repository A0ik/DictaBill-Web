'use client';
import { motion, type Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function StatsSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: big featured stat */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-6">
              DictaBill en bref
            </p>
            <p className="text-6xl font-black text-[#0D0D0D] leading-none mb-3">
              &lt;&nbsp;1&nbsp;min
            </p>
            <p className="text-gray-500 text-base">pour créer une facture complète, du premier mot au PDF</p>
          </motion.div>

          {/* Right: 3 product facts */}
          <motion.div
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="space-y-7"
          >
            {[
              { value: '3 types', label: 'facture, devis, avoir — dans la même app' },
              { value: 'Factur-X', label: 'e-facturation obligatoire dès 2026 (EN 16931)' },
              { value: 'FR + EN', label: 'interface et génération bilingue' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ x: 8, transition: { duration: 0.2 } }}
                className={`flex items-baseline gap-3 pb-7 cursor-default ${i < 2 ? 'border-b border-gray-200' : ''}`}
              >
                <span className="text-2xl font-black text-[#0D0D0D]">{stat.value}</span>
                <span className="text-gray-400 text-sm">/</span>
                <span className="text-gray-500 text-sm">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
