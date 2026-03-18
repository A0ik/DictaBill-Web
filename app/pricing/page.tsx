import I18nProvider from '@/components/I18nProvider';
import Navbar from '@/components/landing/Navbar';
import PricingAnimated from '@/components/landing/PricingAnimated';
import CtaBanner from '@/components/landing/CtaBanner';
import Footer from '@/components/landing/Footer';

const FAQ = [
  {
    q: 'Puis-je annuler à tout moment ?',
    a: 'Oui, sans engagement. Vous pouvez annuler votre abonnement depuis les paramètres à tout moment.',
  },
  {
    q: 'Est-ce que mes données sont sécurisées ?',
    a: 'Vos données sont stockées sur Supabase (hébergé en Europe) et chiffrées en transit et au repos.',
  },
  {
    q: 'Que se passe-t-il quand j\'atteins la limite de 5 factures en plan gratuit ?',
    a: 'Vous ne pouvez plus créer de nouvelles factures jusqu\'au mois suivant ou jusqu\'à la mise à niveau vers Solo.',
  },
  {
    q: 'La facturation vocale fonctionne-t-elle en anglais ?',
    a: 'Oui, DictaBill est disponible en français et en anglais. La dictée vocale comprend les deux langues.',
  },
  {
    q: 'Puis-je passer de Solo à Pro ?',
    a: 'Oui, la mise à niveau est immédiate. Vous pouvez également rétrograder à la fin de votre période de facturation.',
  },
];

function FaqSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900">Questions fréquentes</h2>
        </div>
        <div className="space-y-4">
          {FAQ.map(({ q, a }, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">{q}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <PricingAnimated />
          <FaqSection />
          <CtaBanner />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
