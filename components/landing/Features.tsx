'use client';
import { useT } from '@/hooks/useTranslation';
import { Mic2, FileText, Send, CreditCard, BarChart3, Globe, LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  'mic': Mic2,
  'file-text': FileText,
  'send': Send,
  'credit-card': CreditCard,
  'bar-chart': BarChart3,
  'globe': Globe,
};

const ICON_COLORS = [
  { bg: 'bg-primary-50', text: 'text-primary-600' },
  { bg: 'bg-blue-50', text: 'text-blue-600' },
  { bg: 'bg-violet-50', text: 'text-violet-600' },
  { bg: 'bg-amber-50', text: 'text-amber-600' },
  { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { bg: 'bg-rose-50', text: 'text-rose-600' },
];

export default function Features() {
  const { t } = useT();
  const items = t('features.items', { returnObjects: true }) as Array<{ icon: string; title: string; desc: string }>;

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-badge">{t('features.badge')}</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">{t('features.title')}</h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">{t('features.subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Mic2;
            const colors = ICON_COLORS[i % ICON_COLORS.length];
            return (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                <div className={`inline-flex w-11 h-11 rounded-xl items-center justify-center mb-5 ${colors.bg}`}>
                  <Icon size={20} className={colors.text} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
