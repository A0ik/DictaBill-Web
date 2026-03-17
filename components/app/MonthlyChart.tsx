'use client';
import { useMemo } from 'react';
import type { Invoice } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useT } from '@/hooks/useTranslation';

interface MonthlyChartProps {
  invoices: Invoice[];
}

function getLast6Months(): { key: string; label: string }[] {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('fr-FR', { month: 'short' });
    months.push({ key, label });
  }
  return months;
}

export default function MonthlyChart({ invoices }: MonthlyChartProps) {
  const { t, lang } = useT();

  const months = useMemo(() => getLast6Months(), []);

  const data = useMemo(() => {
    return months.map(({ key, label }) => {
      const total = invoices
        .filter(
          (inv) =>
            (inv.document_type === 'invoice' || !inv.document_type) &&
            inv.status === 'paid' &&
            (inv.paid_at || inv.issue_date || '').startsWith(key)
        )
        .reduce((sum, inv) => sum + inv.total, 0);
      return { key, label, total };
    });
  }, [invoices, months]);

  const maxVal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">{t('dashboard.chart')}</h2>
      <div className="flex items-end justify-between gap-3 h-40">
        {data.map(({ key, label, total }) => {
          const heightPct = Math.max((total / maxVal) * 100, total > 0 ? 4 : 0);
          return (
            <div key={key} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center justify-end h-32 group relative">
                {/* Tooltip */}
                {total > 0 && (
                  <div className="absolute bottom-full mb-1 hidden group-hover:flex whitespace-nowrap bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded-lg z-10">
                    {formatCurrency(total, lang === 'en' ? 'en-US' : 'fr-FR')}
                  </div>
                )}
                <div
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: total > 0 ? '#1D9E75' : '#E5E7EB',
                    minHeight: total > 0 ? '4px' : '2px',
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-400 capitalize">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Y-axis hint */}
      <div className="flex justify-between mt-4 pt-4 border-t border-gray-50">
        <span className="text-xs text-gray-400">{formatCurrency(0, lang === 'en' ? 'en-US' : 'fr-FR')}</span>
        <span className="text-xs text-gray-400">{formatCurrency(maxVal, lang === 'en' ? 'en-US' : 'fr-FR')}</span>
      </div>
    </div>
  );
}
