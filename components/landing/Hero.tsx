'use client';
import Link from 'next/link';
import { useState } from 'react';
import DemoModal from '@/components/landing/DemoModal';

export default function Hero() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-white bg-grid pt-16 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 flex flex-col items-center text-center">

          {/* Tag */}
          <span className="inline-block border border-gray-200 text-gray-500 text-xs font-medium px-3 py-1 rounded-full mb-10 tracking-wide">
            Facturation vocale · Pour les indépendants
          </span>

          {/* Main headline — specific & opinionated */}
          <h1 className="text-6xl sm:text-7xl lg:text-[88px] font-black tracking-[-0.04em] leading-[0.92] mb-8">
            <span className="block text-gray-400">Vous avez mieux à faire</span>
            <span className="block text-[#0D0D0D] relative">
              que vos{' '}
              <span className="relative inline-block">
                factures.
                <svg
                  className="absolute -bottom-2 left-0 w-full overflow-visible"
                  viewBox="0 0 420 10"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7 Q55 2 105 6 Q160 10 210 5 Q265 0 315 5 Q365 9 418 4"
                    stroke="#1D9E75"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </span>
          </h1>

          {/* Subtitle — direct, no buzzwords */}
          <p className="text-lg text-gray-500 max-w-md mx-auto mt-6 leading-relaxed mb-10">
            Dictez en une phrase. DictaBill génère la facture, la met en page et l'envoie au client.
            Trente secondes, pas trente minutes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-[#0D0D0D] hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Commencer gratuitement
            </Link>
            <button
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors"
            >
              Voir une démo <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* Social proof — sans cercles colorés */}
          <p className="text-sm text-gray-400">
            Déjà utilisé par <span className="text-gray-700 font-semibold">1 247 freelances</span> en France
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100" />
      </section>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
