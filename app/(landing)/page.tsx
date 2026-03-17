import I18nProvider from '@/components/I18nProvider';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import PricingSection from '@/components/landing/PricingSection';
import Testimonials from '@/components/landing/Testimonials';
import CtaBanner from '@/components/landing/CtaBanner';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <I18nProvider>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <PricingSection />
        <CtaBanner />
      </main>
      <Footer />
    </I18nProvider>
  );
}
