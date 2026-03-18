'use client';
import { ShieldCheck, Scale, Lock, Server, BadgeCheck } from 'lucide-react';

const BADGES = [
  { icon: ShieldCheck, label: 'Données hébergées en Europe', sub: 'RGPD compliant' },
  { icon: Scale, label: 'Conforme loi française', sub: 'TVA & mentions légales' },
  { icon: Lock, label: 'Chiffrement SSL/TLS', sub: 'Connexion sécurisée' },
  { icon: BadgeCheck, label: 'Format NF compliant', sub: 'Factures légales' },
  { icon: Server, label: 'Uptime 99,9%', sub: 'Infrastructure fiable' },
];

export default function TrustBar() {
  return (
    <div className="bg-gray-950 border-y border-gray-800 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {BADGES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon size={18} className="text-primary-400 shrink-0" />
              <div>
                <p className="text-white text-xs font-semibold leading-tight">{label}</p>
                <p className="text-gray-500 text-[10px]">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
