'use client';

import { cn } from '@/lib/utils';

/**
 * Generic data table for desktop/tablet. Mobile uses card layouts instead
 * (see each page). Keeping tables generic avoids duplication across the
 * doctors and patients pages.
 */
export default function Table({ columns, children, className, tableClassName }) {
  return (
    <div className={cn('w-full overflow-x-auto scroll-thin', className)}>
      <table className={cn('w-full min-w-[720px] border-collapse text-left', tableClassName)}>
        <colgroup>
          {columns.map((col) => (
            <col key={col.key} style={col.width ? { width: col.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-line">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-ink-soft font-display',
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-ivory-dark" />
          <div className="h-4 flex-1 rounded bg-ivory-dark" />
          <div className="h-4 w-24 hidden md:block rounded bg-ivory-dark" />
          <div className="h-4 w-16 rounded bg-ivory-dark" />
        </div>
      ))}
    </div>
  );
}
