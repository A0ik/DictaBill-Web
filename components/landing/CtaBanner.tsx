import Link from 'next/link';

export default function CtaBanner() {
  return (
    <section className="bg-[#0D0D0D] py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-5xl lg:text-6xl font-black text-white tracking-[-0.03em] leading-tight mb-6">
          Votre prochaine facture en 30 secondes.
        </h2>
        <p className="text-gray-400 text-lg mb-10">
          Rejoignez les freelances qui ont arrêté de perdre du temps sur la facturation.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base"
        >
          Commencer gratuitement
        </Link>
        <p className="text-gray-600 text-xs mt-6">
          Sans carte bancaire · Résiliation en 1 clic
        </p>
      </div>
    </section>
  );
}
