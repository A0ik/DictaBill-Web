'use client';
import { useT } from '@/hooks/useTranslation';

export default function HowItWorks() {
  const { t } = useT();
  const steps = t('howItWorks.steps', { returnObjects: true }) as Array<{ num: string; title: string; desc: string }>;

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-primary-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-badge">{t('howItWorks.badge')}</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">{t('howItWorks.title')}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border-4 border-primary-200 shadow-lg mb-6">
                <span className="text-3xl font-black text-primary-500">{step.num}</span>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-[calc(50%+2rem)] top-1/2 -translate-y-1/2 text-primary-300 text-2xl">→</div>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
