'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import Sidebar from '@/components/app/Sidebar';
import I18nProvider from '@/components/I18nProvider';
import { Loader2, X, LayoutDashboard, FileText, Users, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useT } from '@/hooks/useTranslation';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, key: 'nav.dashboard' },
  { href: '/invoices', icon: FileText, key: 'nav.invoices' },
  { href: '/clients', icon: Users, key: 'nav.clients' },
  { href: '/settings', icon: Settings, key: 'nav.settings' },
];

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { t } = useT();
  const { user, signOut } = useAuthStore();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-56 bg-[#0D0D0D] shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-5 py-5">
          <span className="text-lg font-black text-white tracking-tight">DictaBill</span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, key }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                  isActive
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
                )}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
                {t(key as any)}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 space-y-0.5">
          {user?.email && (
            <p className="px-3 py-2 text-xs text-gray-600 truncate">{user.email}</p>
          )}
          <button
            onClick={() => { signOut(); onClose(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all"
          >
            <LogOut size={16} /> {t('nav.logout')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, initialized, initialize } = useAuthStore();
  const { sidebarOpen, closeSidebar } = useUIStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      router.push('/login');
      return;
    }
    // Redirect to onboarding if not done yet, except when already on /onboarding
    if (profile && profile.onboarding_done === false && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [initialized, user, profile, router, pathname]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-primary-500" />
          <p className="text-sm text-gray-400">Chargement…</p>
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
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </I18nProvider>
  );
}
