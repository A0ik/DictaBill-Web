'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Search, Plus, Mic, PenLine, ChevronDown } from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import { useT } from '@/hooks/useTranslation';
import InvoiceCard from '@/components/app/InvoiceCard';
import AppHeader from '@/components/app/AppHeader';
import Button from '@/components/ui/Button';
import type { InvoiceStatus } from '@/types';

type FilterTab = 'all' | 'draft' | 'sent' | 'paid' | 'overdue';

const TABS: { key: FilterTab; labelKey: string }[] = [
  { key: 'all', labelKey: 'invoices.filters.all' },
  { key: 'draft', labelKey: 'invoices.filters.drafts' },
  { key: 'sent', labelKey: 'invoices.filters.sent' },
  { key: 'paid', labelKey: 'invoices.filters.paid' },
  { key: 'overdue', labelKey: 'invoices.filters.overdue' },
];

export default function InvoicesPage() {
  const { t } = useT();
  const { invoices, fetchInvoices } = useDataStore();
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInvoices();
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
      return (
        clientName.toLowerCase().includes(q) ||
        inv.number.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title={t('invoices.title')} />

      <div className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full space-y-4">
        {/* Top bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('invoices.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 bg-white"
            />
          </div>
          {/* New document dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              onClick={() => setDropdownOpen((o) => !o)}
              className="gap-2 whitespace-nowrap"
            >
              <Plus size={16} />
              {t('invoices.new')}
              <ChevronDown size={14} />
            </Button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 w-44 z-20">
                <Link
                  href="/invoices/new?mode=voice"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Mic size={15} className="text-primary-500" />
                  {t('invoices.newVoice')}
                </Link>
                <Link
                  href="/invoices/new?mode=manual"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <PenLine size={15} className="text-gray-500" />
                  {t('invoices.newManual')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
          {TABS.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                filter === key
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t(labelKey as any)}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-400 font-semibold">{t('invoices.empty')}</p>
            <Link href="/invoices/new?mode=voice" className="mt-4 inline-block">
              <Button size="sm" className="gap-2">
                <Mic size={14} />
                {t('invoices.newVoice')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((inv) => (
              <InvoiceCard key={inv.id} invoice={inv} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
