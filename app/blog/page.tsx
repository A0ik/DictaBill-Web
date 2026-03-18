import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog DictaBill – Conseils facturation & freelance',
  description: 'Guides pratiques sur la facturation, la TVA, les devis et la gestion administrative pour freelances et auto-entrepreneurs.',
  alternates: { canonical: 'https://dictabill.com/blog' },
};

const ARTICLES = [
  {
    slug: 'facturation-freelance-2025',
    title: 'Comment facturer en 2025 quand on est freelance',
    excerpt: 'Mentions obligatoires, TVA, délais de paiement, outils — tout ce que vous devez savoir pour facturer correctement et rapidement en 2025.',
    date: '15 mars 2025',
    readTime: '6 min',
    tag: 'Facturation',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-black"><span className="text-primary-500">Dicta</span><span className="text-gray-900">Bill</span></span>
        </Link>
        <Link href="/register" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          Commencer gratuitement →
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-3">Blog DictaBill</h1>
          <p className="text-gray-500">Conseils pratiques sur la facturation, la gestion et la vie de freelance.</p>
        </div>

        <div className="space-y-6">
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className="group block bg-white rounded-2xl border border-gray-100 p-7 hover:border-primary-200 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{article.tag}</span>
                <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} /> {article.readTime} de lecture</span>
                <span className="text-xs text-gray-400">{article.date}</span>
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{article.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{article.excerpt}</p>
              <span className="text-primary-500 text-sm font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                Lire l'article <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t border-gray-100 py-8 text-center">
        <p className="text-xs text-gray-400">© 2025 DictaBill</p>
      </footer>
    </div>
  );
}
