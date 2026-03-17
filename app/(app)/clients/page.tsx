'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Trash2, Mail, Phone, MapPin, Upload, Lock } from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import { useT } from '@/hooks/useTranslation';
import { useSubscription } from '@/hooks/useSubscription';
import AppHeader from '@/components/app/AppHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import type { Client } from '@/types';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  siret: string;
  address: string;
  postal_code: string;
  city: string;
  vat_number: string;
  notes: string;
}

const DEFAULT_FORM: ClientFormData = {
  name: '', email: '', phone: '', siret: '', address: '', postal_code: '', city: '', vat_number: '', notes: '',
};

export default function ClientsPage() {
  const router = useRouter();
  const { t } = useT();
  const { clients, fetchClients, createClient, deleteClient } = useDataStore();
  const { canImportClients } = useSubscription();

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.city || '').toLowerCase().includes(q)
    );
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Le nom est requis');
      return;
    }
    setSaving(true);
    try {
      await createClient({
        name: formData.name.trim(),
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        siret: formData.siret || undefined,
        address: formData.address || undefined,
        postal_code: formData.postal_code || undefined,
        city: formData.city || undefined,
        vat_number: formData.vat_number || undefined,
        notes: formData.notes || undefined,
      });
      toast.success('Client créé !');
      setShowModal(false);
      setFormData(DEFAULT_FORM);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (client: Client) => {
    if (!confirm(t('clients.deleteConfirm'))) return;
    try {
      await deleteClient(client.id);
      toast.success('Client supprimé');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const updateField = (key: keyof ClientFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title={t('clients.title')} />

      <div className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full space-y-4">
        {/* Top bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('clients.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => canImportClients ? null : setShowUpgradeModal(true)}
            className="gap-2 whitespace-nowrap"
          >
            {canImportClients ? <Upload size={15} /> : <Lock size={15} />}
            {t('clients.import')}
          </Button>
          <Button onClick={() => setShowModal(true)} className="gap-2 whitespace-nowrap">
            <Plus size={16} /> {t('clients.new')}
          </Button>
        </div>

        {/* Client list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-400 font-semibold">{t('clients.empty')}</p>
            <p className="text-sm text-gray-400 mt-1">{t('clients.emptyText')}</p>
            <div className="mt-4">
              <Button size="sm" onClick={() => setShowModal(true)} className="gap-2">
                <Plus size={14} /> {t('clients.new')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => router.push(`/clients/${client.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-black text-primary-700">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                        {client.name}
                      </p>
                      {client.siret && <p className="text-xs text-gray-400">{client.siret}</p>}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(client); }}
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="mt-3 space-y-1">
                  {client.email && (
                    <p className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail size={12} className="text-gray-400 shrink-0" /> {client.email}
                    </p>
                  )}
                  {client.phone && (
                    <p className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone size={12} className="text-gray-400 shrink-0" /> {client.phone}
                    </p>
                  )}
                  {client.city && (
                    <p className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin size={12} className="text-gray-400 shrink-0" /> {client.city}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New client modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={t('clients.new')}>
        <form onSubmit={handleCreate} className="space-y-4 px-6 py-5">
          <Input label={t('clients.form.name')} value={formData.name} onChange={updateField('name')} placeholder="Acme Corp" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('clients.form.email')} type="email" value={formData.email} onChange={updateField('email')} />
            <Input label={t('clients.form.phone')} value={formData.phone} onChange={updateField('phone')} />
          </div>
          <Input label={t('clients.form.siret')} value={formData.siret} onChange={updateField('siret')} />
          <Input label={t('clients.form.address')} value={formData.address} onChange={updateField('address')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('clients.form.postal')} value={formData.postal_code} onChange={updateField('postal_code')} />
            <Input label={t('clients.form.city')} value={formData.city} onChange={updateField('city')} />
          </div>
          <Input label={t('clients.form.vat')} value={formData.vat_number} onChange={updateField('vat_number')} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving} fullWidth>{t('clients.form.save')}</Button>
            <Button type="button" variant="ghost" fullWidth onClick={() => setShowModal(false)}>{t('common.cancel')}</Button>
          </div>
        </form>
      </Modal>

      {/* Upgrade modal */}
      <Modal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} title={t('common.proFeature')}>
        <div className="text-center space-y-4 px-6 py-5">
          <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto">
            <Lock size={24} className="text-primary-500" />
          </div>
          <p className="text-sm text-gray-600">{t('clients.importTitle')} — {t('common.proFeature')}</p>
          <Button fullWidth onClick={() => { setShowUpgradeModal(false); window.location.href = '/pricing'; }}>
            {t('common.upgrade')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
