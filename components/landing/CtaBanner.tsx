'use client';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CtaBanner() {
  return (
    <section className="bg-[#0D0D0D] py-28 overflow-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="max-w-3xl mx-auto px-4 sm:px-6 text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="text-5xl lg:text-6xl font-black text-white tracking-[-0.03em] leading-tight mb-6"
        >
          Votre prochaine facture en 30 secondes.
        </motion.h2>
        <motion.p variants={fadeUp} className="text-gray-400 text-lg mb-10">
          Rejoignez les freelances qui ont arrêté de perdre du temps sur la facturation.
        </motion.p>
        <motion.div variants={fadeUp}>
          <motion.div whileHover={{ scale: 1.04, transition: { duration: 0.2 } }} className="inline-block">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base"
          >
            Commencer gratuitement
          </Link>
          </motion.div>
          <p className="text-gray-600 text-xs mt-6">
            Sans carte bancaire · Résiliation en 1 clic
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
