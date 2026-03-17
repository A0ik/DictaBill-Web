'use client';
import { useT } from '@/hooks/useTranslation';

export default function Testimonials() {
  const { t } = useT();
  const items = t('testimonials.items', { returnObjects: true }) as Array<{ name: string; role: string; text: string; avatar: string }>;

  return (
    <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-primary-200 text-sm font-semibold mb-2">{t('testimonials.badge')}</p>
          <h2 className="text-4xl font-black text-white">{t('testimonials.title')}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                  {item.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.name}</p>
                  <p className="text-primary-200 text-xs">{item.role}</p>
                </div>
                <div className="ml-auto text-amber-300 text-sm">★★★★★</div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">"{item.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
