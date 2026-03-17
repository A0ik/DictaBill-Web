'use client';
import Link from 'next/link';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, getDocumentLabel } from '@/lib/utils';
import type { Invoice } from '@/types';
import { useT } from '@/hooks/useTranslation';

export default function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const { lang } = useT();
  const clientName = invoice.client?.name || invoice.client_name_override || '—';
  const docColor = invoice.document_type === 'quote' ? 'border-l-blue-400' : invoice.document_type === 'credit_note' ? 'border-l-purple-400' : 'border-l-primary-400';

  return (
    <Link href={`/invoices/${invoice.id}`} className={`card p-4 flex items-center gap-4 hover:shadow-md transition-all border-l-4 ${docColor} group`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-400 uppercase">{getDocumentLabel(invoice.document_type, lang)}</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs font-semibold text-gray-600">{invoice.number}</span>
        </div>
        <p className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">{clientName}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(invoice.issue_date, lang === 'en' ? 'en-US' : 'fr-FR')}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="font-bold text-gray-900">{formatCurrency(invoice.total, lang === 'en' ? 'en-US' : 'fr-FR')}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(invoice.status)}`}>
          {getStatusLabel(invoice.status, lang)}
        </span>
      </div>
    </Link>
  );
}
