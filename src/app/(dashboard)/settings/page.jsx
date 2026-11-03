'use client';

import { useMe } from '@/hooks/useAuth';
import { Card, CardDark, PageHeader, Badge } from '@/components/ui/Cards';
import { formatDate, initials } from '@/lib/utils';
import { Settings as SettingsIcon, Shield, Database, Server } from 'lucide-react';

/** App settings + a small system overview (read-only information panel). */
export default function SettingsPage() {
  const { data } = useMe();
  const user = data?.data?.user;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Account information and system configuration overview."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Account summary (dark panel) */}
        <CardDark className="p-6 lg:col-span-1">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-lime font-display text-lg font-bold text-forest">
              {initials(user?.name || 'Admin')}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold">{user?.name}</p>
              <p className="truncate text-sm text-lime-soft/80">{user?.email}</p>
            </div>
          </div>
          <div className="mt-5 rounded-xl bg-forest-700/60 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ivory/70">Role</span>
              <Badge tone="lime">{user?.role || 'admin'}</Badge>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ivory/60">
            Administrator accounts are provisioned by the backend seed script.
            Password and credentials are never stored, displayed or editable here.
          </p>
        </CardDark>

        {/* System overview */}
        <div className="space-y-4 lg:col-span-2">
          <ConfigRow
            icon={Shield}
            title="Authentication"
            body="JWT session cookie — HttpOnly, SameSite=Lax, 7-day expiry. Tokens never touch localStorage."
          />
          <ConfigRow
            icon={Database}
            title="Database"
            body="MongoDB Atlas with Mongoose. Referenced doctor ↔ patient model, aggregation-powered analytics."
          />
          <ConfigRow
            icon={Server}
            title="API service"
            body="Standalone Express API under /api/v1 — the client talks to it over REST with credentialed requests."
          />
          <ConfigRow
            icon={SettingsIcon}
            title="Rate limiting & headers"
            body="Helmet security headers, global API limiter and a stricter limiter on the login route."
          />
        </div>
      </div>
    </div>
  );
}

function ConfigRow({ icon: Icon, title, body }) {
  return (
    <Card className="flex items-start gap-4 p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest">
        <Icon className="h-4 w-4 text-lime" />
      </span>
      <div>
        <h3 className="font-display text-sm font-bold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{body}</p>
      </div>
    </Card>
  );
}
