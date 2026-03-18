'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useT } from '@/hooks/useTranslation';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useT();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = t('auth.errors.emailRequired');
    if (!password) newErrors.password = t('auth.errors.passwordRequired');
    else if (password.length < 8) newErrors.password = t('auth.errors.passwordMin');
    if (password !== confirmPassword) newErrors.confirmPassword = t('auth.errors.passwordMatch');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
      toast.success(t('auth.registerBtn'));
      router.push('/onboarding');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-1">
          <span className="text-3xl font-black text-primary-500">Dicta</span>
          <span className="text-3xl font-black text-gray-900">Bill</span>
        </Link>
        <p className="text-gray-500 text-sm mt-2">{t('auth.registerSub')}</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-2xl font-black text-gray-900 mb-6">{t('auth.registerTitle')}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('auth.name')}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jean Dupont"
          />
          <Input
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            error={errors.email}
            required
          />
          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            required
          />
          <Input
            label={t('auth.confirmPassword')}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.confirmPassword}
            required
          />
          <Button type="submit" loading={loading} fullWidth size="lg">
            {t('auth.registerBtn')}
          </Button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-3">{t('auth.terms')}</p>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-gray-400">{t('auth.orWith')}</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-semibold text-sm text-gray-700"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {t('auth.google')}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('auth.hasAccount')}{' '}
          <Link href="/login" className="text-primary-600 font-semibold hover:underline">
            {t('auth.loginLink')}
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
}
