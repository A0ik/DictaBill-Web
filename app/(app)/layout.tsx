export const dynamic = 'force-dynamic';

import AppShell from '@/components/app/AppShell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
