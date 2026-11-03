/**
 * Single source of truth for backend communication.
 * The Express API is a separate service — this is the ONLY place that
 * knows its address, plus one small credentials-aware fetch wrapper.
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

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

  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'include',
    signal,
    body: body ? JSON.stringify(body) : undefined,
  });

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
    throw error;
  }

  return payload;
}
