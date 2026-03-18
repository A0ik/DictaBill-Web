'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Settings, LogOut, Mic } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/invoices',  icon: FileText,         label: 'Factures' },
  { href: '/clients',   icon: Users,            label: 'Clients' },
  { href: '/settings',  icon: Settings,         label: 'Paramètres' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();

  return (
    <motion.aside
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="hidden md:flex flex-col w-56 min-h-screen bg-[#1D9E75] shrink-0 relative"
    >
      {/* Subtle glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Mic size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[17px] font-black text-white tracking-tight">DictaBill</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }, i) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <motion.div
              key={href}
              initial={{ x: -12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05 + i * 0.07, duration: 0.3 }}
              className="relative"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-white rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Link
                href={href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-[#1D9E75]'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#1D9E75]' : 'text-white/60'} />
                {label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 pt-2 space-y-0.5">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-black text-white">
              {user?.email?.charAt(0).toUpperCase() ?? '?'}
            </span>
          </div>
          <p className="text-white/50 text-xs truncate">{user?.email}</p>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <LogOut size={15} />
          Déconnexion
        </button>
      </div>
    </motion.aside>
  );
}
