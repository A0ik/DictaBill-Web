import Link from 'next/link';
import { Mic, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mic size={28} className="text-primary-500" />
        </div>
        <h1 className="text-7xl font-black text-gray-900 mb-2">404</h1>
        <p className="text-xl font-bold text-gray-700 mb-2">Page introuvable</p>
        <p className="text-gray-500 text-sm mb-8">
          Cette page n'existe pas ou a été déplacée. Pas de panique.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            <Home size={16} />
            Retour à l'accueil
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
          >
            <ArrowLeft size={16} />
            Mon tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
