'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mic, PenLine, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';
import { useSubscription } from '@/hooks/useSubscription';
import { useT } from '@/hooks/useTranslation';
import VoiceRecorder from '@/components/app/VoiceRecorder';
import AppHeader from '@/components/app/AppHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import type { DocumentType } from '@/types';
import { cn } from '@/lib/utils';

interface FormItem {
  description: string;
  quantity: number;
  unit_price: number;
  vat_rate: number;
}

const DOC_CONFIG: Record<DocumentType, {
  labelKey: string;
  color: string;
  bg: string;
  text: string;
  border: string;
  example: string;
}> = {
  invoice: {
    labelKey: 'dashboard.invoice',
    color: '#1D9E75',
    bg: 'bg-[#1D9E75]/10',
    text: 'text-[#1D9E75]',
    border: 'border-[#1D9E75]',
    example: 'Facture Acme Corp, développement web, 2 400€ HT, paiement 30 jours',
  },
  quote: {
    labelKey: 'dashboard.quote',
    color: '#3B82F6',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-500',
    example: 'Devis pour refonte site internet, client Martin Dupont, 1 800€ HT',
  },
  credit_note: {
    labelKey: 'dashboard.creditNote',
    color: '#8B5CF6',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-500',
    example: 'Avoir pour annulation de prestation, 500€, client Acme Corp',
  },
};
const DOC_TYPES = Object.keys(DOC_CONFIG) as DocumentType[];

const DEFAULT_ITEM: FormItem = { description: '', quantity: 1, unit_price: 0, vat_rate: 20 };

function NewInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useT();
  const { profile } = useAuthStore();
  const { clients, fetchClients, createInvoice } = useDataStore();
  const { maxInvoices, isFree } = useSubscription();

  const initialMode = searchParams.get('mode') === 'manual' ? 'manual' : 'voice';
  const [mode, setMode] = useState<'voice' | 'manual'>(initialMode);
  const [docType, setDocType] = useState<DocumentType>('invoice');
  const [transcribing, setTranscribing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [clientId, setClientId] = useState('');
  const [clientNameOverride, setClientNameOverride] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<FormItem[]>([{ ...DEFAULT_ITEM }]);
  const [notes, setNotes] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const cfg = DOC_CONFIG[docType];

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Check monthly limit
  const monthlyCount = profile?.monthly_invoice_count ?? 0;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const isNewMonth = (profile?.invoice_month ?? '') !== currentMonth;
  const effectiveCount = isNewMonth ? 0 : monthlyCount;
  const limitReached = isFree && effectiveCount >= 5;

  const handleRecordingComplete = async (blob: Blob) => {
    setTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
      const data = await res.json();

      // Populate form from transcription
      if (data.client_name) setClientNameOverride(data.client_name);
      if (data.issue_date) setIssueDate(data.issue_date);
      if (data.due_date) setDueDate(data.due_date);
      if (data.notes) setNotes(data.notes);
      if (data.voice_transcript) setVoiceTranscript(data.voice_transcript);
      if (data.items?.length) {
        setItems(data.items.map((it: any) => ({
          description: it.description || '',
          quantity: it.quantity || 1,
          unit_price: it.unit_price || 0,
          vat_rate: it.vat_rate ?? 20,
        })));
      }
      setMode('manual'); // Switch to form view after transcription
    } catch (err: any) {
      toast.error(err.message || 'Transcription error');
    } finally {
      setTranscribing(false);
    }
  };

  const updateItem = (index: number, field: keyof FormItem, value: string | number) => {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems((prev) => [...prev, { ...DEFAULT_ITEM }]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const subtotal = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
  const vatAmount = items.reduce((s, it) => s + it.quantity * it.unit_price * (it.vat_rate / 100), 0);
  const total = subtotal + vatAmount;

  const handleSave = async () => {
    if (limitReached) {
      toast.error(t('invoices.limitMsg'));
      return;
    }
    if (items.every((it) => !it.description)) {
      toast.error('Please add at least one line item.');
      return;
    }
    setSaving(true);
    try {
      const inv = await createInvoice(
        {
          client_id: clientId || undefined,
          client_name_override: !clientId ? clientNameOverride || undefined : undefined,
          document_type: docType,
          issue_date: issueDate,
          due_date: dueDate || undefined,
          items: items.map((it) => ({
            description: it.description,
            quantity: Number(it.quantity),
            unit_price: Number(it.unit_price),
            vat_rate: Number(it.vat_rate),
          })),
          notes: notes || undefined,
        },
        profile
      );
      toast.success('Document créé !');
      router.push(`/invoices/${inv.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title={mode === 'voice' ? t('invoices.voiceTitle') : t('invoices.new')} />

      <div className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full space-y-5">
        {/* Limit warning */}
        {limitReached && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-amber-800 text-sm">{t('invoices.limitReached')}</p>
              <p className="text-sm text-amber-700 mt-0.5">{t('invoices.limitMsg')}</p>
              <button
                onClick={() => router.push('/pricing')}
                className="mt-2 text-xs font-bold text-amber-800 underline"
              >
                {t('invoices.upgrade')}
              </button>
            </div>
          </div>
        )}

        {/* Document type selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm font-bold text-gray-700 mb-3">Type de document</p>
          <div className="flex gap-2">
            {DOC_TYPES.map((value) => {
              const c = DOC_CONFIG[value];
              const active = docType === value;
              return (
                <button
                  key={value}
                  onClick={() => setDocType(value)}
                  style={active ? { borderColor: c.color, backgroundColor: c.color + '15', color: c.color } : {}}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-xl text-sm font-semibold border-2 transition-all',
                    active ? '' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  {t(c.labelKey as any)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setMode('voice')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all',
              mode === 'voice' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
            )}
          >
            <Mic size={15} /> {t('invoices.newVoice')}
          </button>
          <button
            onClick={() => setMode('manual')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all',
              mode === 'manual' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
            )}
          >
            <PenLine size={15} /> {t('invoices.newManual')}
          </button>
        </div>

        {/* Voice mode */}
        {mode === 'voice' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500 text-center mb-2">{t('invoices.voiceHint')}</p>
            <VoiceRecorder
              onRecordingComplete={handleRecordingComplete}
              loading={transcribing}
              exampleText={cfg.example}
              disabled={limitReached}
            />
            {voiceTranscript && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500 border border-gray-100">
                <p className="font-semibold text-gray-700 mb-1">Transcription :</p>
                {voiceTranscript}
              </div>
            )}
          </div>
        )}

        {/* Manual / form mode */}
        {mode === 'manual' && (
          <>
            {/* Client */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
              <p className="text-sm font-bold text-gray-700">{t('invoices.client')}</p>
              {clients.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Client enregistré</label>
                  <select
                    value={clientId}
                    onChange={(e) => {
                      setClientId(e.target.value);
                      if (e.target.value) setClientNameOverride('');
                    }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    <option value="">— Sélectionner un client —</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {!clientId && (
                <Input
                  label="Nom du client"
                  value={clientNameOverride}
                  onChange={(e) => setClientNameOverride(e.target.value)}
                  placeholder="Acme Corp"
                />
              )}
            </div>

            {/* Dates */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 grid grid-cols-2 gap-4">
              <Input
                label={t('invoices.issueDate')}
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
              <Input
                label={t('invoices.dueDate')}
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
              <p className="text-sm font-bold text-gray-700">{t('invoices.items')}</p>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Input
                        label={idx === 0 ? 'Description' : ''}
                        value={item.description}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        placeholder="Développement web…"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label={idx === 0 ? 'Qté' : ''}
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                        min={1}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label={idx === 0 ? 'Prix HT' : ''}
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => updateItem(idx, 'unit_price', Number(e.target.value))}
                        min={0}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        label={idx === 0 ? 'TVA %' : ''}
                        type="number"
                        value={item.vat_rate}
                        onChange={(e) => updateItem(idx, 'vat_rate', Number(e.target.value))}
                        min={0}
                        max={100}
                      />
                    </div>
                    <div className="col-span-1 pb-1">
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(idx)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={addItem}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Plus size={14} /> {t('invoices.addItem')}
              </button>
            </div>

            {/* Totals */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{t('invoices.subtotal')}</span>
                <span className="font-semibold">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{t('invoices.vat')}</span>
                <span className="font-semibold">{vatAmount.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
                <span>{t('invoices.total')}</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <label className="text-sm font-bold text-gray-700 block mb-2">{t('invoices.notes')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Conditions de paiement, mentions légales…"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
              />
            </div>

            {/* Save button */}
            <Button
              onClick={handleSave}
              loading={saving}
              fullWidth
              size="lg"
              disabled={limitReached}
              style={{ backgroundColor: cfg.color, borderColor: cfg.color }}
            >
              {t('invoices.createBtn')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>}>
      <NewInvoiceContent />
    </Suspense>
  );
}
