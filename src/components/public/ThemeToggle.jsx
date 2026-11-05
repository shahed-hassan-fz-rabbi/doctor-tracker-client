'use client';

import { useCallback, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'dt-landing-theme';

/** Read the persisted (or system) preference without touching the DOM. */
function readPreference() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    /* storage unavailable — fall through to system preference */
  }
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Light / dark switch for the public landing page.
 * Adds/removes `.scheme-dark` on <html> — the landing page (and only it) styles
 * its `dark:` utilities against that class, so the dashboard/login pages are
 * never restyled. The class is removed again when this component unmounts.
 */
export default function ThemeToggle({ className = '' }) {
  // `null` until mounted keeps SSR and first client render identical.
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const preference = readPreference();
    document.documentElement.classList.toggle('scheme-dark', preference === 'dark');
    setTheme(preference);
    // drop the scheme when leaving the landing page so other routes keep their look
    return () => document.documentElement.classList.remove('scheme-dark');
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* private mode — preference simply won't persist */
      }
      return next;
    });
  }, []);

  // keep the applied scheme in sync after every toggle
  useEffect(() => {
    if (theme !== null) {
      document.documentElement.classList.toggle('scheme-dark', theme === 'dark');
    }
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Night mode'}
      className={`inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line bg-white text-forest transition hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/10 dark:text-lime-soft dark:hover:bg-white/15 ${className}`}
    >
      {/* same icon server & client until mounted — no hydration mismatch */}
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
