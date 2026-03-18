'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1400;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * to));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(to);
    };
    requestAnimationFrame(step);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {value.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function StatsSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: big featured stat */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-6">
              DictaBill en chiffres
            </p>
            <p className="text-6xl font-black text-[#0D0D0D] leading-none mb-3">
              <CountUp to={14800} />
            </p>
            <p className="text-gray-500 text-base">factures créées par nos freelances</p>
          </motion.div>

          {/* Right: 3 smaller stats */}
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
              { value: '28 sec', label: 'temps moyen de création' },
              { value: '4,8/5', label: 'note moyenne utilisateurs' },
              { value: '94 %', label: 'taux de conformité légale' },
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
