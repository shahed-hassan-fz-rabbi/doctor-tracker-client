/** A viewer may use the full app only inside the isolated demo deployment. */
export function isDemoViewer(user, isDemo) {
  return Boolean(isDemo && user?.provider === 'demo' && user?.role === 'viewer');
}

export function canAccessDashboard(user, isDemo) {
  return user?.role === 'admin' || isDemoViewer(user, isDemo);
}
