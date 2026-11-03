'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(function Input({ className, error, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border bg-white px-3 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition',
        'focus:border-lime focus:ring-2 focus:ring-lime/40 focus-visible:ring-2',
        error ? 'border-danger focus:ring-danger/30' : 'border-line',
        className
      )}
      {...props}
    />
  );
});

export const Textarea = forwardRef(function Textarea({ className, error, rows = 3, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition',
        'focus:border-lime focus:ring-2 focus:ring-lime/40 resize-y',
        error ? 'border-danger focus:ring-danger/30' : 'border-line',
        className
      )}
      {...props}
    />
  );
});

export const Select = forwardRef(function Select({ className, error, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border bg-white px-3 text-sm text-ink outline-none transition cursor-pointer',
        'focus:border-lime focus:ring-2 focus:ring-lime/40',
        error ? 'border-danger focus:ring-danger/30' : 'border-line',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

/** Form field wrapper: label + control + error message + hint. */
export function Field({ label, error, hint, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-medium text-ink font-display">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-ink-soft">{hint}</p>}
      {error && (
        <p className="text-xs font-medium text-danger" role="alert">
          {error.message || String(error)}
        </p>
      )}
    </div>
  );
}
