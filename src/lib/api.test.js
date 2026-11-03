import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from './api';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('apiFetch', () => {
  it('sends HttpOnly session cookies with requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal('fetch', fetchMock);

    await apiFetch('/auth/me');

    expect(fetchMock.mock.calls[0][1].credentials).toBe('include');
    expect(fetchMock.mock.calls[0][1].cache).toBe('no-store');
  });

  it('turns an unavailable API into a clear error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(apiFetch('/auth/me')).rejects.toThrow(/Could not reach the Doctor Tracker API/);
  });

  it('times out a stalled request instead of leaving auth loading forever', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn((_url, options) => new Promise((_, reject) => {
        options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      }))
    );

    const request = apiFetch('/auth/me');
    const assertion = expect(request).rejects.toThrow(/request timed out/i);
    await vi.advanceTimersByTimeAsync(12000);
    await assertion;
  });
});
