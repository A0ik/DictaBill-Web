'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Building2, FileText, Send, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

const STEPS = [
  {
    icon: Building2,
    title: 'Votre entreprise',
    description: 'Ces informations apparaîtront sur toutes vos factures.',
  },
  {
    icon: FileText,
    title: 'Paramètres de facturation',
    description: 'Personnalisez la numérotation et le statut TVA.',
  },
  {
    icon: Mic,
    title: 'Essayez la dictée vocale',
    description: 'Créez votre première facture en 30 secondes.',
  },
];

const LEGAL_STATUSES = ['Auto-entrepreneur', 'EURL', 'SASU', 'SAS', 'SARL', 'EI', 'Autre'];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile } = useAuthStore();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    company_name: profile?.company_name || '',
    siret: profile?.siret || '',
    address: profile?.address || '',
    city: profile?.city || '',
    postal_code: profile?.postal_code || '',
    legal_status: profile?.legal_status || '',
    invoice_prefix: profile?.invoice_prefix || 'FACT',
    vat_number: profile?.vat_number || '',
  });

  const updateField = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleStep0 = async () => {
    if (!form.company_name.trim()) {
      toast.error('Le nom de votre entreprise est requis');
      return;
    }
    setStep(1);
  };

  const handleStep1 = () => setStep(2);

  const handleFinish = async () => {
    setSaving(true);
    try {
      await updateProfile({
        company_name: form.company_name || undefined,
        siret: form.siret || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        postal_code: form.postal_code || undefined,
        legal_status: form.legal_status || undefined,
        invoice_prefix: form.invoice_prefix || 'FACT',
        vat_number: form.vat_number || undefined,
        onboarding_done: true,
      });
      router.push('/invoices/new?mode=voice');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    try {
      await updateProfile({ onboarding_done: true });
    } catch {}
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Mic size={22} color="white" />
          </div>
          <p className="text-xl font-black"><span className="text-primary-500">Dicta</span><span className="text-gray-900">Bill</span></p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-primary-500 text-white' :
                i === step ? 'bg-primary-500 text-white ring-4 ring-primary-100' :
                'bg-gray-200 text-gray-400'
              }`}>
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 rounded-full transition-all ${i < step ? 'bg-primary-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {/* Step header */}
          <div className="flex items-center gap-3 mb-6">
            {(() => {
              const Icon = STEPS[step].icon;
              return (
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Icon size={20} className="text-primary-600" />
                </div>
              );
            })()}
            <div>
              <h1 className="text-lg font-black text-gray-900">{STEPS[step].title}</h1>
              <p className="text-sm text-gray-500">{STEPS[step].description}</p>
            </div>
          </div>

          {/* Step 0 — Company info */}
          {step === 0 && (
            <div className="space-y-4">
              <Input
                label="Nom de votre entreprise *"
                value={form.company_name}
                onChange={updateField('company_name')}
                placeholder="Freelance Dev / Studio Lea / ..."
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input label="SIRET" value={form.siret} onChange={updateField('siret')} placeholder="12345678900000" />
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Statut juridique</label>
                  <select
                    value={form.legal_status}
                    onChange={updateField('legal_status')}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    <option value="">—</option>
                    {LEGAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <Input label="Adresse" value={form.address} onChange={updateField('address')} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Code postal" value={form.postal_code} onChange={updateField('postal_code')} />
                <Input label="Ville" value={form.city} onChange={updateField('city')} />
              </div>
              <Button onClick={handleStep0} fullWidth className="gap-2 mt-2">
                Continuer <ArrowRight size={16} />
              </Button>
            </div>
          )}

          {/* Step 1 — Billing settings */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Input
                  label="Préfixe de facturation"
                  value={form.invoice_prefix}
                  onChange={updateField('invoice_prefix')}
                  placeholder="FACT"
                  hint="Vos factures seront numérotées FACT-2025-001, FACT-2025-002..."
                />
              </div>
              <Input
                label="Numéro de TVA intracommunautaire"
                value={form.vat_number}
                onChange={updateField('vat_number')}
                placeholder="FR12345678901 (laisser vide si non assujetti)"
              />
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-xs text-amber-800">
                <strong>Auto-entrepreneur ?</strong> Laissez le numéro de TVA vide. La mention "TVA non applicable, art. 293B CGI" sera ajoutée automatiquement.
              </div>
              <div className="flex gap-3 mt-2">
                <Button variant="ghost" onClick={() => setStep(0)} className="gap-1.5">
                  <ArrowLeft size={15} /> Retour
                </Button>
                <Button onClick={handleStep1} fullWidth className="gap-2">
                  Continuer <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 — Try voice */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-200">
                    <Mic size={28} color="white" />
                  </div>
                </div>
                <p className="text-center text-sm font-semibold text-gray-700 mb-2">Essayez maintenant :</p>
                <p className="text-center text-xs text-gray-500 leading-relaxed">
                  Dites par exemple : <em className="font-medium text-gray-700">"Facture pour Acme Corp, développement web, 2 000 euros HT, 30 jours"</em>
                </p>
              </div>

              <div className="space-y-3">
                <Button loading={saving} onClick={handleFinish} fullWidth className="gap-2">
                  <Mic size={16} /> Créer ma première facture
                </Button>
                <Button variant="ghost" fullWidth onClick={handleSkip} className="text-gray-400 text-sm">
                  Passer cette étape → aller au tableau de bord
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Skip link */}
        {step < 2 && (
          <p className="text-center mt-4 text-xs text-gray-400">
            <button onClick={handleSkip} className="hover:text-gray-600 underline">
              Passer l'onboarding et aller directement au tableau de bord
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
