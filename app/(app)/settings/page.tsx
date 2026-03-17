'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, Lock, ExternalLink, LogOut, AlertTriangle, Check } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useSubscription } from '@/hooks/useSubscription';
import { useT } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
import AppHeader from '@/components/app/AppHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const TEMPLATES = [
  { id: 1, name: 'Classique', preview: 'bg-white border-l-4 border-primary-500' },
  { id: 2, name: 'Moderne', preview: 'bg-gray-900 border-l-4 border-primary-500' },
  { id: 3, name: 'Minimaliste', preview: 'bg-gray-50 border-l-4 border-gray-300' },
];

const LEGAL_STATUSES = ['Auto-entrepreneur', 'EURL', 'SASU', 'SAS', 'SARL', 'SA', 'EI', 'Autre'];
const ACCENT_COLORS = ['#1D9E75', '#2563EB', '#7C3AED', '#DC2626', '#EA580C', '#0891B2', '#374151'];

export default function SettingsPage() {
  const router = useRouter();
  const { t, lang, i18n } = useT();
  const { profile, updateProfile, signOut } = useAuthStore();
  const { tier, isFree, isPro } = useSubscription();

  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    company_name: '',
    siret: '',
    address: '',
    city: '',
    postal_code: '',
    phone: '',
    vat_number: '',
    legal_status: '',
    invoice_prefix: '',
    logo_url: '',
    template_id: 1,
    accent_color: '#1D9E75',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        company_name: profile.company_name || '',
        siret: profile.siret || '',
        address: profile.address || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
        phone: profile.phone || '',
        vat_number: profile.vat_number || '',
        legal_status: profile.legal_status || '',
        invoice_prefix: profile.invoice_prefix || 'FACT',
        logo_url: profile.logo_url || '',
        template_id: profile.template_id || 1,
        accent_color: profile.accent_color || '#1D9E75',
      });
    }
  }, [profile]);

  // Check success from Stripe redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
      toast.success('Abonnement activé ! Merci 🎉');
      window.history.replaceState({}, '', '/settings');
    }
  }, []);

  const updateField = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        company_name: form.company_name || undefined,
        siret: form.siret || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        postal_code: form.postal_code || undefined,
        phone: form.phone || undefined,
        vat_number: form.vat_number || undefined,
        legal_status: form.legal_status || undefined,
        invoice_prefix: form.invoice_prefix || 'FACT',
        logo_url: form.logo_url || undefined,
        template_id: form.template_id,
        accent_color: form.accent_color,
      });
      toast.success(t('settings.saved'));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${profile?.id}/logo.${ext}`;
      const { error } = await supabase.storage.from('logos').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('logos').getPublicUrl(path);
      setForm((prev) => ({ ...prev, logo_url: data.publicUrl }));
      toast.success('Logo uploadé !');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error(data.error);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const tierLabels: Record<string, string> = {
    free: t('common.free'),
    solo: 'Solo',
    pro: 'Pro',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title={t('settings.title')} />

      <div className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full space-y-6">
        {/* Company info */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-900">{t('settings.company')}</h2>

          {/* Logo */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">{t('settings.logo')}</p>
            <div className="flex items-center gap-4">
              {form.logo_url ? (
                <img src={form.logo_url} alt="Logo" className="h-16 w-auto rounded-xl border border-gray-100 object-contain" />
              ) : (
                <div className="h-16 w-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-400">Logo</span>
                </div>
              )}
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  size="sm"
                  loading={logoUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload size={14} />
                  {form.logo_url ? t('settings.changeLogo') : t('settings.uploadLogo')}
                </Button>
                {form.logo_url && (
                  <button
                    onClick={() => setForm((prev) => ({ ...prev, logo_url: '' }))}
                    className="block text-xs text-red-500 hover:underline"
                  >
                    {t('settings.removeLogo')}
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label={t('settings.companyName')} value={form.company_name} onChange={updateField('company_name')} />
            <Input label={t('settings.siret')} value={form.siret} onChange={updateField('siret')} />
            <Input label={t('settings.address')} value={form.address} onChange={updateField('address')} />
            <Input label={t('settings.city')} value={form.city} onChange={updateField('city')} />
            <Input label={t('settings.postal')} value={form.postal_code} onChange={updateField('postal_code')} />
            <Input label={t('settings.phone')} value={form.phone} onChange={updateField('phone')} />
            <Input label={t('settings.vat')} value={form.vat_number} onChange={updateField('vat_number')} />
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">{t('settings.legalStatus')}</label>
              <select
                value={form.legal_status}
                onChange={updateField('legal_status')}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                <option value="">—</option>
                {LEGAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Input label={t('settings.invoicePrefix')} value={form.invoice_prefix} onChange={updateField('invoice_prefix')} hint="ex: FACT, FAC, INV" />
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-900">{t('settings.appearance')}</h2>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-3">{t('settings.templates')}</p>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setForm((prev) => ({ ...prev, template_id: tmpl.id }))}
                  className={cn(
                    'p-3 rounded-xl border-2 transition-all text-left',
                    form.template_id === tmpl.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className={`h-12 rounded-lg ${tmpl.preview} mb-2`} />
                  <p className="text-xs font-semibold text-gray-700">{tmpl.name}</p>
                  {form.template_id === tmpl.id && (
                    <Check size={14} className="text-primary-600 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-3">{t('settings.accentColor')}</p>
            <div className="flex gap-2 flex-wrap">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setForm((prev) => ({ ...prev, accent_color: color }))}
                  style={{ backgroundColor: color }}
                  className={cn(
                    'w-9 h-9 rounded-full transition-all',
                    form.accent_color === color ? 'ring-2 ring-offset-2 ring-gray-700 scale-110' : 'hover:scale-105'
                  )}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t('settings.language')}</h2>
          <div className="flex gap-3">
            <button
              onClick={() => i18n.changeLanguage('fr')}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all',
                lang === 'fr' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              )}
            >
              🇫🇷 {t('settings.langFr')}
            </button>
            <button
              onClick={() => i18n.changeLanguage('en')}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all',
                lang === 'en' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              )}
            >
              🇬🇧 {t('settings.langEn')}
            </button>
          </div>
        </section>

        {/* Subscription */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">{t('settings.subscription')}</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{t('settings.currentPlan')} :</span>
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-bold',
              tier === 'free' ? 'bg-gray-100 text-gray-600' :
              tier === 'solo' ? 'bg-primary-100 text-primary-700' :
              'bg-gray-900 text-white'
            )}>
              {tierLabels[tier] || tier}
            </span>
          </div>
          {isFree ? (
            <Button onClick={() => router.push('/pricing')} className="gap-2">
              <ExternalLink size={15} />
              {t('settings.upgrade')}
            </Button>
          ) : (
            <Button variant="outline" loading={portalLoading} onClick={handleManageSubscription} className="gap-2">
              <ExternalLink size={15} />
              {t('settings.manageSub')}
            </Button>
          )}
        </section>

        {/* Stripe (Pro only) */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
          <h2 className="text-lg font-bold text-gray-900">{t('settings.stripe')}</h2>
          {isPro ? (
            <>
              <p className="text-sm text-gray-500">{t('settings.stripeDesc')}</p>
              {profile?.stripe_account_id ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                  <Check size={16} /> {t('settings.stripeConnected')}
                </div>
              ) : (
                <Button variant="outline" className="gap-2">
                  <ExternalLink size={15} />
                  {t('settings.connectStripe')}
                </Button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Lock size={15} />
              {t('settings.stripeProOnly')}
            </div>
          )}
        </section>

        {/* Save */}
        <Button onClick={handleSave} loading={saving} fullWidth size="lg">
          {t('settings.save')}
        </Button>

        {/* Danger zone */}
        <section className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 space-y-3">
          <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle size={18} /> {t('settings.danger')}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" onClick={handleSignOut} className="gap-2 text-gray-600">
              <LogOut size={15} /> {t('settings.logout')}
            </Button>
            <Button
              variant="danger"
              onClick={() => toast.error('Contactez le support pour supprimer votre compte.')}
              className="gap-2"
            >
              <AlertTriangle size={15} /> {t('settings.deleteAccount')}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
