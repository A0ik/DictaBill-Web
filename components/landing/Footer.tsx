'use client';
import Link from 'next/link';
import { useT } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useT();
  return (
    <footer className="bg-gray-950 text-gray-400 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-1 mb-3">
              <span className="text-2xl font-black text-primary-400">Dicta</span>
              <span className="text-2xl font-black text-white">Bill</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">{t('footer.tagline')}</p>
            <p className="text-xs mt-4 text-gray-600">support@dictabill.com</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t('footer.product')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#features" className="hover:text-white transition-colors">{t('footer.links.features')}</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">{t('footer.links.pricing')}</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">{t('nav.start')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('footer.links.privacy')}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t('footer.links.terms')}</Link></li>
              <li><Link href="mailto:support@dictabill.com" className="hover:text-white transition-colors">{t('footer.links.contact')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs">{t('footer.copyright')}</p>
          <p className="text-xs">Made with ❤️ for freelancers</p>
        </div>
      </div>
    </footer>
  );
}
