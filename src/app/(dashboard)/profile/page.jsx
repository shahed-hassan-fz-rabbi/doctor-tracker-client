'use client';

import { useMe } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useAuth';
import { Card, PageHeader, Badge } from '@/components/ui/Cards';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { formatDate, initials } from '@/lib/utils';
import { UserCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

/** Profile page — account identity + sign out action. */
export default function ProfilePage() {
  const { data, isLoading } = useMe();
  const logout = useLogout();
  const toast = useToast();
  const user = data?.data?.user;

  async function handleLogout() {
    await logout.mutateAsync();
    toast.info('Signed out. See you soon.');
    window.location.href = '/login';
  }

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-ivory-dark" />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Profile" description="Your administrator identity in Doctor Tracker." />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          {/* dark identity band */}
          <div className="relative bg-forest p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lime/10 blur-2xl" />
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime font-display text-xl font-bold text-forest shadow-[0_8px_24px_rgba(201,244,90,0.35)]">
                {initials(user?.name || 'Admin')}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-xl font-bold text-white">{user?.name}</p>
                <p className="truncate text-sm text-lime-soft">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-6">
            <InfoRow label="Name" value={user?.name} icon={UserCircle} />
            <InfoRow label="Email" value={user?.email} />
            <InfoRow label="Role" value={<Badge tone="lime">{user?.role || 'admin'}</Badge>} />
            <InfoRow label="Session" value="JWT HttpOnly cookie · 7 days" />
          </div>

          <div className="border-t border-line p-6">
            <Button variant="danger" onClick={handleLogout} loading={logout.isPending}>
              {!logout.isPending && <LogOut className="h-4 w-4" />}
              Sign out
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-ivory px-4 py-3">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="flex items-center gap-2 text-sm font-semibold text-ink font-display">
        {Icon && <Icon className="h-4 w-4 text-ink-soft" />}
        {value}
      </span>
    </div>
  );
}
