import { describe, it, expect } from 'vitest';
import { cn, formatDate, compactNumber, initials } from './utils';

describe('cn (className merge)', () => {
  it('joins conditional classes', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });

  it('merges conflicting tailwind classes (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});

describe('formatDate', () => {
  it('formats ISO dates readably', () => {
    expect(formatDate('2026-03-04T10:00:00.000Z')).toMatch(/Mar\s+\d{1,2},\s+2026|Feb|Mar/);
  });

  it('returns an em dash for missing values', () => {
    expect(formatDate(null)).toBe('—');
  });
});

describe('compactNumber', () => {
  it('compacts thousands', () => {
    expect(compactNumber(1200)).toMatch(/1\.2K/);
  });

  it('handles null safely', () => {
    expect(compactNumber(null)).toBe('—');
  });
});

describe('initials', () => {
  it('takes the first letters of up to two words', () => {
    expect(initials('Ada Marlowанов Зеленский')).toBe('AM');
    expect(initials('Ada')).toBe('A');
    expect(initials('')).toBe('');
  });
});
