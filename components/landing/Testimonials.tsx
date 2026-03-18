'use client';
import { useT } from '@/hooks/useTranslation';
import { Star } from 'lucide-react';

const AVATAR_COLORS = [
  'bg-primary-500',
  'bg-blue-500',
  'bg-amber-500',
];

export default function Testimonials() {
  const { t } = useT();
  const items = t('testimonials.items', { returnObjects: true }) as Array<{ name: string; role: string; text: string; avatar: string }>;

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-badge">{t('testimonials.badge')}</span>
          <h2 className="mt-4 text-4xl font-black text-gray-900">{t('testimonials.title')}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                &ldquo;{item.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                <div className={`w-10 h-10 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-sm`}>
                  {item.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
