'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Server-driven pagination — reads totalPages/hasNextPage from API meta,
 * never from a local slice.
 */
export default function Pagination({ meta, onPageChange, className }) {
  if (!meta || meta.total === 0) return null;
  const { page, totalPages, total, hasNextPage, hasPrevPage } = meta;

  const pages = getVisiblePages(page, totalPages);

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
      <p className="text-sm text-ink-soft">
        Page <span className="font-semibold text-ink">{page}</span> of {totalPages}
        <span className="hidden sm:inline"> · {total} record{total === 1 ? '' : 's'}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, idx) =>
          p === '…' ? (
            <span key={`dots-${idx}`} className="px-1.5 text-ink-soft">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'h-9 min-w-9 rounded-lg border px-2 text-sm font-medium transition cursor-pointer',
                p === page
                  ? 'border-lime bg-lime text-ink shadow-soft'
                  : 'border-line bg-white text-ink hover:bg-ivory'
              )}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Always shows first + last page, current page ±1, ellipsis between. */
function getVisiblePages(current, totalPages) {
  const pages = [];
  const push = (v) => !pages.includes(v) && pages.push(v);

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) push(i);
    return pages;
  }

  push(1);
  if (current > 3) pages.push('…');
  [current - 1, current, current + 1].forEach((p) => p >= 2 && p <= totalPages - 1 && push(p));
  if (current < totalPages - 2) pages.push('…');
  push(totalPages);

  return pages.slice(0, 7);
}
