'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Empty state with a call-to-action so no panel is ever blank. */
export default function EmptyState({ title, description, action, icon: Icon, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-14 text-center', className)}
    >
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ivory-dark">
          <Icon className="h-7 w-7 text-ink-soft" />
        </div>
      )}
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
