/** Only real, protected application routes may receive a post-login redirect. */
const APP_ROUTE_PATTERNS = [
  /^\/dashboard$/,
  /^\/doctors(?:\/new)?$/,
  /^\/doctors\/[A-Za-z0-9_-]+(?:\/edit)?$/,
  /^\/patients(?:\/new)?$/,
  /^\/patients\/[A-Za-z0-9_-]+(?:\/edit)?$/,
  /^\/analytics$/,
  /^\/settings$/,
  /^\/profile$/,
];

/**
 * Return only same-origin application paths for post-login redirects.
 * Unknown paths fall back to the dashboard so a stale or hand-edited
 * `?next=` value can never leave the user stuck on the login screen.
 */
export function safeNextPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return '/dashboard';
  }

  try {
    const target = new URL(value, 'https://doctor-tracker.invalid');
    if (target.origin !== 'https://doctor-tracker.invalid') return '/dashboard';
    if (!APP_ROUTE_PATTERNS.some((pattern) => pattern.test(target.pathname))) return '/dashboard';
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return '/dashboard';
  }
}
