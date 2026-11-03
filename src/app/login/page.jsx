'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { HeartPulse, Loader2, LogIn, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/hooks/useAuth';
import { useMe } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { Input, Field } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import { safeNextPath } from '@/lib/navigation';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get('next'));

  const login = useLogin();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
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

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel (dark forest, layered shapes) */}
      <div className="relative hidden overflow-hidden bg-forest lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-lime/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-lime-soft/10 blur-3xl" />
        <div className="pointer-events-none absolute right-24 top-1/3 h-40 w-40 rotate-12 rounded-3xl border border-lime/20" />

        <div className="relative p-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime shadow-[0_4px_16px_rgba(201,244,90,0.4)]">
              <HeartPulse className="h-6 w-6 text-forest" strokeWidth={2.5} />
            </span>
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
            analytics — all behind a secure, admin-only portal.
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
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest">
              <HeartPulse className="h-5 w-5 text-lime" strokeWidth={2.5} />
            </span>
            <span className="font-display text-base font-bold text-ink">Doctor Tracker</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Admin sign in</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Sign in with your administrator credentials to open the portal.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                autoComplete="email"
                placeholder="admin@doctracker.local"
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

            <Button type="submit" size="lg" className="w-full" loading={login.isPending}>
              {!login.isPending && <LogIn className="h-4 w-4" />}
              {login.isPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-8 rounded-xl border border-line bg-white p-4 text-xs leading-relaxed text-ink-soft">
            Administrator accounts are seeded from the backend environment
            (<code className="font-mono text-ink">ADMIN_EMAIL</code> /{' '}
            <code className="font-mono text-ink">ADMIN_PASSWORD</code>) — never stored in this app.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  // already-authed admins skip the form
  const router = useRouter();
  const { data, isSuccess } = useMe();
  useEffect(() => {
    if (isSuccess && data?.data?.user) router.replace('/dashboard');
  }, [isSuccess, data, router]);

  // suspense-safe wrapper for useSearchParams
  return (
    <SuspenseWrapper>
      <LoginContent />
    </SuspenseWrapper>
  );
}

import { Suspense } from 'react';
function SuspenseWrapper({ children }) {
  return <Suspense fallback={<div className="min-h-screen bg-ivory" />}>{children}</Suspense>;
}
