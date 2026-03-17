'use client';
import { useT } from '@/hooks/useTranslation';

export default function Features() {
  const { t } = useT();
  const items = t('features.items', { returnObjects: true }) as Array<{ icon: string; title: string; desc: string }>;

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-badge">{t('features.badge')}</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">{t('features.title')}</h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">{t('features.subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-300 cursor-default">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
