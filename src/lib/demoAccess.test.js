import { describe, expect, it } from 'vitest';
import { canAccessDashboard, isDemoViewer } from './demoAccess';

describe('demo access policy', () => {
  it('allows the dedicated viewer inside the demo deployment', () => {
    const user = { role: 'viewer', provider: 'demo' };
    expect(isDemoViewer(user, true)).toBe(true);
    expect(canAccessDashboard(user, true)).toBe(true);
  });

  it('does not grant dashboard access to production viewers', () => {
    expect(canAccessDashboard({ role: 'viewer', provider: 'google' }, false)).toBe(false);
    expect(canAccessDashboard({ role: 'viewer', provider: 'demo' }, false)).toBe(false);
  });

  it('preserves admin dashboard access in both deployments', () => {
    expect(canAccessDashboard({ role: 'admin', provider: 'local' }, false)).toBe(true);
    expect(canAccessDashboard({ role: 'admin', provider: 'local' }, true)).toBe(true);
  });
});
