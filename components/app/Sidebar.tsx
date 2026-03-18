'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useT } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, key: 'nav.dashboard' },
  { href: '/invoices', icon: FileText, key: 'nav.invoices' },
  { href: '/clients', icon: Users, key: 'nav.clients' },
  { href: '/settings', icon: Settings, key: 'nav.settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useT();
  const { user, signOut } = useAuthStore();

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-[#0D0D0D] shrink-0">
      {/* Logo */}
      <div className="px-5 py-5">
        <Link href="/dashboard" className="inline-block">
          <span className="text-lg font-black text-white tracking-tight">DictaBill</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map(({ href, icon: Icon, key }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                isActive
                  ? 'text-white bg-white/10 font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
              )}
            >
              <Icon
                size={16}
                className={cn(isActive ? 'text-white' : 'text-gray-500')}
              />
              {t(key as any)}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 space-y-0.5">
        {user?.email && (
          <div className="px-3 py-2 mb-1">
            <p className="text-gray-600 text-xs truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all"
        >
          <LogOut size={16} />
          {t('nav.logout')}
        </button>
      </div>
    </aside>
  );
}
