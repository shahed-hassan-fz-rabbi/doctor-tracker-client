'use client';

import { useEffect, useState } from 'react';
import { Menu, Search, Plus } from 'lucide-react';
import { useMe } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { IS_DEMO } from '@/lib/api';

/** Top bar of the protected area: mobile menu button + quick search. */
export default function Topbar({ onMenuClick }) {
  const { data: meQuery } = useMe();
  const user = meQuery?.data?.user;
  const router = useRouter();
  const pathname = usePathname() || '';
  const isPatientsPage = pathname === '/patients';
  const [query, setQuery] = useState('');

  useEffect(() => setQuery(''), [pathname]);

  function submitSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    if (isPatientsPage) {
      window.dispatchEvent(
        new CustomEvent('doctor-tracker:patient-search', { detail: { query: query.trim() } })
      );
      setQuery('');
      return;
    }
    router.push(`/doctors?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ivory/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={onMenuClick}
          className="rounded-lg border border-line bg-white p-2 text-ink hover:bg-ivory-dark md:hidden cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <form onSubmit={submitSearch} className="relative hidden max-w-md flex-1 sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isPatientsPage ? 'Search patients…' : 'Search doctors…'}
            aria-label={isPatientsPage ? 'Search patients' : 'Search doctors'}
            className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-soft/60 outline-none focus:border-lime focus:ring-2 focus:ring-lime/40"
          />
        </form>

        <div className="ml-auto flex items-center gap-3">
          {!IS_DEMO && <button
            onClick={() => router.push(isPatientsPage ? '/patients/new' : '/doctors/new')}
            aria-label={isPatientsPage ? 'Add Patient' : 'Add Doctor'}
            className="hidden h-10 items-center gap-2 rounded-lg bg-lime px-4 text-sm font-semibold text-ink shadow-soft transition hover:bg-lime/90 sm:inline-flex cursor-pointer font-display"
          >
            <Plus className="h-4 w-4" />
            {isPatientsPage ? 'Add Patient' : 'Add Doctor'}
          </button>}
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden font-medium text-ink lg:inline font-display">{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
