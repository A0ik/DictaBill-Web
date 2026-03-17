'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useT } from '@/hooks/useTranslation';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { t, i18n } = useT();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary-500">Dicta</span>
          <span className="text-2xl font-black text-gray-900">Bill</span>
          <span className="ml-1 text-xs bg-primary-100 text-primary-600 font-bold px-2 py-0.5 rounded-full">IA</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">{t('nav.features')}</Link>
          <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">{t('nav.pricing')}</Link>
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')}
            className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors"
          >
            {i18n.language === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
          </button>
          <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors">{t('nav.login')}</Link>
          <Link href="/register">
            <Button size="sm">{t('nav.start')}</Button>
          </Link>
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <Link href="#features" className="text-sm font-medium py-2" onClick={() => setOpen(false)}>{t('nav.features')}</Link>
          <Link href="/pricing" className="text-sm font-medium py-2" onClick={() => setOpen(false)}>{t('nav.pricing')}</Link>
          <Link href="/login" className="text-sm font-medium py-2" onClick={() => setOpen(false)}>{t('nav.login')}</Link>
          <Link href="/register" onClick={() => setOpen(false)}>
            <Button fullWidth>{t('nav.start')}</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
