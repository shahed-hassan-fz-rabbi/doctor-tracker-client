'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  BarChart3,
  Settings,
  UserCircle,
  LogOut,
  X,
} from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { cn, initials } from '@/lib/utils';
import BrandMark from '@/components/ui/BrandMark';
import { IS_DEMO } from '@/lib/api';

/**
 * Dark forest sidebar — the visual anchor of the design system.
 * Electric lime marks the active route. On mobile it slides in as a drawer.
 */
const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Doctors', href: '/doctors', icon: Stethoscope },
  { label: 'Patients', href: '/patients', icon: Users },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Profile', href: '/profile', icon: UserCircle },
];

export default function Sidebar({ open, onClose, user }) {
  const pathname = usePathname();
  const logout = useLogout();
  const toast = useToast();

  async function handleLogout() {
    await logout.mutateAsync();
    toast.info('Signed out. See you soon.');
    onClose?.();
    window.location.href = '/login';
  }

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  const nav = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-6">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <BrandMark size={40} className="shadow-[0_4px_12px_rgba(201,244,90,0.35)]" />
          <span>
            <span className="block font-display text-base font-bold text-white leading-tight">
              Doctor Tracker
            </span>
            <span className="block text-[11px] font-medium tracking-wide text-lime-soft/80">
              Healthcare Administration
            </span>
          </span>
        </Link>
        <button
          onClick={onClose}
          className="ml-auto rounded-lg p-1.5 text-ivory/60 hover:bg-forest-700 hover:text-ivory md:hidden cursor-pointer"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                active ? 'text-forest' : 'text-ivory/70 hover:bg-forest-700 hover:text-ivory'
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-lime shadow-[0_6px_18px_rgba(201,244,90,0.3)]"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <item.icon className="relative z-10 h-[18px] w-[18px]" />
              <span className="relative z-10 font-display">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {IS_DEMO && <div className="mx-4 rounded-lg border border-lime/30 bg-forest-700/60 px-3 py-2 text-center text-[11px] font-semibold tracking-wide text-lime-soft">DEMO · READ ONLY</div>}

      {/* Admin identity + logout */}
      <div className="border-t border-forest-600 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-forest-700/60 p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime font-display text-xs font-bold text-forest">
            {initials(user?.name || 'Admin')}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ivory font-display">{user?.name || 'Admin'}</p>
            <p className="truncate text-xs text-ivory/60">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ivory/70 transition-colors hover:bg-forest-700 hover:text-danger cursor-pointer font-display"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar (fixed) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] bg-forest md:block">
        {nav}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-forest/60 backdrop-blur-sm md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-forest md:hidden"
            >
              {nav}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
