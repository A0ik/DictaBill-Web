const STATS = [
  { value: '127 000+', label: 'Factures créées' },
  { value: '< 30 sec', label: 'Temps moyen de création' },
  { value: '4,9 / 5', label: 'Note utilisateurs' },
  { value: '98 %', label: 'Conformité légale' },
];

export default function StatsSection() {
  return (
    <section className="bg-gray-900 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-white mb-1">{value}</p>
              <p className="text-sm text-gray-400 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
