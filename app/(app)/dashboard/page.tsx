'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mic, PenLine, ArrowRight, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';
import { useT } from '@/hooks/useTranslation';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, getDocumentLabel } from '@/lib/utils';
import MonthlyChart from '@/components/app/MonthlyChart';
import { useUIStore } from '@/stores/uiStore';
import { Menu } from 'lucide-react';
import type { Invoice } from '@/types';

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded ${className}`} />;
}

function getGreeting(t: any) {
  const hour = new Date().getHours();
  if (hour < 12) return t('dashboard.greeting_morning');
  if (hour < 18) return t('dashboard.greeting_afternoon');
  return t('dashboard.greeting_evening');
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    paid: 'bg-emerald-500',
    sent: 'bg-blue-500',
    draft: 'bg-gray-300',
    overdue: 'bg-red-500',
  };
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[status] ?? 'bg-gray-300'}`} />
      <span className="text-xs text-gray-500">{getStatusLabel(status)}</span>
    </span>
  );
}

export default function DashboardPage() {
  const { t, lang } = useT();
  const { profile } = useAuthStore();
  const { invoices, stats, fetchInvoices, fetchClients, computeStats } = useDataStore();
  const openSidebar = useUIStore((s) => s.openSidebar);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchInvoices(), fetchClients()]).finally(() => setLoading(false));
  }, [fetchInvoices, fetchClients]);

  useEffect(() => {
    computeStats();
  }, [invoices, computeStats]);

  const recentDocs = invoices.slice(0, 6);
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page header */}
      <div className="border-b border-gray-200 px-6 md:px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={openSidebar}
              className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                {getGreeting(t)}{profile?.company_name ? `, ${profile.company_name}` : ''}
              </p>
              <h1 className="text-xl font-black text-[#0D0D0D] tracking-tight leading-none">Tableau de bord</h1>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/invoices/new?mode=voice"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#0D0D0D] transition-colors"
            >
              <Mic size={13} className="text-primary-500" />
              {t('dashboard.newVoice')}
            </Link>
            <Link
              href="/invoices/new?mode=manual"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#0D0D0D] transition-colors"
            >
              <PenLine size={13} />
              {t('dashboard.newManual')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main KPI — asymmetric, editorial */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-8">
          {loading ? (
            <div className="flex items-end gap-16">
              <div>
                <Skeleton className="h-3 w-36 mb-3" />
                <Skeleton className="h-12 w-52" />
              </div>
              <div className="flex gap-10 pb-1">
                <div><Skeleton className="h-3 w-20 mb-2" /><Skeleton className="h-7 w-28" /></div>
                <div><Skeleton className="h-3 w-20 mb-2" /><Skeleton className="h-7 w-28" /></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-16">
              {/* Big number */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  {t('dashboard.revenue')}
                </p>
                <p className="text-5xl font-black text-[#0D0D0D] leading-none tracking-tight">
                  {formatCurrency(stats?.mrr ?? 0, locale)}
                </p>
              </div>
              {/* Secondary */}
              <div className="flex gap-10 sm:pb-0.5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    {t('dashboard.pending')}
                  </p>
                  <p className="text-2xl font-black text-[#0D0D0D] tracking-tight">
                    {formatCurrency(stats?.pendingRevenue ?? 0, locale)}
                  </p>
                  {stats?.pendingCount ? (
                    <p className="text-xs text-gray-400 mt-1">
                      {stats.pendingCount} document{stats.pendingCount > 1 ? 's' : ''}
                    </p>
                  ) : null}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    {t('dashboard.overdue')}
                  </p>
                  <p className="text-2xl font-black text-red-500 tracking-tight">
                    {formatCurrency(stats?.overdueRevenue ?? 0, locale)}
                  </p>
                  {stats?.overdueCount ? (
                    <p className="text-xs text-gray-400 mt-1">
                      {stats.overdueCount} document{stats.overdueCount > 1 ? 's' : ''}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-8 py-8 space-y-8">
        {/* Chart */}
        <MonthlyChart invoices={invoices} />

        {/* Recent invoices */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-[#0D0D0D] tracking-tight">{t('dashboard.recentDocs')}</h2>
            <Link
              href="/invoices"
              className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
            >
              {t('dashboard.seeAll')}
              <ArrowRight size={11} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-0 border border-gray-200 rounded-xl overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 last:border-0">
                  <div className="space-y-1.5">
                    <Skeleton className="h-2.5 w-16" />
                    <Skeleton className="h-3.5 w-36" />
                  </div>
                  <div className="flex items-center gap-6">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-2.5 w-14" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentDocs.length === 0 ? (
            <div className="border border-dashed border-gray-200 rounded-xl py-16 text-center">
              <Mic size={20} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-500 mb-1">{t('dashboard.empty')}</p>
              <p className="text-xs text-gray-400 mb-5 max-w-xs mx-auto">{t('dashboard.emptyText')}</p>
              <Link
                href="/invoices/new?mode=voice"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Mic size={13} />
                Créer ma première facture
              </Link>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-200">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Client</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 hidden sm:block">Date</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 text-right">Montant</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 text-right hidden sm:block">Statut</p>
              </div>
              {recentDocs.map((inv: Invoice) => {
                const clientName = inv.client?.name || inv.client_name_override || '—';
                return (
                  <Link
                    key={inv.id}
                    href={`/invoices/${inv.id}`}
                    className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                          {getDocumentLabel(inv.document_type, lang)}
                        </span>
                        <span className="text-gray-200 text-[10px]">·</span>
                        <span className="text-[10px] text-gray-400">{inv.number}</span>
                      </div>
                      <p className="text-sm font-semibold text-[#0D0D0D] truncate group-hover:text-primary-600 transition-colors">
                        {clientName}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 hidden sm:block">
                      {formatDate(inv.issue_date, locale)}
                    </p>
                    <p className="text-sm font-bold text-[#0D0D0D] text-right">
                      {formatCurrency(inv.total, locale)}
                    </p>
                    <div className="hidden sm:flex justify-end">
                      <StatusDot status={inv.status} />
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
