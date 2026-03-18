'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import Sidebar from '@/components/app/Sidebar';
import I18nProvider from '@/components/I18nProvider';
import { Loader2, X, LayoutDashboard, FileText, Users, Settings, LogOut, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '@/hooks/useTranslation';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/invoices',  icon: FileText,         label: 'Factures' },
  { href: '/clients',   icon: Users,            label: 'Clients' },
  { href: '/settings',  icon: Settings,         label: 'Paramètres' },
];

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="absolute left-0 top-0 bottom-0 w-56 bg-[#1D9E75] shadow-2xl z-50 flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between px-5 pt-6 pb-5">
              <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <Mic size={14} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[17px] font-black text-white tracking-tight">DictaBill</span>
              </Link>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/15 transition-colors">
                <X size={17} className="text-white/70" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-2 space-y-0.5">
              {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/');
                return (
                  <div key={href} className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="mobile-active-pill"
                        className="absolute inset-0 bg-white rounded-xl"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                    <Link
                      href={href}
                      onClick={onClose}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive ? 'text-[#1D9E75]' : 'text-white/75 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-[#1D9E75]' : 'text-white/60'} />
                      {label}
                    </Link>
                  </div>
                );
              })}
            </nav>

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
                onClick={() => { signOut(); onClose(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <LogOut size={15} />
                Déconnexion
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, initialized, initialize } = useAuthStore();
  const { sidebarOpen, closeSidebar } = useUIStore();

  useEffect(() => { initialize(); }, [initialize]);

  useEffect(() => {
    if (!initialized) return;
    if (!user) { router.push('/login'); return; }
    if (profile && profile.onboarding_done === false && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [initialized, user, profile, router, pathname]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <I18nProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <MobileDrawer open={sidebarOpen} onClose={closeSidebar} />
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </I18nProvider>
  );
}
