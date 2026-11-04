import { describe, expect, it } from 'vitest';
import { safeNextPath } from './navigation';

describe('safeNextPath', () => {
  it('keeps local application routes and query strings', () => {
    expect(safeNextPath('/patients?page=2')).toBe('/patients?page=2');
  });

  it.each(['/doctors', '/doctors/new', '/doctors/abc123', '/doctors/abc123/edit', '/analytics', '/settings', '/profile'])(
    'keeps the known protected route %s',
    (value) => expect(safeNextPath(value)).toBe(value)
  );

  it.each(['/this-page-does-not-exist', '/login', '/doctors/a/b/c', '/dashboard/extra'])(
    'falls back to the dashboard for the unknown route %s',
    (value) => expect(safeNextPath(value)).toBe('/dashboard')
  );

  it.each(['https://example.com', '//example.com', '/\\\\example.com', 'javascript:alert(1)', null])(
    'rejects unsafe redirect %s',
    (value) => expect(safeNextPath(value)).toBe('/dashboard')
  );
});

