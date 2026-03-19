'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[AppError]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="text-center max-w-sm space-y-5">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900">Une erreur est survenue</h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Quelque chose ne s&apos;est pas passé comme prévu. Tu peux réessayer ou revenir au tableau de bord.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-[#1D9E75] text-white text-sm font-semibold rounded-xl hover:bg-[#178a65] transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
