export default function Testimonials() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Featured large quote */}
        <div className="text-center mb-20">
          <div
            className="text-[120px] leading-none font-serif text-primary-100 select-none"
            aria-hidden="true"
          >
            "
          </div>
          <blockquote className="-mt-10">
            <p className="text-2xl font-medium text-[#0D0D0D] leading-relaxed max-w-2xl mx-auto">
              J'ai créé ma première facture pendant que je raccrochais le téléphone avec mon client.
              Mon comptable n'en revient pas.
            </p>
            <footer className="mt-8 flex items-center justify-center gap-3">
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: '#1D9E75' }}
              />
              <div className="text-left">
                <p className="text-sm font-semibold text-[#0D0D0D]">Camille R.</p>
                <p className="text-xs text-gray-400">Consultante SEO, Paris</p>
              </div>
            </footer>
          </blockquote>
        </div>

        {/* Two smaller quotes */}
        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <blockquote className="border border-gray-100 rounded-2xl p-6">
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              "Finies les nuits à faire de la paperasse. Je dicte, DictaBill génère, j'envoie.
              Ça prend moins de temps que de trouver le bon template Word."
            </p>
            <footer className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full shrink-0"
                style={{ backgroundColor: '#2563EB' }}
              />
              <div>
                <p className="text-sm font-semibold text-[#0D0D0D]">Mehdi L.</p>
                <p className="text-xs text-gray-400">Développeur freelance</p>
              </div>
            </footer>
          </blockquote>

          <blockquote className="border border-gray-100 rounded-2xl p-6">
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              "J'avais peur que ce soit un gadget. Après 3 mois, c'est l'outil que j'ouvre en premier."
            </p>
            <footer className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full shrink-0"
                style={{ backgroundColor: '#8B5CF6' }}
              />
              <div>
                <p className="text-sm font-semibold text-[#0D0D0D]">Lucie V.</p>
                <p className="text-xs text-gray-400">Designer UX, Lyon</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
