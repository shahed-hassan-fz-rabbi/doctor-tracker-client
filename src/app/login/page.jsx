'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, LogIn, Eye, EyeOff, AlertCircle, Copy, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin, useMe } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { Input, Field } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import { safeNextPath } from '@/lib/navigation';
import BrandMark from '@/components/ui/BrandMark';
import { API_BASE, DEMO_CREDENTIALS, IS_DEMO } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

/** Friendly labels for OAuth error codes returned by the backend callback. */
const OAUTH_ERRORS = {
  google_denied: 'You cancelled Google sign-in. Try again when ready.',
  missing_params: 'Sign-in link was incomplete. Please try again.',
  invalid_state: 'Sign-in session expired. Please try again.',
  email_not_verified: 'Your Google account email is not verified.',
  account_suspended: 'Your account is suspended. Contact support.',
  oauth_failed: 'Google sign-in failed. Try again or use email login.',
};

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get('next'));
  const oauthError = params.get('error');

  const login = useLogin();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values) {
    try {
      await login.mutateAsync(values);
      toast.success('Welcome back to Doctor Tracker.');
      router.replace(next);
    } catch (err) {
      toast.error(err?.message || 'Login failed. Try again.');
    }
  }

  /**
   * Google Sign-In initiates a server-side redirect.
   * The browser navigates away to the backend /auth/google endpoint which
   * redirects to Google's consent screen. No tokens pass through the frontend.
   */
  function handleGoogleLogin() {
    if (IS_DEMO) return;
    setGoogleLoading(true);
    // Full-page navigation — not a fetch. The backend handles everything.
    window.location.href = `${API_BASE}/auth/google`;
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="relative hidden overflow-hidden bg-forest lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-lime/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-lime-soft/10 blur-3xl" />
        <div className="pointer-events-none absolute right-24 top-1/3 h-40 w-40 rotate-12 rounded-3xl border border-lime/20" />

        <div className="relative p-10">
          <div className="flex items-center gap-3">
            <BrandMark size={44} priority className="shadow-[0_4px_16px_rgba(201,244,90,0.4)]" />
            <span className="font-display text-lg font-bold text-white">Doctor Tracker</span>
          </div>
        </div>

        <div className="relative p-10">
          <h2 className="font-display text-4xl font-bold leading-tight text-white">
            One place for every
            <span className="text-lime"> doctor and patient</span> record.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/70">
            Register doctors, track each patient's assigned specialist and read operational
            analytics — all behind a secure, role-protected portal.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {[
              ['Doctors', 'Register & filter'],
              ['Patients', 'Assign & track'],
              ['Analytics', 'Live dashboards'],
            ].map(([title, sub]) => (
              <div key={title} className="rounded-xl border border-forest-600 bg-forest-800/80 p-3">
                <p className="font-display text-sm font-semibold text-lime-soft">{title}</p>
                <p className="mt-0.5 text-[11px] text-ivory/60">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center bg-ivory px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <BrandMark size={40} priority />
            <span className="font-display text-base font-bold text-ink">Doctor Tracker</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Sign in</h1>
          <p className="mt-2 text-sm text-ink-soft">{IS_DEMO ? 'Explore Doctor Tracker using a restricted, read-only demo account.' : 'Sign in with Google or your administrator credentials.'}</p>

          {/* OAuth error banner */}
          {oauthError && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
              <p className="text-sm text-danger">
                {OAUTH_ERRORS[oauthError] || OAUTH_ERRORS.oauth_failed}
              </p>
            </div>
          )}

          {/* Google Sign-In */}
          {!IS_DEMO && <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || login.isPending}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink shadow-sm transition-all hover:bg-ivory hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                /* Google "G" SVG logo */
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              )}
              {googleLoading ? 'Redirecting to Google…' : 'Continue with Google'}
            </button>
          </div>}

          {/* Divider */}
          {!IS_DEMO && <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center text-xs text-ink-soft">
              <span className="bg-ivory px-3">or sign in with admin credentials</span>
            </div>
          </div>}

          {/* Email / Password form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                autoComplete="email"
                placeholder={IS_DEMO ? 'demo@example.com' : 'admin@example.com'}
                error={errors.email}
                {...register('email')}
              />
            </Field>

            <Field label="Password" error={errors.password}>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  error={errors.password}
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-ink-soft hover:text-ink cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={login.isPending}
              disabled={googleLoading}
            >
              {!login.isPending && <LogIn className="h-4 w-4" />}
              {login.isPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {IS_DEMO ? (
            <section aria-label="Demo credentials" className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-card">
              <div className="mb-4">
                <h2 className="font-display text-base font-bold text-ink">Demo Credentials</h2>
                <p className="mt-1 text-xs text-ink-soft">Viewer access to synthetic records. All changes are disabled.</p>
              </div>
              {DEMO_CREDENTIALS?.email && DEMO_CREDENTIALS?.password ? (
                <div className="space-y-3">
                  {[["Demo Email", DEMO_CREDENTIALS.email, 'email'], ["Demo Password", DEMO_CREDENTIALS.password, 'password']].map(([label, value, key]) => (
                    <div key={key}>
                      <p className="mb-1 text-xs font-semibold text-ink-soft">{label}</p>
                      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-line bg-ivory/60 p-2">
                        <code className="min-w-0 flex-1 break-all text-xs text-ink">{value}</code>
                        <button type="button" onClick={async () => { await navigator.clipboard.writeText(value); setCopied(key); setTimeout(() => setCopied(''), 1600); }} className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-forest hover:bg-lime/20" aria-label={`Copy ${label}`}>
                          {copied === key ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied === key ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" className="w-full" onClick={() => { setValue('email', DEMO_CREDENTIALS.email, { shouldValidate: true }); setValue('password', DEMO_CREDENTIALS.password, { shouldValidate: true }); }}>
                    Try Demo Account
                  </Button>
                </div>
              ) : <p role="status" className="text-sm text-ink-soft">Demo access is not configured for this deployment.</p>}
            </section>
          ) : <p className="mt-8 rounded-xl border border-line bg-white p-4 text-xs leading-relaxed text-ink-soft">
            <strong className="text-ink">Google users</strong> are registered automatically with
            viewer access.{' '}
            <strong className="text-ink">Administrator</strong> accounts are provisioned from the
            backend environment — not stored in this app.
          </p>}
        </motion.div>
      </div>
    </div>
  );
}

function SuspenseWrapper({ children }) {
  return <Suspense fallback={<div className="min-h-screen bg-ivory" />}>{children}</Suspense>;
}

export default function LoginPage() {
  const router = useRouter();
  const { data, isSuccess } = useMe();
  useEffect(() => {
    if (isSuccess && data?.data?.user) {
      // If viewer, go to restricted page
      if (data.data.user.role !== 'admin') {
        router.replace('/restricted');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [isSuccess, data, router]);

  return (
    <SuspenseWrapper>
      <LoginContent />
    </SuspenseWrapper>
  );
}
