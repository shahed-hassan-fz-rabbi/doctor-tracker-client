'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Primary button with the 2.5D layered look: lime fill, dark text,
 * subtle y-aXis press. Variants follow the Doctor Tracker palette.
 */
const VARIANTS = {
  primary:
    'bg-lime text-ink hover:bg-lime/90 shadow-soft focus-visible:ring-lime',
  dark: 'bg-forest text-ivory hover:bg-forest-800 shadow-soft focus-visible:ring-forest',
  outline:
    'bg-white text-ink border border-line hover:bg-ivory focus-visible:ring-line',
  subtle:
    'bg-ivory-dark text-ink hover:bg-line focus-visible:ring-line',
  danger:
    'bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger',
};

const SIZES = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'h-9 w-9',
};

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className,
  loading = false,
  disabled,
  children,
  ...props
}) {
  const isDisabled = disabled || loading;
  return (
    <motion.button
      whileTap={{ y: 1 }}
      type={Comp === 'button' ? 'button' : undefined}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        'disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none font-display',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...(Comp === 'button' ? props : {})}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </motion.button>
  );
}
