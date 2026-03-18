export default function StatsSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: big featured stat */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-6">
              DictaBill en chiffres
            </p>
            <p className="text-6xl font-black text-[#0D0D0D] leading-none mb-3">14 800</p>
            <p className="text-gray-500 text-base">factures créées par nos freelances</p>
          </div>

          {/* Right: 3 smaller stats in list format */}
          <div className="space-y-7">
            <div className="flex items-baseline gap-3 border-b border-gray-200 pb-7">
              <span className="text-2xl font-black text-[#0D0D0D]">28 sec</span>
              <span className="text-gray-400 text-sm">/</span>
              <span className="text-gray-500 text-sm">temps moyen de création</span>
            </div>
            <div className="flex items-baseline gap-3 border-b border-gray-200 pb-7">
              <span className="text-2xl font-black text-[#0D0D0D]">4,8/5</span>
              <span className="text-gray-400 text-sm">/</span>
              <span className="text-gray-500 text-sm">note moyenne utilisateurs</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-[#0D0D0D]">94 %</span>
              <span className="text-gray-400 text-sm">/</span>
              <span className="text-gray-500 text-sm">taux de conformité légale</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
