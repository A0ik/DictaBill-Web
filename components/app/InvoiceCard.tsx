'use client';
import Link from 'next/link';
import { formatCurrency, formatDate, getStatusLabel, getDocumentLabel } from '@/lib/utils';
import type { Invoice } from '@/types';
import { useT } from '@/hooks/useTranslation';

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    paid: 'bg-emerald-500',
    sent: 'bg-blue-500',
    draft: 'bg-gray-300',
    overdue: 'bg-red-500',
  };
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${colors[status] ?? 'bg-gray-300'}`} />
      <span className="text-xs text-gray-500">{getStatusLabel(status)}</span>
    </span>
  );
}

export default function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const { lang } = useT();
  const clientName = invoice.client?.name || invoice.client_name_override || '—';
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';

  return (
    <Link
      href={`/invoices/${invoice.id}`}
      className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors group"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            {getDocumentLabel(invoice.document_type, lang)}
          </span>
          <span className="text-gray-200 text-[10px]">·</span>
          <span className="text-[10px] text-gray-400">{invoice.number}</span>
        </div>
        <p className="text-sm font-semibold text-[#0D0D0D] truncate group-hover:text-primary-600 transition-colors">
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
  );
}
