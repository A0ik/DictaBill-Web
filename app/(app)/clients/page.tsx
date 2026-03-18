'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Trash2, Mail, Phone, MapPin, FileUp, CheckCircle2, X, Loader2, Menu } from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import { useT } from '@/hooks/useTranslation';
import { useUIStore } from '@/stores/uiStore';
import AppHeader from '@/components/app/AppHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
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

interface ImportedClient {
  name: string;
  email?: string;
  phone?: string;
  siret?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  vat_number?: string;
  notes?: string;
  selected: boolean;
}

const DEFAULT_FORM: ClientFormData = {
  name: '', email: '', phone: '', siret: '', address: '', postal_code: '', city: '', vat_number: '', notes: '',
};

export default function ClientsPage() {
  const router = useRouter();
  const { t } = useT();
  const { clients, fetchClients, createClient, deleteClient } = useDataStore();
  const openSidebar = useUIStore((s) => s.openSidebar);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  // Import state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'importing'>('upload');
  const [importedClients, setImportedClients] = useState<ImportedClient[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

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
    if (!formData.name.trim()) { toast.error('Le nom est requis'); return; }
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

  // ── Import handlers ──────────────────────────────────────────────────────
  const handleImportFile = async (file: File) => {
    const allowed = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel', 'application/pdf', 'text/plain'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(file.type) && !['csv','xlsx','xls','pdf','txt'].includes(ext || '')) {
      toast.error('Format non supporté. Utilisez CSV, Excel ou PDF.');
      return;
    }
    setImportLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/import-clients', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');
      if (!data.clients?.length) { toast.error('Aucun client trouvé dans ce fichier.'); return; }
      setImportedClients(data.clients.map((c: any) => ({ ...c, selected: true })));
      setImportStep('preview');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setImportLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImportFile(file);
  };

  const handleImportConfirm = async () => {
    const selected = importedClients.filter((c) => c.selected);
    if (!selected.length) { toast.error('Sélectionnez au moins un client'); return; }
    setImporting(true);
    let success = 0;
    for (const c of selected) {
      try {
        await createClient({
          name: c.name,
          email: c.email || undefined,
          phone: c.phone || undefined,
          siret: c.siret || undefined,
          address: c.address || undefined,
          postal_code: c.postal_code || undefined,
          city: c.city || undefined,
          vat_number: c.vat_number || undefined,
          notes: c.notes || undefined,
        });
        success++;
      } catch {}
    }
    setImporting(false);
    setShowImportModal(false);
    setImportStep('upload');
    setImportedClients([]);
    toast.success(`${success} client${success > 1 ? 's' : ''} importé${success > 1 ? 's' : ''} !`);
  };

  const toggleSelectAll = (val: boolean) =>
    setImportedClients((prev) => prev.map((c) => ({ ...c, selected: val })));

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page header */}
      <div className="border-b border-gray-200 px-6 md:px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={openSidebar} className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
              <Menu size={18} />
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Annuaire</p>
              <h1 className="text-xl font-black text-[#0D0D0D] tracking-tight leading-none">{t('clients.title')}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <FileUp size={13} />
              Importer CSV / Excel / PDF
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#0D0D0D] text-white hover:bg-[#1a1a1a] transition-colors"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">{t('clients.new')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-8 py-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('clients.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white placeholder:text-gray-400"
          />
        </div>

        {/* Client grid */}
        {filtered.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl py-16 text-center">
            <p className="text-sm font-semibold text-gray-500 mb-1">{t('clients.empty')}</p>
            <p className="text-xs text-gray-400 mb-5">{t('clients.emptyText')}</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                <Plus size={13} /> {t('clients.new')}
              </button>
              <span className="text-gray-200">·</span>
              <button onClick={() => setShowImportModal(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
                <FileUp size={13} /> Importer un fichier
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-200">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Nom</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 hidden sm:block">Email</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 hidden sm:block">Ville</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400"></p>
            </div>
            {filtered.map((client) => (
              <div
                key={client.id}
                className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors cursor-pointer group"
                onClick={() => router.push(`/clients/${client.id}`)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-gray-500">{client.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0D0D0D] truncate group-hover:text-primary-600 transition-colors">{client.name}</p>
                    {client.siret && <p className="text-[10px] text-gray-400">{client.siret}</p>}
                  </div>
                </div>
                <p className="text-xs text-gray-500 truncate hidden sm:block">{client.email || '—'}</p>
                <p className="text-xs text-gray-500 hidden sm:block">{client.city || '—'}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(client); }}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={13} />
                </button>
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

      {/* Import modal */}
      <Modal
        open={showImportModal}
        onClose={() => { setShowImportModal(false); setImportStep('upload'); setImportedClients([]); }}
        title={importStep === 'preview' ? `${importedClients.length} clients détectés` : 'Importer des clients'}
      >
        <div className="px-6 py-5">
          {importStep === 'upload' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Importez depuis un fichier <strong>CSV</strong>, <strong>Excel (.xlsx)</strong> ou <strong>PDF</strong>.<br />
                L&apos;IA extrait automatiquement les données clients.
              </p>
              <input
                ref={importFileRef}
                type="file"
                accept=".csv,.xlsx,.xls,.pdf,.txt"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImportFile(f); }}
              />
              {importLoading ? (
                <div className="flex flex-col items-center gap-3 py-10">
                  <Loader2 size={28} className="animate-spin text-primary-500" />
                  <p className="text-sm text-gray-500">Analyse du fichier en cours…</p>
                </div>
              ) : (
                <div
                  onClick={() => importFileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={cn(
                    'flex flex-col items-center justify-center gap-3 h-40 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
                    isDragging ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'
                  )}
                >
                  <FileUp size={24} className={isDragging ? 'text-primary-500' : 'text-gray-400'} />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600">Glissez un fichier ici</p>
                    <p className="text-xs text-gray-400 mt-0.5">ou cliquez pour sélectionner · CSV, Excel, PDF</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {importStep === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Sélectionnez les clients à importer :</p>
                <div className="flex gap-3">
                  <button onClick={() => toggleSelectAll(true)} className="text-xs text-primary-600 font-medium hover:underline">Tout</button>
                  <button onClick={() => toggleSelectAll(false)} className="text-xs text-gray-400 font-medium hover:underline">Aucun</button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1 border border-gray-200 rounded-xl p-2">
                {importedClients.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => setImportedClients((prev) => prev.map((x, j) => j === i ? { ...x, selected: !x.selected } : x))}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
                      c.selected ? 'bg-primary-50' : 'hover:bg-gray-50'
                    )}
                  >
                    <div className={cn('w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                      c.selected ? 'bg-primary-500 border-primary-500' : 'border-gray-300')}>
                      {c.selected && <CheckCircle2 size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0D0D0D] truncate">{c.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {[c.email, c.phone, c.city].filter(Boolean).join(' · ') || 'Aucun détail'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  onClick={handleImportConfirm}
                  loading={importing}
                  fullWidth
                  className="gap-2"
                >
                  Importer {importedClients.filter((c) => c.selected).length} client{importedClients.filter((c) => c.selected).length > 1 ? 's' : ''}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setImportStep('upload')}
                  className="gap-1.5"
                >
                  <X size={14} /> Retour
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
