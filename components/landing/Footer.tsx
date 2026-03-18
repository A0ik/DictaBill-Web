import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-gray-500 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-16 mb-14">
          {/* Brand */}
          <div>
            <p className="text-white font-black text-xl mb-3">DictaBill</p>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              La facturation vocale pour les freelances qui ont mieux à faire.
            </p>
            <p className="text-gray-700 text-xs mt-5">support@dictabill.com</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-gray-400 font-medium text-xs uppercase tracking-widest mb-5">Produit</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#features" className="text-gray-500 hover:text-gray-200 transition-colors">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-500 hover:text-gray-200 transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-500 hover:text-gray-200 transition-colors">
                  Commencer
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-gray-400 font-medium text-xs uppercase tracking-widest mb-5">Légal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-gray-200 transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-gray-200 transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="mailto:support@dictabill.com" className="text-gray-500 hover:text-gray-200 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-700 text-xs">
            © {new Date().getFullYear()} DictaBill. Tous droits réservés.
          </p>
          <p className="text-gray-700 text-xs">Fait en France.</p>
        </div>
      </div>
    </footer>
  );
}
