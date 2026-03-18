'use client';
import { useT } from '@/hooks/useTranslation';
import { Mic2, Cpu, Send } from 'lucide-react';

const STEP_ICONS = [Mic2, Cpu, Send];

export default function HowItWorks() {
  const { t } = useT();
  const steps = t('howItWorks.steps', { returnObjects: true }) as Array<{ num: string; title: string; desc: string }>;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-badge">{t('howItWorks.badge')}</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">{t('howItWorks.title')}</h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

          {steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <div key={i} className="relative flex flex-col items-center text-center">
                {/* Icon circle */}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary-500 shadow-lg shadow-primary-200 flex items-center justify-center mb-6">
                  <Icon size={28} color="white" strokeWidth={1.75} />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-xs font-black rounded-full flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
