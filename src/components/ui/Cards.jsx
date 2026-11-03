'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Layered card — the base surface for every panel. */
export function Card({ className, children, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]',
        hover && 'transition-shadow hover:shadow-[var(--shadow-card-hover)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Dark forest card used for contrast panels (stats, feature highlights). */
export function CardDark({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-forest-600 bg-forest text-ivory shadow-[var(--shadow-card)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Big premium statistic tile with layered depth + indicator row. */
export function StatCard({ label, value, delta, deltaLabel, icon: Icon, tone = 'dark', footer, animate = true }) {
  const dark = tone === 'dark';
  const deltaPositive = typeof delta === 'number' && delta >= 0;

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]',
        dark ? 'bg-forest border border-forest-600 text-ivory' : 'bg-white border border-line text-ink'
      )}
    >
      {/* 2.5D depth edge */}
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-px',
          dark ? 'bg-white/10' : 'bg-white/80'
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn('text-sm font-medium', dark ? 'text-lime-soft' : 'text-ink-soft')}>
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight" data-testid={`stat-${label}`}>
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl',
              dark ? 'bg-lime text-ink' : 'bg-ivory-dark text-ink'
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {(delta !== undefined || footer) && (
        <div className={cn('mt-4 flex items-center gap-2 text-sm', dark ? 'text-ivory/70' : 'text-ink-soft')}>
          {delta !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                deltaPositive ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
              )}
            >
              {`${deltaPositive ? '▲' : '▼'} ${Math.abs(delta)}%`}
            </span>
          )}
          {deltaLabel && <span>{deltaLabel}</span>}
        </div>
      )}
      {footer}
    </motion.div>
  );
}

/** Section heading used at the top of every page. */
export function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 gap-2">{action}</div>}
    </div>
  );
}

/** Small status badge (condition, active state, gender...). */
const TONES = {
  lime: 'bg-lime/40 text-ink',
  green: 'bg-success/15 text-success',
  amber: 'bg-warning/15 text-warning',
  red: 'bg-danger/15 text-danger',
  gray: 'bg-ivory-dark text-ink-soft',
};

export function Badge({ tone = 'gray', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold',
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
