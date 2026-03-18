'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Clock, AlertCircle, Mic, PenLine, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';
import { useT } from '@/hooks/useTranslation';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, getDocumentLabel } from '@/lib/utils';
import MonthlyChart from '@/components/app/MonthlyChart';
import type { Invoice } from '@/types';

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;
}

function getGreeting(t: any) {
  const hour = new Date().getHours();
  if (hour < 12) return t('dashboard.greeting_morning');
  if (hour < 18) return t('dashboard.greeting_afternoon');
  return t('dashboard.greeting_evening');
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}

export default function DashboardPage() {
  const { t, lang } = useT();
  const { profile } = useAuthStore();
  const { invoices, stats, fetchInvoices, fetchClients, computeStats } = useDataStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchInvoices(), fetchClients()]).finally(() => setLoading(false));
  }, [fetchInvoices, fetchClients]);

  useEffect(() => {
    computeStats();
  }, [invoices, computeStats]);

  const recentDocs = invoices.slice(0, 5);
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';

  const statCards = [
    {
      label: t('dashboard.revenue'),
      value: formatCurrency(stats?.mrr ?? 0, locale),
      icon: TrendingUp,
      iconColor: 'text-primary-600',
    },
    {
      label: t('dashboard.pending'),
      value: formatCurrency(stats?.pendingRevenue ?? 0, locale),
      icon: Clock,
      iconColor: 'text-blue-600',
      sub: stats?.pendingCount ? `${stats.pendingCount} doc.` : null,
    },
    {
      label: t('dashboard.overdue'),
      value: formatCurrency(stats?.overdueRevenue ?? 0, locale),
      icon: AlertCircle,
      iconColor: 'text-red-500',
      sub: stats?.overdueCount ? `${stats.overdueCount} doc.` : null,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* Inline page header */}
      <div className="px-6 pt-8 pb-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">
              {getGreeting(t)}{profile?.company_name ? `, ${profile.company_name}` : ''}
            </p>
            <h1 className="text-2xl font-black text-[#0D0D0D] tracking-tight">Tableau de bord</h1>
          </div>
          {/* Quick action links */}
          <div className="flex items-center gap-5">
            <Link
              href="/invoices/new?mode=voice"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#0D0D0D] transition-colors"
            >
              <Mic size={15} className="text-primary-500" />
              {t('dashboard.newVoice')}
            </Link>
            <Link
              href="/invoices/new?mode=manual"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#0D0D0D] transition-colors"
            >
              <PenLine size={15} />
              {t('dashboard.newManual')}
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6 max-w-6xl mx-auto w-full">
        {/* Stats — horizontal flex with dividers */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex divide-x divide-gray-100">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex-1 p-6">
                    <Skeleton className="h-3 w-24 mb-4" />
                    <Skeleton className="h-8 w-28" />
                  </div>
                ))
              : statCards.map(({ label, value, icon: Icon, iconColor, sub }) => (
                  <div key={label} className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                      <Icon size={15} className={iconColor} />
                    </div>
                    <p className="text-3xl font-black text-[#0D0D0D]">{value}</p>
                    {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
                  </div>
                ))
            }
          </div>
        </div>

        {/* Chart */}
        <MonthlyChart invoices={invoices} />

        {/* Recent invoices */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-[#0D0D0D]">{t('dashboard.recentDocs')}</h2>
            <Link
              href="/invoices"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors font-medium"
            >
              {t('dashboard.seeAll')}
              <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="px-6 py-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="space-y-1.5">
                    <Skeleton className="h-2.5 w-20" />
                    <Skeleton className="h-3.5 w-32" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3.5 w-16" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentDocs.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Mic size={18} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">{t('dashboard.empty')}</p>
              <p className="text-xs text-gray-400 mb-5">{t('dashboard.emptyText')}</p>
              <Link
                href="/invoices/new?mode=voice"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Mic size={13} />
                Créer ma première facture
              </Link>
            </div>
          ) : (
            <div className="px-6">
              {recentDocs.map((inv: Invoice) => {
                const clientName = inv.client?.name || inv.client_name_override || '—';
                return (
                  <Link
                    key={inv.id}
                    href={`/invoices/${inv.id}`}
                    className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 -mx-6 px-6 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] text-gray-400 font-medium uppercase">
                          {getDocumentLabel(inv.document_type, lang)}
                        </span>
                        <span className="text-gray-200 text-xs">·</span>
                        <span className="text-[11px] text-gray-400">{inv.number}</span>
                      </div>
                      <p className="text-sm font-semibold text-[#0D0D0D]">{clientName}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-bold text-[#0D0D0D]">
                        {formatCurrency(inv.total, locale)}
                      </span>
                      <StatusBadge status={inv.status} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
