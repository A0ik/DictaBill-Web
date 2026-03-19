'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mic, PenLine, ArrowRight, ArrowUpRight, TrendingUp, Clock, AlertCircle, Menu, Plus, PartyPopper } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';
import { useT } from '@/hooks/useTranslation';
import { formatCurrency, formatDate, getStatusLabel, getDocumentLabel } from '@/lib/utils';
import MonthlyChart from '@/components/app/MonthlyChart';
import { useUIStore } from '@/stores/uiStore';
import { motion } from 'framer-motion';
import type { Invoice } from '@/types';

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;
}

const STATUS_CONFIG: Record<string, { dot: string; label: string }> = {
  paid:    { dot: 'bg-emerald-500', label: 'Payée' },
  sent:    { dot: 'bg-blue-500',    label: 'Envoyée' },
  draft:   { dot: 'bg-gray-300',    label: 'Brouillon' },
  overdue: { dot: 'bg-red-500',     label: 'En retard' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { dot: 'bg-gray-300', label: status };
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      <span className="text-xs text-gray-500">{cfg.label}</span>
    </span>
  );
}

function StatCard({
  label, value, sub, highlight, i,
}: {
  label: string; value: string; sub?: string; highlight?: boolean; i: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08, duration: 0.4 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`rounded-2xl border p-5 flex flex-col gap-1 cursor-default transition-shadow hover:shadow-md ${
        highlight ? 'bg-[#1D9E75] border-[#1D9E75]' : 'bg-white border-gray-100'
      }`}
    >
      <p className={`text-[11px] font-semibold uppercase tracking-widest ${highlight ? 'text-white/70' : 'text-gray-400'}`}>
        {label}
      </p>
      <p className={`text-3xl font-black tracking-tight leading-none ${highlight ? 'text-white' : 'text-[#0D0D0D]'}`}>
        {value}
      </p>
      {sub && (
        <p className={`text-xs mt-0.5 ${highlight ? 'text-white/60' : 'text-gray-400'}`}>{sub}</p>
      )}
    </motion.div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

function WelcomeBanner() {
  const searchParams = useSearchParams();
  const { profile, fetchProfile, user } = useAuthStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get('welcome') === '1') {
      setShow(true);
      // Refresh le profil pour avoir le nouveau tier Stripe
      if (user) fetchProfile(user.id);
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams, user, fetchProfile]);

  if (!show) return null;
  const tier = profile?.subscription_tier;
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-6 md:mx-8 mt-4 bg-[#1D9E75] text-white rounded-2xl px-5 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <PartyPopper size={20} />
        <div>
          <p className="font-black text-sm">Abonnement {tier === 'pro' ? 'Pro' : 'Solo'} activé !</p>
          <p className="text-xs text-white/80 mt-0.5">Toutes vos fonctionnalités sont désormais débloquées.</p>
        </div>
      </div>
      <button onClick={() => setShow(false)} className="text-white/60 hover:text-white text-lg font-bold ml-4">✕</button>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { lang } = useT();
  const { profile } = useAuthStore();
  const { invoices, stats, fetchInvoices, fetchClients, computeStats } = useDataStore();
  const openSidebar = useUIStore((s) => s.openSidebar);
  const [loading, setLoading] = useState(true);

  const locale = lang === 'en' ? 'en-US' : 'fr-FR';

  useEffect(() => {
    Promise.all([fetchInvoices(), fetchClients()]).finally(() => setLoading(false));
  }, [fetchInvoices, fetchClients]);

  useEffect(() => { computeStats(); }, [invoices, computeStats]);

  const recentDocs = invoices.slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Suspense fallback={null}><WelcomeBanner /></Suspense>
      {/* Top bar */}
      <div className="border-b border-gray-100 px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={openSidebar} className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <Menu size={18} />
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              {getGreeting()}{profile?.company_name ? `, ${profile.company_name}` : ''}
            </p>
            <h1 className="text-lg font-black text-[#0D0D0D] tracking-tight leading-none">Tableau de bord</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/invoices/new?mode=voice"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-[#1D9E75] hover:bg-[#1D9E75]/8 border border-gray-200 hover:border-[#1D9E75]/30 transition-all"
          >
            <Mic size={13} className="text-[#1D9E75]" />
            Nouvelle voix
          </Link>
          <Link
            href="/invoices/new?mode=manual"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0D0D0D] text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <Plus size={13} />
            Facture
          </Link>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-8 py-7 space-y-7">
        {/* KPI cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-5 space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              i={0}
              label="Revenus du mois"
              value={formatCurrency(stats?.mrr ?? 0, locale)}
              highlight
            />
            <StatCard
              i={1}
              label="En attente"
              value={formatCurrency(stats?.pendingRevenue ?? 0, locale)}
              sub={stats?.pendingCount ? `${stats.pendingCount} document${stats.pendingCount > 1 ? 's' : ''}` : undefined}
            />
            <StatCard
              i={2}
              label="En retard"
              value={formatCurrency(stats?.overdueRevenue ?? 0, locale)}
              sub={stats?.overdueCount ? `${stats.overdueCount} document${stats.overdueCount > 1 ? 's' : ''}` : undefined}
            />
          </div>
        )}

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
        >
          <MonthlyChart invoices={invoices} />
        </motion.div>

        {/* Recent documents */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-[#0D0D0D] tracking-tight">Documents récents</h2>
            <Link href="/invoices" className="flex items-center gap-1 text-xs font-semibold text-[#1D9E75] hover:text-[#0f7a5a] transition-colors">
              Tout voir <ArrowRight size={11} />
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5">
                  <div className="space-y-1.5"><Skeleton className="h-2.5 w-16" /><Skeleton className="h-3.5 w-40" /></div>
                  <div className="flex items-center gap-6"><Skeleton className="h-3 w-20" /><Skeleton className="h-3 w-14" /></div>
                </div>
              ))}
            </div>
          ) : recentDocs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
              <Mic size={20} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-500 mb-1">Aucun document pour l'instant</p>
              <p className="text-xs text-gray-400 mb-5 max-w-xs mx-auto">Créez votre première facture en dictant à voix haute</p>
              <Link href="/invoices/new?mode=voice" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D9E75] hover:text-[#0f7a5a] transition-colors">
                <Mic size={13} /> Créer ma première facture
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_1fr_auto_auto] gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Client</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:block">Date</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Montant</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:block">Statut</p>
              </div>
              {recentDocs.map((inv: Invoice, i) => {
                const clientName = inv.client?.name || inv.client_name_override || '—';
                return (
                  <motion.div key={inv.id} whileHover={{ backgroundColor: '#f9fafb' }} transition={{ duration: 0.15 }}>
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_1fr_auto_auto] gap-4 items-center px-5 py-3.5 border-b border-gray-50 last:border-0 group block"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
                          {getDocumentLabel(inv.document_type, lang)} · {inv.number}
                        </p>
                        <p className="text-sm font-semibold text-[#0D0D0D] truncate group-hover:text-[#1D9E75] transition-colors">
                          {clientName}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 hidden sm:block">{formatDate(inv.issue_date, locale)}</p>
                      <p className="text-sm font-bold text-[#0D0D0D] text-right">{formatCurrency(inv.total, locale)}</p>
                      <div className="hidden sm:flex justify-end">
                        <StatusBadge status={inv.status} />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
