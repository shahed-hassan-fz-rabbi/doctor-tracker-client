import BrandMark from '@/components/ui/BrandMark';

/** Shared lightweight loading screen for route transitions and session checks. */
export default function BrandLoadingScreen() {
  return (
    <main
      className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-forest px-4 py-10 text-ivory"
      role="status"
      aria-live="polite"
      aria-label="Loading Doctor Tracker"
    >
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-lime/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-lime-soft/10 blur-3xl" />

      <section className="dt-loader-card relative w-full max-w-md rounded-3xl border border-forest-600 bg-forest-800/95 p-7 shadow-lift sm:p-10">
        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-lime/60 to-transparent" />
        <div className="flex flex-col items-center text-center">
          <div className="dt-loader-mark rounded-2xl p-1 shadow-[0_8px_24px_rgba(201,244,90,0.18)]">
            <BrandMark size={64} priority />
          </div>
          <p className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.22em] text-lime-soft">
            Doctor Tracker
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Loading Doctor Tracker
          </h1>
          <p className="mt-2 text-sm text-ivory/70">Preparing your healthcare workspace</p>
          <div
            className="dt-loading-track mt-8 h-1.5 w-full overflow-hidden rounded-full bg-forest-600"
            role="progressbar"
            aria-label="Loading progress"
            aria-valuetext="Loading"
          >
            <span className="dt-loading-progress block h-full w-full rounded-full" />
          </div>
          <span className="sr-only">Please wait while the workspace loads.</span>
        </div>
      </section>
    </main>
  );
}
