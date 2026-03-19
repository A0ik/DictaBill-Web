import Link from 'next/link';
import Image from 'next/image';
import { Mic, FileText, Send, TrendingUp } from 'lucide-react';

const SCREENS = [
  {
    icon: Mic,
    title: 'Dictée vocale',
    description: 'Parlez naturellement. L\'IA extrait client, montants et dates automatiquement.',
  },
  {
    icon: FileText,
    title: 'Facture générée',
    description: 'Document PDF conforme aux normes françaises, numéroté et signé.',
  },
  {
    icon: Send,
    title: 'Envoi instantané',
    description: 'Expédiée par email en un clic. Votre client reçoit une facture professionnelle.',
  },
  {
    icon: TrendingUp,
    title: 'Suivi en temps réel',
    description: 'Tableau de bord CA, factures en attente, relances automatiques.',
  },
];

export default function AppPreviewSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — feature list */}
          <div>
            <p className="text-xs font-bold text-primary-600 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-full inline-block mb-5 uppercase tracking-widest">
              L'application complète
            </p>
            <h2 className="text-4xl font-black text-gray-900 leading-tight mb-5">
              Tout ce dont un freelance a besoin.<br />
              <span className="text-primary-500">Rien de superflu.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              DictaBill n'est pas un tableur déguisé. C'est un outil pensé pour les indépendants qui facturent vite et veulent être payés encore plus vite.
            </p>

            <div className="space-y-5">
              {SCREENS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Icon size={18} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-primary-200/60"
              >
                <Mic size={16} />
                Essayer gratuitement
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-6 py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>

          {/* Right — App screenshot */}
          <div className="relative flex justify-center lg:justify-end pb-6 lg:pb-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 w-full max-w-md">
              {/* Browser chrome */}
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 font-mono text-center">
                  app.dictabill.com
                </div>
              </div>
              {/* Screenshot — replace /public/images/app-dashboard.png with your own capture */}
              <div className="relative" style={{ aspectRatio: '16/10', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)' }}>
                <Image
                  src="/images/app-dashboard.png"
                  alt="DictaBill — tableau de bord facturation"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">CA ce mois</p>
                <p className="font-black text-gray-900 text-sm">+12 400 €</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
