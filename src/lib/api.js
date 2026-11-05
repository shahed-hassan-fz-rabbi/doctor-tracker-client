/**
 * Single source of truth for backend communication.
 * The Express API is a separate service — this is the ONLY place that
 * knows its address, plus one small credentials-aware fetch wrapper.
 */
export const IS_DEMO = process.env.NEXT_PUBLIC_APP_ENV === 'demo';
const configuredDemoApiBase = process.env.NEXT_PUBLIC_DEMO_API_URL?.trim() || '';
const configuredDemoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL?.trim() || '';
const configuredDemoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD || '';
// The separate demo deployment must explicitly opt in and provide its own API
// and public demo credentials. Production is never used as a fallback.
export const DEMO_AVAILABLE = IS_DEMO
  && process.env.NEXT_PUBLIC_DEMO_AVAILABLE === 'true'
  && Boolean(configuredDemoApiBase && configuredDemoEmail && configuredDemoPassword);
const configuredApiBase = IS_DEMO
  ? configuredDemoApiBase
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1');
// A demo build fails closed instead of ever falling back to the production API.
export const API_BASE = configuredApiBase || '';
export const DEMO_CREDENTIALS = DEMO_AVAILABLE
  ? { email: configuredDemoEmail, password: configuredDemoPassword }
  : null;
const REQUEST_TIMEOUT_MS = 12000;

/**
 * fetch wrapper: always sends cookies (HttpOnly JWT lives there),
 * never uses localStorage, and normalizes errors to Error instances
 * carrying { status, details }.
 */
export async function apiFetch(path, { method = 'GET', body, signal, params } = {}) {
  if (!API_BASE) throw new Error('The Demo API is not configured for this deployment.');
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
    if (res.status === 401 && path !== '/auth/me' && path !== '/auth/login' && path !== '/auth/demo-login') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('doctor-tracker:unauthorized'));
      }
    }
    if (res.status === 403) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('doctor-tracker:forbidden'));
      }
    }
    throw error;
  }

  return payload;
}
