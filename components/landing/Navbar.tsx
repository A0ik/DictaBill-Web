'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Mic } from 'lucide-react';
import { useT } from '@/hooks/useTranslation';

export default function Navbar() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)]'
          : 'bg-white/95 backdrop-blur-md'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-[#0D0D0D] rounded-md flex items-center justify-center group-hover:bg-gray-800 transition-colors">
            <Mic size={14} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-black tracking-tight text-[#0D0D0D]">DictaBill</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          <Link href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors">
            {t('nav.features')}
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors">
            {t('nav.pricing')}
          </Link>
          <Link href="/blog" className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors">
            Blog
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 transition-colors"
          >
            {t('nav.login')}
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold bg-[#0D0D0D] hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {t('nav.start')}
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1 shadow-lg">
          <Link
            href="#features"
            className="text-sm font-medium text-gray-600 py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            {t('nav.features')}
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-600 py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            {t('nav.pricing')}
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            {t('nav.login')}
          </Link>
          <div className="pt-2 border-t border-gray-100 mt-1">
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="block w-full text-center text-sm font-semibold bg-[#0D0D0D] hover:bg-gray-800 text-white px-4 py-3 rounded-lg transition-colors"
            >
              {t('nav.start')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
