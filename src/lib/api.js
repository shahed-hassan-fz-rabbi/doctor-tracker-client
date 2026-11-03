/**
 * Single source of truth for backend communication.
 * The Express API is a separate service — this is the ONLY place that
 * knows its address, plus one small credentials-aware fetch wrapper.
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const REQUEST_TIMEOUT_MS = 12000;

/**
 * fetch wrapper: always sends cookies (HttpOnly JWT lives there),
 * never uses localStorage, and normalizes errors to Error instances
 * carrying { status, details }.
 */
export async function apiFetch(path, { method = 'GET', body, signal, params } = {}) {
  let url = `${API_BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        qs.append(key, value);
      }
    });
    const query = qs.toString();
    if (query) url += `?${query}`;
  }

  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  const abortFromCaller = () => controller.abort(signal.reason);
  signal?.addEventListener('abort', abortFromCaller, { once: true });

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (cause) {
    if (signal?.aborted) throw cause;
    const error = new Error(
      timedOut
        ? 'The request timed out. Check that the Doctor Tracker API and database are reachable.'
        : 'Could not reach the Doctor Tracker API. Check that the server is running and accessible.'
    );
    error.cause = cause;
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abortFromCaller);
  }

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const error = new Error(payload?.message || `Request failed (${res.status})`);
    error.status = res.status;
    error.details = payload?.details || null;
    if (res.status === 401 && path !== '/auth/me' && path !== '/auth/login') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('doctor-tracker:unauthorized'));
      }
    }
    throw error;
  }

  return payload;
}
