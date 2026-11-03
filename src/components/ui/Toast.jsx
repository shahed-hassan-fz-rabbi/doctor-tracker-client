'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const COLORS = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-ink',
};

/**
 * Minimal toast system: ToastProvider (context) + useToast hook.
 * Used by every mutation for consistent feedback.
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const push = useMemo(
    () => ({
      success: (msg, d) => add(msg, 'success', d),
      error: (msg, d) => add(msg, 'error', d),
      info: (msg, d) => add(msg, 'info', d),
    }),
    [add]
  );

  return (
    <ToastContext.Provider value={{ toast: push, remove }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className={cn(
                  'pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-white p-3.5 shadow-[var(--shadow-card-hover)]'
                )}
                role="status"
              >
                <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', COLORS[t.type])} />
                <p className="flex-1 text-sm text-ink">{t.message}</p>
                <button
                  onClick={() => remove(t.id)}
                  className="text-ink-soft hover:text-ink cursor-pointer"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx.toast;
}

/** Confirmation modal used before destructive actions. */
export function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'danger', onConfirm, onCancel, loading }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest/60 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[var(--shadow-lift)]"
            role="dialog"
            aria-modal="true"
          >
            <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{description}</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={onCancel}
                className="h-10 flex-1 rounded-lg border border-line bg-white text-sm font-medium text-ink hover:bg-ivory cursor-pointer font-display"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={cn(
                  'h-10 flex-1 rounded-lg text-sm font-medium text-white disabled:opacity-60 cursor-pointer font-display',
                  tone === 'danger' ? 'bg-danger hover:bg-danger/90' : 'bg-forest hover:bg-forest-800'
                )}
              >
                {loading ? 'Working…' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
