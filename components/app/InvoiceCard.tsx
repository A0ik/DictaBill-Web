'use client';
import Link from 'next/link';
import { formatCurrency, formatDate, getStatusLabel, getDocumentLabel } from '@/lib/utils';
import type { Invoice } from '@/types';
import { useT } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';

const STATUS_STYLES: Record<string, { dot: string }> = {
  paid:    { dot: 'bg-emerald-500' },
  sent:    { dot: 'bg-blue-500' },
  draft:   { dot: 'bg-gray-300' },
  overdue: { dot: 'bg-red-500' },
};

function StatusDot({ status }: { status: string }) {
  const cfg = STATUS_STYLES[status] ?? { dot: 'bg-gray-300' };
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      <span className="text-xs text-gray-500">{getStatusLabel(status)}</span>
    </span>
  );
}

export default function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const { lang } = useT();
  const clientName = invoice.client?.name || invoice.client_name_override || '—';
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';

  return (
    <motion.div whileHover={{ backgroundColor: '#f9fafb' }} transition={{ duration: 0.15 }}>
      <Link
        href={`/invoices/${invoice.id}`}
        className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 border-b border-gray-50 last:border-0 group block"
      >
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
            {getDocumentLabel(invoice.document_type, lang)} · {invoice.number}
          </p>
          <p className="text-sm font-semibold text-[#0D0D0D] truncate group-hover:text-[#1D9E75] transition-colors">
            {clientName}
          </p>
        </div>
        <p className="text-xs text-gray-400 hidden sm:block">
          {formatDate(invoice.issue_date, locale)}
        </p>
        <p className="text-sm font-bold text-[#0D0D0D] text-right sm:text-left">
          {formatCurrency(invoice.total, locale)}
        </p>
        <div className="hidden sm:flex">
          <StatusDot status={invoice.status} />
        </div>
      </Link>
    </motion.div>
  );
}
