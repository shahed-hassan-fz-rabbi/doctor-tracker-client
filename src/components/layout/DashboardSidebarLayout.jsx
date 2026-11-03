'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { useMe } from '@/hooks/useAuth';

/**
 * Shared shell for every protected page: fixed desktop sidebar,
 * slide-in mobile drawer and a sticky top bar.
 */
export default function DashboardSidebarLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: meQuery } = useMe();
  const user = meQuery?.data?.user;

  return (
    <div className="min-h-screen bg-ivory">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />

      <div className="md:pl-[260px]">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
