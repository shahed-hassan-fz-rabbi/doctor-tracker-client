'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Accessible modal with spring animation and a close button. */
export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-forest/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className={cn('w-full rounded-2xl bg-white shadow-[var(--shadow-lift)]', sizes[size])}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 className="font-display text-base font-bold text-ink">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-ink-soft hover:bg-ivory hover:text-ink cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto scroll-thin p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
