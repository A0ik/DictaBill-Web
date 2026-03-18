'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Search, Plus, Mic, PenLine, ChevronDown, Download, Menu } from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import { useT } from '@/hooks/useTranslation';
import { useUIStore } from '@/stores/uiStore';
import InvoiceCard from '@/components/app/InvoiceCard';
import Button from '@/components/ui/Button';
import type { Invoice, InvoiceStatus } from '@/types';

function exportToCSV(invoices: Invoice[]) {
  const headers = ['Numéro', 'Type', 'Client', 'Date émission', 'Échéance', 'HT', 'TVA', 'TTC', 'Statut'];
  const rows = invoices.map((inv) => [
    inv.number,
    inv.document_type,
    inv.client?.name || inv.client_name_override || '',
    inv.issue_date,
    inv.due_date || '',
    inv.subtotal.toFixed(2),
    inv.vat_amount.toFixed(2),
    inv.total.toFixed(2),
    inv.status,
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dictabill-export-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

type FilterTab = 'all' | 'draft' | 'sent' | 'paid' | 'overdue';

const TABS: { key: FilterTab; labelKey: string }[] = [
  { key: 'all', labelKey: 'invoices.filters.all' },
  { key: 'draft', labelKey: 'invoices.filters.drafts' },
  { key: 'sent', labelKey: 'invoices.filters.sent' },
  { key: 'paid', labelKey: 'invoices.filters.paid' },
  { key: 'overdue', labelKey: 'invoices.filters.overdue' },
];

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded ${className}`} />;
}

export default function InvoicesPage() {
  const { t } = useT();
  const { invoices, fetchInvoices } = useDataStore();
  const openSidebar = useUIStore((s) => s.openSidebar);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInvoices().finally(() => setLoading(false));
  }, [fetchInvoices]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = invoices.filter((inv) => {
    if (filter !== 'all' && inv.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const clientName = inv.client?.name || inv.client_name_override || '';
      return clientName.toLowerCase().includes(q) || inv.number.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page header */}
      <div className="border-b border-gray-200 px-6 md:px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={openSidebar}
              className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Documents</p>
              <h1 className="text-xl font-black text-[#0D0D0D] tracking-tight leading-none">
                {t('invoices.title')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => exportToCSV(filtered)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <Download size={13} />
              Export CSV
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#0D0D0D] text-white hover:bg-[#1a1a1a] transition-colors"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">{t('invoices.new')}</span>
                <ChevronDown size={12} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 w-44 z-20">
                  <Link
                    href="/invoices/new?mode=voice"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Mic size={14} className="text-primary-500" />
                    {t('invoices.newVoice')}
                  </Link>
                  <Link
                    href="/invoices/new?mode=manual"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <PenLine size={14} className="text-gray-400" />
                    {t('invoices.newManual')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-8 py-6 space-y-4">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('invoices.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 bg-white placeholder:text-gray-400"
            />
          </div>
          {/* Filter tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {TABS.map(({ key, labelKey }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                  filter === key
                    ? 'bg-white shadow-sm text-[#0D0D0D]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t(labelKey as any)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-200">
              {['Client', 'Date', 'Montant', 'Statut'].map((h) => (
                <p key={h} className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{h}</p>
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 border-b border-gray-100 last:border-0">
                <div><Skeleton className="h-2.5 w-16 mb-1.5" /><Skeleton className="h-3.5 w-36" /></div>
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-14" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl py-16 text-center">
            <Mic size={20} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500 mb-1">{t('invoices.empty')}</p>
            <Link
              href="/invoices/new?mode=voice"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Mic size={13} />
              {t('invoices.newVoice')}
            </Link>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-200">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Client</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 hidden sm:block">Date</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 text-right sm:text-left">Montant</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 hidden sm:block">Statut</p>
            </div>
            {filtered.map((inv) => (
              <InvoiceCard key={inv.id} invoice={inv} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
