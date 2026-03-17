import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DictaBill — Tu parles, on facture.',
  description: 'Créez des factures professionnelles en quelques secondes avec votre voix. IA, PDF, envoi email, paiement Stripe.',
  keywords: 'facturation, facture, devis, auto-entrepreneur, freelance, voix, IA',
  openGraph: {
    title: 'DictaBill — Tu parles, on facture.',
    description: 'Facturation vocale IA pour indépendants. Créez une facture en 30 secondes.',
    url: 'https://dictabill.com',
    siteName: 'DictaBill',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DictaBill — Tu parles, on facture.',
    description: 'Facturation vocale IA pour indépendants.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
