'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import BrandMark from '@/components/ui/BrandMark';
import ThemeToggle from '@/components/public/ThemeToggle';

const links = [
  ['Home', '#home'],
  ['About', '#about'],
  ['Features', '#features'],
  ['How It Works', '#how-it-works'],
  ['Contact', '#contact'],
];

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-ivory/95 backdrop-blur-xl dark:bg-[#0b120e]/90">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link href="/" aria-label="Doctor Tracker home" className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2">
          <BrandMark size={40} priority className="shadow-soft" />
          <span className="font-display text-base font-extrabold tracking-tight text-forest sm:text-lg dark:text-lime-soft">Doctor Tracker</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="rounded-md px-1 py-2 text-sm font-semibold text-ink-soft transition hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:text-[#a9bda9] dark:hover:text-lime-soft">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link href="/login" className="rounded-lg px-3.5 py-2.5 text-sm font-bold text-forest transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:text-lime-soft dark:hover:bg-white/5">Login</Link>
          <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-forest-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 dark:bg-lime dark:text-forest dark:hover:bg-lime-soft">
            Admin Login <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:border-white/15 dark:bg-white/10 dark:text-lime-soft"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="public-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="public-mobile-menu" aria-label="Mobile navigation" className="border-t border-line bg-ivory px-5 py-4 shadow-soft lg:hidden dark:border-white/10 dark:bg-[#0b120e]/95">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm font-semibold text-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:text-[#dfe9dd] dark:hover:bg-white/5">
                {label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-line pt-3 dark:border-white/10">
              <Link href="/login" onClick={closeMenu} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:border-white/15 dark:bg-white/10 dark:text-lime-soft">Login</Link>
              <Link href="/login" onClick={closeMenu} className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-forest px-3 py-2 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 dark:bg-lime dark:text-forest">
                Admin Login <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
