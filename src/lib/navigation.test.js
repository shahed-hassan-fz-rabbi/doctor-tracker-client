import { describe, expect, it } from 'vitest';
import { safeNextPath } from './navigation';

describe('safeNextPath', () => {
  it('keeps local application routes and query strings', () => {
    expect(safeNextPath('/patients?page=2')).toBe('/patients?page=2');
  });

  it.each(['https://example.com', '//example.com', '/\\\\example.com', 'javascript:alert(1)', null])(
    'rejects unsafe redirect %s',
    (value) => expect(safeNextPath(value)).toBe('/dashboard')
  );
});
