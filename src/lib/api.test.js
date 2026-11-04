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

  it('fails closed when demo API configuration is missing', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'demo');
    vi.stubEnv('NEXT_PUBLIC_DEMO_API_URL', '');
    vi.resetModules();
    const { apiFetch: demoFetch } = await import('./api');
    await expect(demoFetch('/auth/me')).rejects.toThrow(/Demo API is not configured/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('uses only the dedicated demo API base URL', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'demo');
    vi.stubEnv('NEXT_PUBLIC_DEMO_API_URL', 'https://demo-api.example.test/api/v1');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://production-api.example.test/api/v1');
    vi.resetModules();
    const { apiFetch: demoFetch } = await import('./api');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal('fetch', fetchMock);
    await demoFetch('/auth/me');
    expect(fetchMock.mock.calls[0][0]).toBe('https://demo-api.example.test/api/v1/auth/me');
  });
});
