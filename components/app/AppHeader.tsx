'use client';
import { Menu } from 'lucide-react';
import { useT } from '@/hooks/useTranslation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

interface AppHeaderProps {
  title: string;
}

export default function AppHeader({ title }: AppHeaderProps) {
  const { i18n } = useT();
  const { user } = useAuthStore();
  const openSidebar = useUIStore((s) => s.openSidebar);

  const toggleLang = () => {
    const next = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(next);
  };

  const initials = user?.email?.charAt(0).toUpperCase() ?? '?';

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 md:px-6">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={openSidebar}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-black text-gray-900">{title}</h1>
      </div>

      {/* Right: lang toggle + avatar */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLang}
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200 uppercase tracking-wide"
        >
          {i18n.language === 'fr' ? 'EN' : 'FR'}
        </button>
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-xs font-bold text-primary-700">{initials}</span>
        </div>
      </div>
    </header>
  );
}
