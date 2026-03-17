'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Clock, AlertCircle, Mic, PenLine, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';
import { useT } from '@/hooks/useTranslation';
import { formatCurrency } from '@/lib/utils';
import InvoiceCard from '@/components/app/InvoiceCard';
import MonthlyChart from '@/components/app/MonthlyChart';
import AppHeader from '@/components/app/AppHeader';
import Button from '@/components/ui/Button';

function getGreeting(t: any) {
  const hour = new Date().getHours();
  if (hour < 12) return t('dashboard.greeting_morning');
  if (hour < 18) return t('dashboard.greeting_afternoon');
  return t('dashboard.greeting_evening');
}

export default function DashboardPage() {
  const { t, lang } = useT();
  const { profile } = useAuthStore();
  const { invoices, stats, fetchInvoices, fetchClients, computeStats } = useDataStore();

  useEffect(() => {
    fetchInvoices();
    fetchClients();
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
      color: 'text-primary-600',
      bg: 'bg-primary-50',
      sub: null,
    },
    {
      label: t('dashboard.pending'),
      value: formatCurrency(stats?.pendingRevenue ?? 0, locale),
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      sub: stats?.pendingCount ? `${stats.pendingCount} doc.` : null,
    },
    {
      label: t('dashboard.overdue'),
      value: formatCurrency(stats?.overdueRevenue ?? 0, locale),
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      sub: stats?.overdueCount ? `${stats.overdueCount} doc.` : null,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title={`${getGreeting(t)}${profile?.company_name ? `, ${profile.company_name}` : ''} 👋`} />

      <div className="flex-1 p-4 md:p-6 space-y-6 max-w-6xl mx-auto w-full">
        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/invoices/new?mode=voice">
            <Button size="lg" className="gap-2">
              <Mic size={18} />
              {t('dashboard.newVoice')}
            </Button>
          </Link>
          <Link href="/invoices/new?mode=manual">
            <Button variant="outline" size="lg" className="gap-2">
              <PenLine size={18} />
              {t('dashboard.newManual')}
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, bg, sub }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={18} className={color} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
            </div>
          ))}
        </div>

        {/* Chart */}
        <MonthlyChart invoices={invoices} />

        {/* Recent documents */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">{t('dashboard.recentDocs')}</h2>
            <Link href="/invoices" className="flex items-center gap-1 text-sm text-primary-600 font-semibold hover:underline">
              {t('dashboard.seeAll')} <ArrowRight size={14} />
            </Link>
          </div>

          {recentDocs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 font-medium">{t('dashboard.empty')}</p>
              <p className="text-sm text-gray-400 mt-1">{t('dashboard.emptyText')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentDocs.map((inv) => (
                <InvoiceCard key={inv.id} invoice={inv} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
