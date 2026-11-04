'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import BrandMark from '@/components/ui/BrandMark';

export default function NotFound() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-forest px-4 py-12 text-ivory">
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-lime/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-lime-soft/10 blur-3xl" />

      <section className="relative w-full max-w-2xl rounded-3xl border border-forest-600 bg-forest-800/95 p-7 text-center shadow-lift sm:p-12">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-lime/60 to-transparent" />
        <div className="flex justify-center">
          <BrandMark size={56} priority className="shadow-[0_8px_24px_rgba(201,244,90,0.18)]" />
        </div>
        <p className="mt-7 font-display text-7xl font-extrabold leading-none tracking-tight text-lime sm:text-9xl" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory/70 sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-forest shadow-soft transition hover:bg-lime/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
          >
            Back to Dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-forest-600 px-5 py-2.5 text-sm font-semibold text-ivory transition hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/70"
          >
            <Home className="h-4 w-4" aria-hidden="true" /> Go to Home
          </Link>
          {canGoBack && (
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-lime-soft transition hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/70"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Go back
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
