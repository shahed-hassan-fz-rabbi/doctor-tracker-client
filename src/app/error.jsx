'use client';

import Link from 'next/link';
import { AlertTriangle, RotateCw } from 'lucide-react';
import BrandMark from '@/components/ui/BrandMark';

export default function GlobalError({ reset }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-ivory px-4 py-12 text-ink">
      <section role="alert" className="w-full max-w-lg rounded-3xl border border-line bg-white p-7 shadow-card sm:p-10">
        <div className="flex items-center gap-3">
          <BrandMark size={44} priority />
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </span>
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold">We hit a snag</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Doctor Tracker couldn&apos;t finish loading this page. Try again, or return to the dashboard.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-ivory transition hover:bg-forest-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/70"
          >
            <RotateCw className="h-4 w-4" aria-hidden="true" /> Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex min-h-10 items-center rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/70"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
