'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useDataStore } from '@/stores/dataStore';
import { useT } from '@/hooks/useTranslation';
import { formatCurrency } from '@/lib/utils';
import AppHeader from '@/components/app/AppHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import InvoiceCard from '@/components/app/InvoiceCard';
import toast from 'react-hot-toast';
import type { Client } from '@/types';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, lang } = useT();
  const { clients, invoices, fetchClients, fetchInvoices, updateClient, deleteClient } = useDataStore();

  const [client, setClient] = useState<Client | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', siret: '', address: '', postal_code: '', city: '', country: '', vat_number: '', notes: '',
  });

  const locale = lang === 'en' ? 'en-US' : 'fr-FR';

  useEffect(() => {
    if (clients.length === 0) fetchClients();
    if (invoices.length === 0) fetchInvoices();
  }, []);

  useEffect(() => {
    const found = clients.find((c) => c.id === id) || null;
    setClient(found);
    if (found) {
      setForm({
        name: found.name || '',
        email: found.email || '',
        phone: found.phone || '',
        siret: found.siret || '',
        address: found.address || '',
        postal_code: found.postal_code || '',
        city: found.city || '',
        country: found.country || '',
        vat_number: found.vat_number || '',
        notes: found.notes || '',
      });
    }
  }, [clients, id]);

  const clientInvoices = invoices.filter(
    (inv) => inv.client_id === id || (inv.client_name_override && client && inv.client_name_override === client.name)
  );

  const totalRevenue = clientInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((s, inv) => s + inv.total, 0);

  const handleSave = async () => {
    if (!client) return;
    setSaving(true);
    try {
      await updateClient(client.id, {
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        siret: form.siret || undefined,
        address: form.address || undefined,
        postal_code: form.postal_code || undefined,
        city: form.city || undefined,
        country: form.country || undefined,
        vat_number: form.vat_number || undefined,
        notes: form.notes || undefined,
      });
      toast.success(t('settings.saved'));
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!client) return;
    if (!confirm(t('clients.deleteConfirm'))) return;
    try {
      await deleteClient(client.id);
      router.push('/clients');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const updateField = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  if (!client) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader title="Client" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title={client.name} />

      <div className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full space-y-5">
        {/* Back */}
        <div className="flex items-center justify-between">
          <Link href="/clients" className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800">
            <ArrowLeft size={16} /> {t('common.back')}
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 size={14} /> {t('common.delete')}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">CA Total</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(totalRevenue, locale)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Documents</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{clientInvoices.length}</p>
          </div>
        </div>

        {/* Client info form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Informations</h2>
            {!editing ? (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>{t('common.edit')}</Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" loading={saving} onClick={handleSave}>{t('common.save')}</Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>{t('common.cancel')}</Button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <Input label={t('clients.form.name')} value={form.name} onChange={updateField('name')} required />
              <div className="grid grid-cols-2 gap-3">
                <Input label={t('clients.form.email')} type="email" value={form.email} onChange={updateField('email')} />
                <Input label={t('clients.form.phone')} value={form.phone} onChange={updateField('phone')} />
              </div>
              <Input label={t('clients.form.siret')} value={form.siret} onChange={updateField('siret')} />
              <Input label={t('clients.form.address')} value={form.address} onChange={updateField('address')} />
              <div className="grid grid-cols-2 gap-3">
                <Input label={t('clients.form.postal')} value={form.postal_code} onChange={updateField('postal_code')} />
                <Input label={t('clients.form.city')} value={form.city} onChange={updateField('city')} />
              </div>
              <Input label={t('clients.form.vat')} value={form.vat_number} onChange={updateField('vat_number')} />
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">{t('clients.form.notes')}</label>
                <textarea
                  value={form.notes}
                  onChange={updateField('notes')}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                />
              </div>
            </div>
          ) : (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                { label: t('clients.form.email'), value: client.email },
                { label: t('clients.form.phone'), value: client.phone },
                { label: t('clients.form.siret'), value: client.siret },
                { label: t('clients.form.address'), value: client.address },
                { label: t('clients.form.city'), value: [client.postal_code, client.city].filter(Boolean).join(' ') },
                { label: t('clients.form.vat'), value: client.vat_number },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs font-semibold text-gray-400">{label}</dt>
                  <dd className="text-sm font-medium text-gray-700 mt-0.5">{value || t('common.notProvided')}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Documents ({clientInvoices.length})</h2>
          {clientInvoices.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Aucun document pour ce client.</p>
          ) : (
            <div className="space-y-2">
              {clientInvoices.map((inv) => (
                <InvoiceCard key={inv.id} invoice={inv} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
