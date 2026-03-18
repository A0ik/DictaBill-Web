'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Globe, Mic } from 'lucide-react';
import { useT } from '@/hooks/useTranslation';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { t, i18n } = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-white/95 backdrop-blur-xl'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-primary-600 transition-colors">
            <Mic size={16} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-tight">
            <span className="text-primary-500">Dicta</span>
            <span className="text-gray-900">Bill</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">{t('nav.features')}</Link>
          <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">{t('nav.pricing')}</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
          >
            <Globe size={14} />
            {i18n.language === 'fr' ? 'EN' : 'FR'}
          </button>
          <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-primary-600 px-3 py-2 transition-colors">{t('nav.login')}</Link>
          <Link href="/register">
            <Button size="sm">{t('nav.start')}</Button>
          </Link>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-2 shadow-lg">
          <Link href="#features" className="text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50" onClick={() => setOpen(false)}>{t('nav.features')}</Link>
          <Link href="/pricing" className="text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50" onClick={() => setOpen(false)}>{t('nav.pricing')}</Link>
          <Link href="/login" className="text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50" onClick={() => setOpen(false)}>{t('nav.login')}</Link>
          <div className="pt-2 border-t border-gray-100 mt-1">
            <Link href="/register" onClick={() => setOpen(false)}>
              <Button fullWidth>{t('nav.start')}</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
