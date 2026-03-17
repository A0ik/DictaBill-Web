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
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-gray-100 shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100">
        <Link href="/dashboard" className="inline-flex items-center gap-1">
          <span className="text-2xl font-black text-primary-500">Dicta</span>
          <span className="text-2xl font-black text-gray-900">Bill</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, key }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon
                size={18}
                className={cn(isActive ? 'text-primary-600' : 'text-gray-400')}
              />
              {t(key as any)}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        {user?.email && (
          <div className="px-3 py-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary-700">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={18} />
          {t('nav.logout')}
        </button>
      </div>
    </aside>
  );
}
