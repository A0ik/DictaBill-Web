'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Mic } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useT } from '@/hooks/useTranslation';

export default function Navbar() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 60);
  });

  return (
    <>
      <motion.header
        initial={false}
        animate={scrolled ? 'pill' : 'full'}
        variants={{
          full: {
            top: 0,
            left: 0,
            right: 0,
            borderRadius: 0,
            paddingLeft: 0,
            paddingRight: 0,
            maxWidth: '100%',
            margin: '0',
            boxShadow: 'none',
            backgroundColor: 'rgba(255,255,255,0.95)',
          },
          pill: {
            top: 12,
            left: '50%',
            right: 'auto',
            borderRadius: 999,
            paddingLeft: 0,
            paddingRight: 0,
            maxWidth: 720,
            margin: '0',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            backgroundColor: 'rgba(255,255,255,0.92)',
          },
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        style={scrolled ? { translateX: '-50%' } : { translateX: 0 }}
        className="fixed z-50 backdrop-blur-xl border border-transparent"
        data-scrolled={scrolled ? 'true' : 'false'}
      >
        <nav
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'h-12 px-4 gap-2' : 'h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-7 h-7 bg-[#0D0D0D] rounded-md flex items-center justify-center group-hover:bg-gray-800 transition-colors">
              <Mic size={14} color="white" strokeWidth={2.5} />
            </div>
            <motion.span
              animate={{ opacity: scrolled ? 0 : 1, width: scrolled ? 0 : 'auto' }}
              transition={{ duration: 0.25 }}
              className="text-lg font-black tracking-tight text-[#0D0D0D] overflow-hidden whitespace-nowrap"
            >
              DictaBill
            </motion.span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {[
              { href: '#features', label: t('nav.features') },
              { href: '/pricing', label: t('nav.pricing') },
              { href: '/blog', label: 'Blog' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium text-gray-500 hover:text-gray-900 rounded-lg transition-colors ${
                  scrolled ? 'text-xs px-2.5 py-1.5' : 'text-sm px-3 py-2'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className={`font-medium text-gray-500 hover:text-gray-900 transition-colors ${
                scrolled ? 'text-xs px-2.5 py-1.5' : 'text-sm px-3 py-2'
              }`}
            >
              {t('nav.login')}
            </Link>
            <Link
              href="/register"
              className={`font-semibold bg-[#0D0D0D] hover:bg-gray-800 text-white rounded-lg transition-all ${
                scrolled ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2'
              }`}
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
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[64px] left-0 right-0 z-40 md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1 shadow-lg"
          >
            {[
              { href: '#features', label: t('nav.features') },
              { href: '/pricing', label: t('nav.pricing') },
              { href: '/login', label: t('nav.login') },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 mt-1">
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="block w-full text-center text-sm font-semibold bg-[#0D0D0D] hover:bg-gray-800 text-white px-4 py-3 rounded-lg transition-colors"
              >
                {t('nav.start')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
