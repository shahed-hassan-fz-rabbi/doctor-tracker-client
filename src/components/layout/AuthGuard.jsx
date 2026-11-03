'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMe } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Client-side route protection. The JWT lives in an HttpOnly cookie owned
 * by the Express API, so Next middleware cannot read it; /auth/me is the
 * single verification point. These routes are public:
 */
const PUBLIC_ROUTES = ['/login'];

export default function AuthGuard({ children }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  const { data, isLoading, isError, error } = useMe();

  useEffect(() => {
    if (!isPublic && isError && error?.status === 401) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isPublic, isError, error?.status, router, pathname]);

  // Public pages render directly (login page handles redirect-if-authed).
  if (isPublic) return children;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory text-ink">
        <div className="flex items-center gap-3 font-display text-sm text-ink-soft">
          <Loader2 className="h-5 w-5 animate-spin text-forest" />
          Loading Doctor Tracker…
        </div>
      </div>
    );
  }

  // While redirecting to login, render nothing to avoid flashing protected UI
  if (isError) return null;

  return children;
}
