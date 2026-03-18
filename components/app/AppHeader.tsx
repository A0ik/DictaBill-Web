'use client';
import { Menu } from 'lucide-react';
import { useT } from '@/hooks/useTranslation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AppHeader({ title, subtitle }: AppHeaderProps) {
  const { i18n } = useT();
  const { user } = useAuthStore();
  const openSidebar = useUIStore((s) => s.openSidebar);

  const toggleLang = () => {
    const next = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(next);
  };

  const initials = user?.email?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="border-b border-gray-200 bg-white px-6 md:px-8 py-5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={openSidebar}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={18} />
          </button>
          <div>
            {subtitle && (
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{subtitle}</p>
            )}
            <h1 className="text-xl font-black text-[#0D0D0D] tracking-tight leading-none">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="px-2.5 py-1 rounded-md text-[11px] font-bold text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors uppercase tracking-widest border border-gray-200"
          >
            {i18n.language === 'fr' ? 'EN' : 'FR'}
          </button>
          <div className="w-7 h-7 rounded-full bg-[#0D0D0D] flex items-center justify-center">
            <span className="text-[11px] font-bold text-white">{initials}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
