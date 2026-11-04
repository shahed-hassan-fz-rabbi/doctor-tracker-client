'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_KEYS } from '@/hooks/useAuth';
import BrandMark from '@/components/ui/BrandMark';

/**
 * Error messages shown to the user for each OAuth error code.
 * These are safe, user-friendly — no internal details exposed.
 */
const ERROR_MESSAGES = {
  google_denied: 'You cancelled the Google sign-in. Please try again.',
  missing_params: 'The sign-in link was incomplete. Please try again.',
  invalid_state: 'The sign-in session expired. Please try again.',
  email_not_verified: 'Your Google account email is not verified. Please verify it in Google settings.',
  account_suspended: 'Your account has been suspended. Contact support.',
  oauth_failed: 'Google sign-in failed. Please try again or use email login.',
};

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const handled = useRef(false);

  const error = params.get('error');

  useEffect(() => {
    // Guard against StrictMode double-invoke
    if (handled.current) return;
    handled.current = true;

    if (error) return; // Show error UI — do not redirect

    // No error means the backend set the cookie and redirected here.
    // Invalidate the auth cache so AuthGuard re-fetches /auth/me with
    // the new session cookie, then navigate to dashboard.
    queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
    router.replace('/dashboard');
  }, [error, router, queryClient]);

  // Error state
  if (error) {
    const message = ERROR_MESSAGES[error] || ERROR_MESSAGES.oauth_failed;
    return (
      <main className="flex min-h-screen items-center justify-center bg-ivory px-4">
        <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-card text-center">
          <div className="flex justify-center mb-4">
            <BrandMark size={40} />
          </div>
          <AlertCircle className="mx-auto h-10 w-10 text-danger mb-4" />
          <h1 className="font-display text-xl font-bold text-ink mb-2">Sign-in failed</h1>
          <p className="text-sm text-ink-soft mb-6">{message}</p>
          <button
            type="button"
            onClick={() => router.replace('/login')}
            className="inline-flex items-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest/90 transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </main>
    );
  }

  // Loading state while redirecting
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory">
      <div className="text-center">
        <BrandMark size={48} className="mx-auto mb-4" />
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-lime mb-3" />
        <p className="text-sm font-medium text-ink">Completing sign in…</p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-ivory">
          <Loader2 className="h-6 w-6 animate-spin text-lime" />
        </main>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
