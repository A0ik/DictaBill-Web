import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, locale = 'fr-FR') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(amount);
}

export function formatDate(date: string, locale = 'fr-FR') {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));
}

export function getDocumentLabel(type: string, lang: 'fr' | 'en' = 'fr') {
  const labels: Record<string, Record<string, string>> = {
    invoice:     { fr: 'Facture',  en: 'Invoice'     },
    quote:       { fr: 'Devis',    en: 'Quote'       },
    credit_note: { fr: 'Avoir',    en: 'Credit note' },
  };
  return labels[type]?.[lang] ?? type;
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    draft:    'bg-gray-100 text-gray-600',
    sent:     'bg-blue-100 text-blue-700',
    paid:     'bg-green-100 text-green-700',
    overdue:  'bg-red-100 text-red-700',
    accepted: 'bg-emerald-100 text-emerald-700',
    refused:  'bg-red-100 text-red-700',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600';
}

export function getStatusLabel(status: string, lang: 'fr' | 'en' = 'fr') {
  const labels: Record<string, Record<string, string>> = {
    draft:    { fr: 'Brouillon', en: 'Draft'    },
    sent:     { fr: 'Envoyée',   en: 'Sent'     },
    paid:     { fr: 'Payée',     en: 'Paid'     },
    overdue:  { fr: 'En retard', en: 'Overdue'  },
    accepted: { fr: 'Accepté',   en: 'Accepted' },
    refused:  { fr: 'Refusé',    en: 'Refused'  },
  };
  return labels[status]?.[lang] ?? status;
}
