'use client';
import { motion } from 'framer-motion';

export default function TrustBar() {
  return (
    <div className="bg-white py-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-400"
        >
          Données hébergées en Europe · RGPD · Factures conformes loi française · SSL/TLS · Résiliation en 1 clic
        </motion.p>
      </div>
    </div>
  );
}
