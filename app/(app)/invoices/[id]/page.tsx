'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Download, Send, CheckCircle, Copy, Trash2, Pencil, Save, X, ArrowLeft
} from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';
import { useT } from '@/hooks/useTranslation';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, getDocumentLabel } from '@/lib/utils';
import AppHeader from '@/components/app/AppHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import type { Invoice, InvoiceItem } from '@/types';
import Link from 'next/link';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, lang } = useT();
  const { invoices, fetchInvoices, updateInvoice, updateInvoiceStatus, deleteInvoice, createInvoice } = useDataStore();
  const { profile } = useAuthStore();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editItems, setEditItems] = useState<InvoiceItem[]>([]);

  const locale = lang === 'en' ? 'en-US' : 'fr-FR';

  useEffect(() => {
    if (invoices.length === 0) fetchInvoices();
  }, []);

  useEffect(() => {
    const found = invoices.find((inv) => inv.id === id) || null;
    setInvoice(found);
    if (found) {
      setNotes(found.notes || '');
      setDueDate(found.due_date || '');
      setEditItems(found.items || []);
    }
  }, [invoices, id]);

  const handleSave = async () => {
    if (!invoice) return;
    setSaving(true);
    try {
      await updateInvoice(invoice.id, {
        notes,
        due_date: dueDate || undefined,
        items: editItems as any,
      });
      toast.success(t('settings.saved'));
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!invoice) return;
    try {
      await updateInvoiceStatus(invoice.id, 'paid');
      toast.success(t('invoices.markPaid'));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleMarkSent = async () => {
    if (!invoice) return;
    try {
      await updateInvoiceStatus(invoice.id, 'sent');
      toast.success(t('invoices.sendBtn'));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!invoice) return;
    if (!confirm(t('invoices.deleteConfirm'))) return;
    try {
      await deleteInvoice(invoice.id);
      router.push('/invoices');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDuplicate = async () => {
    if (!invoice || !profile) return;
    try {
      const dup = await createInvoice(
        {
          client_id: invoice.client_id || undefined,
          client_name_override: invoice.client_name_override || undefined,
          document_type: invoice.document_type,
          issue_date: new Date().toISOString().split('T')[0],
          due_date: invoice.due_date || undefined,
          items: invoice.items.map(({ description, quantity, unit_price, vat_rate }) => ({
            description, quantity, unit_price, vat_rate,
          })),
          notes: invoice.notes || undefined,
        },
        profile
      );
      toast.success('Dupliqué !');
      router.push(`/invoices/${dup.id}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const updateEditItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    setEditItems((prev) =>
      prev.map((it, i) =>
        i === idx
          ? { ...it, [field]: value, total: (field === 'quantity' ? Number(value) : it.quantity) * (field === 'unit_price' ? Number(value) : it.unit_price) }
          : it
      )
    );
  };

  if (!invoice) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader title="Document" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Chargement…</p>
        </div>
      </div>
    );
  }

  const clientName = invoice.client?.name || invoice.client_name_override || '—';
  const displayItems = editing ? editItems : invoice.items;

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title={invoice.number} />

      <div className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full space-y-5">
        {/* Back + status */}
        <div className="flex items-center justify-between">
          <Link href="/invoices" className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800">
            <ArrowLeft size={16} /> {t('common.back')}
          </Link>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
            {getStatusLabel(invoice.status, lang)}
          </span>
        </div>

        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {getDocumentLabel(invoice.document_type, lang)}
              </p>
              <h2 className="text-2xl font-black text-gray-900">{invoice.number}</h2>
              <p className="text-gray-500 mt-1 font-semibold">{clientName}</p>
              {invoice.client?.email && (
                <p className="text-sm text-gray-400">{invoice.client.email}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-gray-900">{formatCurrency(invoice.total, locale)}</p>
              <p className="text-sm text-gray-400 mt-1">
                {t('invoices.issueDate')}: {formatDate(invoice.issue_date, locale)}
              </p>
              {invoice.due_date && !editing && (
                <p className="text-sm text-gray-400">
                  {t('invoices.dueDate')}: {formatDate(invoice.due_date, locale)}
                </p>
              )}
              {editing && (
                <div className="mt-2">
                  <Input
                    label={t('invoices.dueDate')}
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-bold text-gray-700 mb-4">{t('invoices.items')}</p>
          <div className="space-y-3">
            {displayItems.map((item, idx) => (
              <div key={idx} className={editing ? 'grid grid-cols-12 gap-2 items-end' : 'flex items-center justify-between py-2 border-b border-gray-50 last:border-0'}>
                {editing ? (
                  <>
                    <div className="col-span-5">
                      <Input
                        label={idx === 0 ? 'Description' : ''}
                        value={item.description}
                        onChange={(e) => updateEditItem(idx, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label={idx === 0 ? 'Qté' : ''}
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateEditItem(idx, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label={idx === 0 ? 'Prix HT' : ''}
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => updateEditItem(idx, 'unit_price', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label={idx === 0 ? 'TVA %' : ''}
                        type="number"
                        value={item.vat_rate}
                        onChange={(e) => updateEditItem(idx, 'vat_rate', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-1" />
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{item.description}</p>
                      <p className="text-xs text-gray-400">{item.quantity} × {formatCurrency(item.unit_price, locale)} · TVA {item.vat_rate}%</p>
                    </div>
                    <span className="font-bold text-gray-900">{formatCurrency(item.total, locale)}</span>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{t('invoices.subtotal')}</span>
              <span>{formatCurrency(invoice.subtotal, locale)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{t('invoices.vat')}</span>
              <span>{formatCurrency(invoice.vat_amount, locale)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>{t('invoices.total')}</span>
              <span>{formatCurrency(invoice.total, locale)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {(invoice.notes || editing) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm font-bold text-gray-700 mb-2">{t('invoices.notes')}</p>
            {editing ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
              />
            ) : (
              <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.notes}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          {editing ? (
            <div className="flex gap-3">
              <Button onClick={handleSave} loading={saving} className="gap-2">
                <Save size={15} /> {t('common.save')}
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)} className="gap-2">
                <X size={15} /> {t('common.cancel')}
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                className="gap-2"
              >
                <Pencil size={14} /> {t('invoices.editBtn')}
              </Button>

              {invoice.pdf_url && (
                <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Download size={14} /> {t('invoices.downloadBtn')}
                  </Button>
                </a>
              )}

              {invoice.status === 'draft' && (
                <Button size="sm" variant="secondary" onClick={handleMarkSent} className="gap-2">
                  <Send size={14} /> {t('invoices.sendBtn')}
                </Button>
              )}

              {invoice.status !== 'paid' && (
                <Button size="sm" onClick={handleMarkPaid} className="gap-2">
                  <CheckCircle size={14} /> {t('invoices.markPaid')}
                </Button>
              )}

              <Button variant="secondary" size="sm" onClick={handleDuplicate} className="gap-2">
                <Copy size={14} /> {t('invoices.duplicateBtn')}
              </Button>

              <Button variant="danger" size="sm" onClick={handleDelete} className="gap-2">
                <Trash2 size={14} /> {t('common.delete')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
