'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Trash2, FileUp, CheckCircle2, X, Loader2, Menu, Upload } from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import { useT } from '@/hooks/useTranslation';
import { useUIStore } from '@/stores/uiStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { Client } from '@/types';

interface ClientFormData {
  name: string; email: string; phone: string; siret: string;
  address: string; postal_code: string; city: string; vat_number: string; notes: string;
}

interface ImportedClient {
  name: string; email?: string; phone?: string; siret?: string;
  address?: string; postal_code?: string; city?: string; vat_number?: string; notes?: string;
  selected: boolean;
}

const DEFAULT_FORM: ClientFormData = {
  name: '', email: '', phone: '', siret: '', address: '', postal_code: '', city: '', vat_number: '', notes: '',
};

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;
}

export default function ClientsPage() {
  const router = useRouter();
  const { t } = useT();
  const { clients, fetchClients, createClient, deleteClient } = useDataStore();
  const openSidebar = useUIStore((s) => s.openSidebar);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'preview'>('upload');
  const [importedClients, setImportedClients] = useState<ImportedClient[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [importFileName, setImportFileName] = useState('');
  const importFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchClients().finally(() => setLoading(false)); }, [fetchClients]);

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) || (c.city || '').toLowerCase().includes(q);
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
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  };

  const handleDelete = async (client: Client) => {
    if (!confirm(`Supprimer ${client.name} ?`)) return;
    try { await deleteClient(client.id); toast.success('Client supprimé'); }
    catch (err: any) { toast.error(err.message); }
  };

  const updateField = (key: keyof ClientFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  // ── Import (accepts ANY file type) ────────────────────────────────────────
  const handleImportFile = async (file: File) => {
    setImportFileName(file.name);
    setImportLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/import-clients', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur import');
      if (!data.clients?.length) { toast.error('Aucun client trouvé dans ce fichier.'); return; }
      setImportedClients(data.clients.map((c: any) => ({ ...c, selected: true })));
      setImportStep('preview');
    } catch (err: any) { toast.error(err.message); } finally { setImportLoading(false); }
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
        await createClient({ name: c.name, email: c.email, phone: c.phone, siret: c.siret, address: c.address, postal_code: c.postal_code, city: c.city, vat_number: c.vat_number, notes: c.notes });
        success++;
      } catch {}
    }
    setImporting(false);
    setShowImportModal(false);
    setImportStep('upload');
    setImportedClients([]);
    setImportFileName('');
    toast.success(`${success} client${success > 1 ? 's' : ''} importé${success > 1 ? 's' : ''} !`);
  };

  const toggleSelectAll = (val: boolean) =>
    setImportedClients((prev) => prev.map((c) => ({ ...c, selected: val })));

  const selectedCount = importedClients.filter((c) => c.selected).length;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-gray-100 px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={openSidebar} className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <Menu size={18} />
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Annuaire</p>
            <h1 className="text-lg font-black text-[#0D0D0D] tracking-tight leading-none">Clients</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 transition-all"
          >
            <Upload size={13} /> Importer
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-[#0D0D0D] text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Nouveau client</span>
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-8 py-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, ville…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]/60 placeholder:text-gray-400 transition-all"
          />
        </div>

        {/* Client table */}
        {loading ? (
          <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1.5"><Skeleton className="h-3.5 w-36" /><Skeleton className="h-2.5 w-24" /></div>
                <Skeleton className="h-3 w-28 hidden sm:block" />
                <Skeleton className="h-3 w-16 hidden sm:block" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-gray-200 py-20 text-center"
          >
            <p className="text-sm font-semibold text-gray-500 mb-1">Aucun client pour l'instant</p>
            <p className="text-xs text-gray-400 mb-5">Ajoutez vos clients manuellement ou importez un fichier</p>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D9E75] hover:text-[#0f7a5a] transition-colors">
                <Plus size={13} /> Nouveau client
              </button>
              <span className="text-gray-200">·</span>
              <button onClick={() => setShowImportModal(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
                <Upload size={13} /> Importer un fichier
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nom</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:block">Email</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:block">Ville</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400" />
            </div>
            {filtered.map((client) => (
              <motion.div
                key={client.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                transition={{ duration: 0.15 }}
              >
                <div
                  className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 border-b border-gray-50 last:border-0 cursor-pointer group"
                  onClick={() => router.push(`/clients/${client.id}`)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#1D9E75]/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-black text-[#1D9E75]">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0D0D0D] truncate group-hover:text-[#1D9E75] transition-colors">
                        {client.name}
                      </p>
                      {client.siret && <p className="text-[10px] text-gray-400 font-mono">{client.siret}</p>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 truncate hidden sm:block">{client.email || '—'}</p>
                  <p className="text-xs text-gray-500 hidden sm:block">{client.city || '—'}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(client); }}
                    className="p-1.5 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* New client modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nouveau client">
        <form onSubmit={handleCreate} className="space-y-4 px-6 py-5">
          <Input label="Nom / Entreprise *" value={formData.name} onChange={updateField('name')} placeholder="Acme Corp" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Email" type="email" value={formData.email} onChange={updateField('email')} />
            <Input label="Téléphone" value={formData.phone} onChange={updateField('phone')} />
          </div>
          <Input label="SIRET" value={formData.siret} onChange={updateField('siret')} />
          <Input label="Adresse" value={formData.address} onChange={updateField('address')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Code postal" value={formData.postal_code} onChange={updateField('postal_code')} />
            <Input label="Ville" value={formData.city} onChange={updateField('city')} />
          </div>
          <Input label="N° TVA" value={formData.vat_number} onChange={updateField('vat_number')} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving} fullWidth>Créer le client</Button>
            <Button type="button" variant="ghost" fullWidth onClick={() => setShowModal(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>

      {/* Import modal */}
      <Modal
        open={showImportModal}
        onClose={() => { setShowImportModal(false); setImportStep('upload'); setImportedClients([]); setImportFileName(''); }}
        title={importStep === 'preview' ? `${importedClients.length} clients détectés` : 'Importer des clients'}
      >
        <div className="px-6 py-5">
          {importStep === 'upload' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 leading-relaxed">
                Importez depuis <strong>n'importe quel fichier</strong> — CSV, Excel, PDF, Word, texte…<br />
                L'IA extrait automatiquement les données clients.
              </p>
              <input
                ref={importFileRef}
                type="file"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImportFile(f); }}
              />
              {importLoading ? (
                <div className="flex flex-col items-center gap-4 py-12">
                  <div className="w-10 h-10 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Analyse en cours…</p>
                    <p className="text-xs text-gray-400 mt-0.5">{importFileName}</p>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => importFileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={cn(
                    'flex flex-col items-center justify-center gap-3 h-44 rounded-2xl border-2 border-dashed cursor-pointer transition-all',
                    isDragging
                      ? 'border-[#1D9E75] bg-[#1D9E75]/5 scale-[1.01]'
                      : 'border-gray-200 hover:border-[#1D9E75]/40 hover:bg-gray-50'
                  )}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-[#1D9E75]/15' : 'bg-gray-100'}`}>
                    <Upload size={22} className={isDragging ? 'text-[#1D9E75]' : 'text-gray-400'} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Glissez un fichier ici</p>
                    <p className="text-xs text-gray-400 mt-0.5">ou cliquez pour sélectionner</p>
                    <p className="text-[10px] text-gray-300 mt-1.5 uppercase tracking-widest">CSV · Excel · PDF · Word · Texte…</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {importStep === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-[#0D0D0D]">{selectedCount}</span> sur {importedClients.length} sélectionné{selectedCount > 1 ? 's' : ''}
                </p>
                <div className="flex gap-3">
                  <button onClick={() => toggleSelectAll(true)} className="text-xs font-semibold text-[#1D9E75] hover:underline">Tout</button>
                  <button onClick={() => toggleSelectAll(false)} className="text-xs font-semibold text-gray-400 hover:underline">Aucun</button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1 rounded-xl border border-gray-100 p-2">
                {importedClients.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => setImportedClients((prev) => prev.map((x, j) => j === i ? { ...x, selected: !x.selected } : x))}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors',
                      c.selected ? 'bg-[#1D9E75]/8' : 'hover:bg-gray-50'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all',
                      c.selected ? 'bg-[#1D9E75] border-[#1D9E75]' : 'border-gray-300'
                    )}>
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
                <Button onClick={handleImportConfirm} loading={importing} fullWidth>
                  Importer {selectedCount} client{selectedCount > 1 ? 's' : ''}
                </Button>
                <Button variant="ghost" onClick={() => { setImportStep('upload'); setImportedClients([]); }}>
                  ← Retour
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
