import I18nProvider from '@/components/I18nProvider';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import TrustBar from '@/components/landing/TrustBar';
import StatsSection from '@/components/landing/StatsSection';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import AppPreviewSection from '@/components/landing/AppPreviewSection';
import Testimonials from '@/components/landing/Testimonials';
import PricingSection from '@/components/landing/PricingSection';
import CtaBanner from '@/components/landing/CtaBanner';
import Footer from '@/components/landing/Footer';
import ExitIntentPopup from '@/components/landing/ExitIntentPopup';

export default function LandingPage() {
  return (
    <I18nProvider>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <StatsSection />
        <Features />
        <HowItWorks />
        <AppPreviewSection />
        <Testimonials />
        <PricingSection />
        <CtaBanner />
      </main>
      <Footer />
      <ExitIntentPopup />
    </I18nProvider>
  );
}
