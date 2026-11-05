'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  Copy,
  Check,
  Mail,
  LockKeyhole,
  Stethoscope,
  UsersRound,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Activity,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin, useMe } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { safeNextPath } from '@/lib/navigation';
import BrandMark from '@/components/ui/BrandMark';
import { API_BASE, DEMO_AVAILABLE, DEMO_CREDENTIALS, IS_DEMO } from '@/lib/api';
import { isDemoViewer } from '@/lib/demoAccess';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
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

/** Abstract medical dashboard preview card in the branding panel. */
function ClinicalDashboardPreview() {
  const bars = [38, 56, 44, 72, 60, 84, 68, 92, 76, 100];

  return (
    <div
      aria-hidden="true"
      className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-md"
    >
      {/* Top window bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-lime-soft">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
          CLINICAL OPERATIONS
        </span>
      </div>

      {/* Metric Tiles */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-black/20 p-3.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-ivory/60">Active Doctors</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-lime/15 text-lime-soft">
              <Stethoscope className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-white">40</p>
          <span className="mt-0.5 inline-block text-[10px] font-medium text-lime-soft">10 Specializations</span>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-ivory/60">Patient Records</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-lime/15 text-lime-soft">
              <UsersRound className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-white">260</p>
          <span className="mt-0.5 inline-block text-[10px] font-medium text-ivory/50">72% Assigned Active</span>
        </div>
      </div>

      {/* Intake Activity Chart */}
      <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-ivory/70">Weekly Patient Intake</span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-lime-soft">
            <Activity className="h-3 w-3" />
            +18% Velocity
          </span>
        </div>
        <div className="mt-3 flex h-14 items-end gap-1.5">
          {bars.map((height, index) => (
            <span
              key={index}
              style={{ height: `${height}%` }}
              className={`min-w-0 flex-1 rounded-t-[3px] transition-all duration-300 ${
                index === bars.length - 1 ? 'bg-lime shadow-[0_0_12px_rgba(199,244,100,0.5)]' : 'bg-lime/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const FEATURE_HIGHLIGHTS = [
  {
    icon: Stethoscope,
    title: 'Doctors Management',
    desc: 'Profile directories, schedules & rosters',
  },
  {
    icon: UsersRound,
    title: 'Patient Records',
    desc: 'Triage intake, diagnoses & assignments',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    desc: 'Caseload balance & department trends',
  },
];

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

  // Default to the configured production admin credentials if dedicated demo is not set
  const demoEmail = DEMO_CREDENTIALS?.email || 'admin@gmail.com';
  const demoPassword = DEMO_CREDENTIALS?.password || 'admin123';

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
    if (IS_DEMO && !DEMO_AVAILABLE) {
      toast.error('The public demo is not available yet.');
      return;
    }
    try {
      await login.mutateAsync(values);
      toast.success('Welcome back to Doctor Tracker.');
      router.replace(next);
    } catch (err) {
      toast.error(err?.message || 'Login failed. Please check your credentials.');
    }
  }

  function handleGoogleLogin() {
    if (IS_DEMO) return;
    setGoogleLoading(true);
    window.location.href = `${API_BASE}/auth/google`;
  }

  async function handleCopy(label, value) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(''), 1800);
    } catch {
      /* clipboard write rejected */
    }
  }

  function handleDemoFill() {
    setValue('email', demoEmail, { shouldValidate: true });
    setValue('password', demoPassword, { shouldValidate: true });
    document.getElementById('login-email')?.focus();
  }

  return (
    <div className="flex min-h-screen flex-col bg-ivory lg:grid lg:grid-cols-2">
      {/* ============================== Left: Premium Branding Section ============================== */}
      <aside className="relative hidden overflow-hidden bg-forest lg:flex lg:flex-col lg:justify-between p-10 xl:p-14 text-white">
        {/* Ambient background glows & abstract geometric contours */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-lime/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-lime/10 blur-3xl" />
        <div className="pointer-events-none absolute right-16 top-1/4 h-64 w-64 rounded-full border border-white/5" />
        <div className="pointer-events-none absolute left-1/3 bottom-1/4 h-48 w-48 rounded-full border border-lime/10" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3.5">
          <BrandMark size={44} priority className="shadow-[0_4px_20px_rgba(199,244,100,0.35)]" />
          <div>
            <span className="block font-display text-xl font-extrabold tracking-tight text-white leading-tight">
              Doctor Tracker
            </span>
            <span className="block text-[11px] font-semibold tracking-wider text-ivory/60 uppercase">
              Healthcare Administration Platform
            </span>
          </div>
        </div>

        {/* Hero Section & Interactive Graphic */}
        <div className="relative z-10 my-auto py-8 space-y-7">
          <ClinicalDashboardPreview />

          <div className="space-y-3">
            <h1 className="font-display text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-[1.2]">
              One place for every <span className="text-lime">doctor and patient</span> record.
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-ivory/70">
              Manage doctor profiles, organize patient records, and understand your healthcare operations through one secure platform.
            </p>
          </div>

          {/* Three Compact Feature Highlights */}
          <div className="grid max-w-md grid-cols-3 gap-3 pt-1">
            {FEATURE_HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 transition hover:bg-white/[0.08]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime/15 text-lime-soft">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="mt-2.5 font-display text-xs font-bold text-white leading-snug">{title}</p>
                <p className="mt-1 text-[10px] leading-snug text-ivory/55">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust & Compliance Footer */}
        <div className="relative z-10 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 text-xs text-ivory/55">
            <ShieldCheck className="h-4 w-4 text-lime-soft shrink-0" aria-hidden="true" />
            <span>Role-protected access · 256-bit encryption · Secure HttpOnly sessions</span>
          </div>
        </div>
      </aside>

      {/* ============================== Right: Authentication Section ============================== */}
      <main className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-8 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-[440px] space-y-6"
        >
          {/* Mobile brand header (shown on smaller viewports) */}
          <div className="flex items-center gap-3 lg:hidden">
            <BrandMark size={40} priority className="shadow-soft" />
            <div>
              <span className="block font-display text-lg font-bold text-ink">Doctor Tracker</span>
              <span className="block text-[11px] font-medium text-ink-soft">Healthcare Administration</span>
            </div>
          </div>

          {/* Authentication Card */}
          <section
            aria-label="Account sign-in"
            className="rounded-2xl border border-line bg-white p-7 sm:p-9 shadow-[0_20px_50px_rgba(16,33,15,0.06)]"
          >
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
                Welcome back
              </h2>
              <p className="mt-1.5 text-sm text-ink-soft">
                {IS_DEMO
                  ? 'Explore Doctor Tracker using a restricted, read-only demo account.'
                  : 'Sign in to your Doctor Tracker account.'}
              </p>
            </div>

            {/* OAuth Callback Error Alert */}
            {oauthError && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-3 rounded-xl border border-danger/25 bg-danger/5 p-3.5"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                <p className="text-xs leading-5 text-danger font-medium">
                  {OAUTH_ERRORS[oauthError] || OAUTH_ERRORS.oauth_failed}
                </p>
              </div>
            )}

            {/* Google OAuth Button */}
            {!IS_DEMO && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || login.isPending}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-ink shadow-sm transition-all hover:bg-ivory/70 hover:border-forest/30 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {googleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-forest" aria-hidden="true" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                  )}
                  <span>{googleLoading ? 'Connecting to Google…' : 'Continue with Google'}</span>
                </button>

                {/* Styled Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-line" />
                  </div>
                  <div className="relative flex justify-center text-[10px] font-bold text-ink-soft/80">
                    <span className="bg-white px-3 tracking-[0.16em] uppercase">OR CONTINUE WITH EMAIL</span>
                  </div>
                </div>
              </>
            )}

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="block text-xs font-bold text-ink font-display">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/70"
                    aria-hidden="true"
                  />
                  <input
                    id="login-email"
                    type="email"
                    disabled={IS_DEMO && !DEMO_AVAILABLE}
                    autoComplete="email"
                    placeholder="admin@gmail.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`h-12 w-full rounded-xl border bg-white pl-10 pr-3 text-sm text-ink placeholder:text-ink-soft/50 outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-ivory/50 disabled:cursor-not-allowed ${
                      errors.email ? 'border-danger focus:ring-danger/25' : 'border-line'
                    }`}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-xs font-medium text-danger flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold text-ink font-display">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/70"
                    aria-hidden="true"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    disabled={IS_DEMO && !DEMO_AVAILABLE}
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    className={`h-12 w-full rounded-xl border bg-white pl-10 pr-11 text-sm text-ink placeholder:text-ink-soft/50 outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-ivory/50 disabled:cursor-not-allowed ${
                      errors.password ? 'border-danger focus:ring-danger/25' : 'border-line'
                    }`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-soft transition hover:bg-ivory hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-xs font-medium text-danger flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={login.isPending || googleLoading || (IS_DEMO && !DEMO_AVAILABLE)}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 text-sm font-bold text-white shadow-md transition-all hover:bg-forest/90 hover:shadow-lg active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {login.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4 text-lime" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </section>

          {/* ============================== Demo Account Card ============================== */}
          <section
            aria-label="Demo credentials and preview"
            className="rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime/20 text-forest">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-ink">Demo Account</h3>
                  <p className="text-[11px] text-ink-soft">Test access with pre-populated records</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <span className="rounded-full border border-forest/15 bg-forest/5 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-forest uppercase">
                  DEMO ACCOUNT
                </span>
                <span className="rounded-full border border-line bg-ivory px-2 py-0.5 text-[10px] font-bold tracking-wide text-ink-soft uppercase">
                  READ ONLY
                </span>
              </div>
            </div>

            {/* Quick credentials banner */}
            <div className="mt-3.5 flex items-center justify-between rounded-xl border border-line/80 bg-ivory/70 px-3.5 py-2">
              <span
                role="status"
                className="font-mono text-[11px] font-bold tracking-wide text-forest/90 uppercase select-all"
              >
                DEMO : Email : {demoEmail} | Password : {demoPassword}
              </span>
            </div>

            {/* Interactive credential pills with instant one-click copy */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { label: 'Demo Email', value: demoEmail },
                { label: 'Demo Password', value: demoPassword },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="group relative flex items-center justify-between rounded-xl border border-line/70 bg-white p-2.5 transition-all hover:border-forest/30 hover:bg-ivory/30 shadow-2xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft/80">{label}</p>
                    <code className="block truncate font-mono text-xs font-semibold text-ink">{value}</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(label, value)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line/60 bg-ivory text-ink-soft transition-all hover:border-forest/40 hover:bg-white hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest cursor-pointer"
                    aria-label={`Copy ${label}`}
                    title={`Copy ${label}`}
                  >
                    {copied === label ? (
                      <Check className="h-3.5 w-3.5 text-forest" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* One-click Autofill Button */}
            <button
              type="button"
              onClick={handleDemoFill}
              className="mt-3.5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-forest/20 bg-forest/5 px-4 text-xs font-bold text-forest transition-all duration-150 hover:bg-forest hover:text-white hover:border-forest hover:shadow-sm active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Autofill Demo Credentials</span>
            </button>
          </section>
        </motion.div>
      </main>
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
      const user = data.data.user;
      router.replace(user.role === 'admin' || isDemoViewer(user, IS_DEMO) ? '/dashboard' : '/restricted');
    }
  }, [isSuccess, data, router]);

  return (
    <SuspenseWrapper>
      <LoginContent />
    </SuspenseWrapper>
  );
}
