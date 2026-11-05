'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMe } from '@/hooks/useAuth';
import { AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_KEYS } from '@/hooks/useAuth';
import BrandLoadingScreen from '@/components/ui/BrandLoadingScreen';
import { IS_DEMO } from '@/lib/api';

/**
 * Client-side route protection. The JWT lives in an HttpOnly cookie owned
 * by the Express API, so Next middleware cannot read it; /auth/me is the
 * single verification point. These routes are public:
 */
const PUBLIC_ROUTES = ['/login', '/restricted'];

export default function AuthGuard({ children }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const queryClient = useQueryClient();
  const isPublic = pathname === '/' || PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isWriteRoute = /\/(new|edit)(\/|$)/.test(pathname);

  const { isLoading, isError, error, refetch, isFetching } = useMe({ enabled: !isPublic });

  useEffect(() => {
    const refreshSession = () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
    };
    const handleForbidden = () => {
      router.replace('/restricted');
    };
    window.addEventListener('doctor-tracker:unauthorized', refreshSession);
    window.addEventListener('doctor-tracker:forbidden', handleForbidden);
    return () => {
      window.removeEventListener('doctor-tracker:unauthorized', refreshSession);
      window.removeEventListener('doctor-tracker:forbidden', handleForbidden);
    };
  }, [queryClient, router]);

  useEffect(() => {
    if (!isPublic && isError && error?.status === 401) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
    if (!isPublic && isError && error?.status === 403) {
      router.replace('/restricted');
    }
  }, [isPublic, isError, error?.status, router, pathname]);

  // Public pages render directly (login page handles redirect-if-authed).
  if (isPublic) return children;

  if (IS_DEMO && isWriteRoute) {
    return <main className="flex min-h-screen items-center justify-center bg-ivory px-4 text-center text-ink"><section className="max-w-md rounded-2xl border border-line bg-white p-6 shadow-card"><h1 className="font-display text-lg font-bold">Read-only demo</h1><p className="mt-2 text-sm text-ink-soft">Record changes are disabled in the public demo.</p></section></main>;
  }

  if (isLoading) return <BrandLoadingScreen />;

  // While redirecting to login, render nothing to avoid flashing protected UI.
  if (isError && error?.status === 401) return null;

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ivory px-4 text-ink">
        <section role="alert" className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-card">
          <AlertCircle className="h-6 w-6 text-danger" aria-hidden="true" />
          <h1 className="mt-4 font-display text-lg font-bold">We couldn’t verify your session</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {error?.message || 'The authentication service could not be reached.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isFetching ? 'Checking…' : 'Try again'}
            </button>
            <button
              type="button"
              onClick={() => router.replace(`/login?next=${encodeURIComponent(pathname)}`)}
              className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink"
            >
              Go to sign in
            </button>
          </div>
        </section>
      </main>
    );
  }

  return children;
}
