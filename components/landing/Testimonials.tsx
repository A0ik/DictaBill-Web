export default function Testimonials() {
  return (
    <section className="py-28 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16 max-w-sm">
          <h2 className="text-4xl sm:text-5xl font-black text-[#0D0D0D] tracking-[-0.02em] leading-tight">
            Ce qu&apos;ils en disent.
          </h2>
        </div>

        {/* Featured quote — dark card */}
        <div className="grid lg:grid-cols-[3fr_2fr] gap-6 mb-6">
          <div className="bg-[#0D0D0D] rounded-3xl p-10 flex flex-col justify-between min-h-[280px]">
            <p className="text-xl sm:text-2xl font-medium text-white leading-snug mb-10">
              &ldquo;Je facturais en fin de journée, souvent le soir tard. Maintenant je le fais dans le taxi en rentrant du client. Le truc c&apos;est que j&apos;oublie plus jamais de facturer.&rdquo;
            </p>
            <div>
              <p className="text-sm font-semibold text-white">Camille R.</p>
              <p className="text-xs text-gray-500 mt-0.5">Consultante SEO, Paris · indépendante depuis 4 ans</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="border border-gray-200 rounded-3xl p-8 flex flex-col justify-between flex-1">
              <p className="text-base font-medium text-[#0D0D0D] leading-snug mb-6">
                &ldquo;J&apos;ai testé par curiosité. Ma première facture : 28 secondes chrono. C&apos;est la seule façon que j&apos;utilise maintenant.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-[#0D0D0D]">Mehdi L.</p>
                <p className="text-xs text-gray-400 mt-0.5">Développeur freelance, Lyon</p>
              </div>
            </div>

            <div className="bg-primary-50 rounded-3xl p-8 flex flex-col justify-between flex-1">
              <p className="text-base font-medium text-[#0D0D0D] leading-snug mb-6">
                &ldquo;Mes devis partent le jour même. Avant j&apos;attendais d&apos;avoir du temps pour &lsquo;bien faire&rsquo; — du coup je les envoyais jamais.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-[#0D0D0D]">Lucie V.</p>
                <p className="text-xs text-gray-400 mt-0.5">Designer UX, remote</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <p className="text-center text-sm text-gray-400 pt-4">
          1 247 freelances utilisent DictaBill chaque semaine.
        </p>
      </div>
    </section>
  );
}
