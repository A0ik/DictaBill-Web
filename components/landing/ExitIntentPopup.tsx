'use client';
import { useEffect, useState } from 'react';
import { X, Mic, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import DemoModal from '@/components/landing/DemoModal';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('exit-popup-dismissed')) return;

    // Desktop: detect mouse leaving viewport from the top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setVisible(true);
      }
    };

    // Mobile: show after 30 seconds of inactivity
    const timer = setTimeout(() => {
      if (!dismissed && !sessionStorage.getItem('exit-popup-dismissed')) {
        setVisible(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [dismissed]);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('exit-popup-dismissed', '1');
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4">
        <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm" onClick={dismiss} />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Icon */}
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-200">
            <Mic size={28} color="white" />
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Avant de partir…
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Essaie DictaBill en <strong>30 secondes</strong> — sans inscription, sans carte.<br />
            Dicte une facture, et vois le résultat en direct.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => { dismiss(); setDemoOpen(true); }}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary-200"
            >
              <Mic size={17} /> Essayer sans inscription
            </button>
            <Link
              href="/register"
              onClick={dismiss}
              className="w-full border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              Créer un compte gratuit <ArrowRight size={14} />
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-4">Aucune carte bancaire · 5 factures/mois offertes</p>
        </div>
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
