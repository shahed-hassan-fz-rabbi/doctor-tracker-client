/** Return only same-origin application paths for post-login redirects. */
export function safeNextPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return '/dashboard';
  }

  try {
    const target = new URL(value, 'https://doctor-tracker.invalid');
    if (target.origin !== 'https://doctor-tracker.invalid') return '/dashboard';
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return '/dashboard';
  }
}
