'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, MapPin, FileText, ChevronRight, Loader2, Check, Search } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { searchEntreprises, SireneResult } from '@/lib/sirene';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

const LEGAL_STATUSES = [
  'Auto-entrepreneur', 'EIRL', 'EURL', 'SARL', 'SAS', 'SASU', 'SA', 'EI', 'Autre',
];

const STEPS = [
  { id: 1, label: 'Entreprise', icon: Building2 },
  { id: 2, label: 'Adresse', icon: MapPin },
  { id: 3, label: 'Facturation', icon: FileText },
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/dashboard';
  const { user, profile, updateProfile, initialize, initialized } = useAuthStore();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1 — Entreprise
  const [companyName, setCompanyName] = useState('');
  const [legalStatus, setLegalStatus] = useState('Auto-entrepreneur');
  const [siret, setSiret] = useState('');
  const [vatNumber, setVatNumber] = useState('');

  // Step 2 — Adresse
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');

  // Step 3 — Facturation
  const [phone, setPhone] = useState('');
  const [invoicePrefix, setInvoicePrefix] = useState('FACT');

  // SIRENE autocomplete
  const [searchResults, setSearchResults] = useState<SireneResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (initialized && !user) {
      router.push('/register?next=' + encodeURIComponent(nextUrl));
    }
  }, [initialized, user, nextUrl, router]);

  // Prefill if profile already has data
  useEffect(() => {
    if (profile) {
      if (profile.company_name) setCompanyName(profile.company_name);
      if (profile.legal_status) setLegalStatus(profile.legal_status);
      if (profile.siret) setSiret(profile.siret);
      if (profile.vat_number) setVatNumber(profile.vat_number);
      if (profile.address) setAddress(profile.address);
      if (profile.postal_code) setPostalCode(profile.postal_code);
      if (profile.city) setCity(profile.city);
      if (profile.phone) setPhone(profile.phone);
      if (profile.invoice_prefix) setInvoicePrefix(profile.invoice_prefix);
    }
  }, [profile]);

  // SIRENE search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (companyName.trim().length < 2) { setSearchResults([]); setShowDropdown(false); return; }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      const results = await searchEntreprises(companyName);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
      setSearching(false);
    }, 350);
  }, [companyName]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const applyResult = (r: SireneResult) => {
    setCompanyName(r.nom_complet || r.nom_raison_sociale);
    setSiret(r.siret);
    setAddress(r.adresse);
    setPostalCode(r.code_postal);
    setCity(r.ville);
    // Map nature_juridique to legal status
    const nj = r.nature_juridique;
    if (nj === '1000') setLegalStatus('Auto-entrepreneur');
    else if (nj === '5498' || nj === '5499') setLegalStatus('SARL');
    else if (nj === '5710') setLegalStatus('SAS');
    else if (nj === '5720') setLegalStatus('SASU');
    else if (nj === '5308') setLegalStatus('EURL');
    else if (nj === '6540') setLegalStatus('SA');
    setShowDropdown(false);
    // Jump to step 2 if on step 1 and data is filled
    if (step === 1) setTimeout(() => setStep(2), 300);
  };

  const handleSaveAndContinue = async () => {
    if (step === 1 && !companyName.trim()) {
      toast.error('Le nom de votre entreprise est requis');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        company_name: companyName,
        legal_status: legalStatus,
        siret,
        vat_number: vatNumber,
        address,
        postal_code: postalCode,
        city,
        phone,
        invoice_prefix: invoicePrefix || 'FACT',
      } as any);
      if (step < 3) {
        setStep(step + 1);
      } else {
        toast.success('Profil configuré !');
        router.push(nextUrl);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    if (step < 3) setStep(step + 1);
    else router.push(nextUrl);
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-black text-primary-500">Dicta</span>
          <span className="text-3xl font-black text-gray-900">Bill</span>
          <p className="text-gray-500 text-sm mt-2">Configuration de votre compte</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                step === s.id
                  ? 'bg-primary-500 text-white'
                  : step > s.id
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s.id ? <Check size={12} /> : <s.icon size={12} />}
                {s.label}
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight size={14} className="text-gray-300" />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

          {/* STEP 1 — Entreprise */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-gray-900">Votre entreprise</h2>
                <p className="text-sm text-gray-500 mt-1">Tapez le nom pour auto-compléter depuis le registre officiel</p>
              </div>

              {/* SIRENE autocomplete */}
              <div className="relative" ref={dropdownRef}>
                <div className="relative">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Nom de votre entreprise ou SIRET..."
                    className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-sm font-medium transition-colors"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {searching
                      ? <Loader2 size={16} className="animate-spin text-gray-400" />
                      : <Search size={16} className="text-gray-400" />
                    }
                  </div>
                </div>

                {showDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
                    {searchResults.map((r, i) => (
                      <button
                        key={r.siret || i}
                        type="button"
                        onClick={() => applyResult(r)}
                        className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <p className="text-sm font-semibold text-gray-900 truncate">{r.nom_complet || r.nom_raison_sociale}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          SIRET {r.siret} · {r.ville} {r.code_postal}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Legal status */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Statut juridique</label>
                <div className="flex flex-wrap gap-2">
                  {LEGAL_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setLegalStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                        legalStatus === s
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="SIRET"
                value={siret}
                onChange={(e) => setSiret(e.target.value)}
                placeholder="123 456 789 01234"
              />
              <Input
                label="Numéro TVA intracommunautaire (optionnel)"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                placeholder="FR12345678901"
              />
            </div>
          )}

          {/* STEP 2 — Adresse */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-gray-900">Adresse professionnelle</h2>
                <p className="text-sm text-gray-500 mt-1">Elle apparaîtra sur toutes vos factures</p>
              </div>
              <Input
                label="Adresse"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="12 rue de la Paix"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Code postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="75001"
                />
                <Input
                  label="Ville"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Paris"
                />
              </div>
              <Input
                label="Téléphone (optionnel)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 00 00 00 00"
              />
            </div>
          )}

          {/* STEP 3 — Facturation */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-gray-900">Préférences de facturation</h2>
                <p className="text-sm text-gray-500 mt-1">Personnalisez votre numérotation</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Préfixe des numéros de facture
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 8))}
                    className="w-32 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-sm font-mono font-bold tracking-widest transition-colors"
                    placeholder="FACT"
                  />
                  <span className="text-gray-400 text-sm">→ {invoicePrefix || 'FACT'}-2024-001</span>
                </div>
              </div>

              {/* Récap */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2 mt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Récapitulatif</p>
                {companyName && <div className="flex justify-between text-sm"><span className="text-gray-500">Entreprise</span><span className="font-semibold text-gray-900 truncate ml-4 max-w-[200px]">{companyName}</span></div>}
                {siret && <div className="flex justify-between text-sm"><span className="text-gray-500">SIRET</span><span className="font-semibold text-gray-900">{siret}</span></div>}
                {address && <div className="flex justify-between text-sm"><span className="text-gray-500">Adresse</span><span className="font-semibold text-gray-900 truncate ml-4 max-w-[200px]">{address}, {city}</span></div>}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-500 hover:border-gray-300 transition-all"
            >
              Passer cette étape
            </button>
            <Button
              onClick={handleSaveAndContinue}
              loading={saving}
              className="flex-2"
              style={{ flex: 2 }}
            >
              {step < 3 ? 'Continuer →' : nextUrl.includes('/checkout') ? 'Continuer vers le paiement →' : 'Terminer la configuration →'}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Vous pourrez modifier ces informations dans vos réglages
        </p>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-500" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
