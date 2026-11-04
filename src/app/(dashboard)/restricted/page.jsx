'use client';

import { motion } from 'framer-motion';
import { Shield, LogOut, AlertCircle } from 'lucide-react';
import { useMe } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useAuth';
import BrandMark from '@/components/ui/BrandMark';

export default function RestrictedAccessPage() {
  const { data, isLoading } = useMe();
  const logout = useLogout();
  const user = data?.data?.user;

  async function handleLogout() {
    await logout.mutateAsync();
    window.location.href = '/login';
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="text-center">
          <BrandMark size={48} className="mx-auto mb-4" />
          <p className="text-sm text-ink-soft">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex justify-center">
          <BrandMark size={64} priority />
        </div>

        <div className="rounded-2xl border border-line bg-white p-8 shadow-card">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest/10">
              <Shield className="h-8 w-8 text-forest" />
            </div>
          </div>

          <h1 className="mb-3 text-center font-display text-2xl font-bold text-ink">
            Restricted Access
          </h1>

          <p className="mb-6 text-center text-sm text-ink-soft leading-relaxed">
            Your account is authenticated, but administrator approval is required to access
            patient and doctor records.
          </p>

          {user && (
            <div className="mb-6 rounded-xl border border-line bg-ivory p-4">
              <div className="flex items-center gap-3">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest font-display text-sm font-bold text-lime">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                  <p className="truncate text-xs text-ink-soft">{user.email}</p>
                </div>
                <span className="rounded-full bg-forest/10 px-2 py-1 text-xs font-semibold text-forest">
                  {user.role}
                </span>
              </div>
            </div>
          )}

          <div className="mb-6 flex items-start gap-3 rounded-xl border border-forest/10 bg-forest/5 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
            <p className="text-xs text-ink-soft leading-relaxed">
              If you believe this is an error, please contact your system administrator to
              request access to the Doctor Tracker system.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {logout.isPending ? (
              <span>Signing out...</span>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Sign out
              </>
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-ink-soft">
          Doctor Tracker · Secure Healthcare Administration
        </p>
      </motion.div>
    </main>
  );
}
