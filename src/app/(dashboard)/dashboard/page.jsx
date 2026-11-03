'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Users,
  UserCheck,
  TrendingUp,
  ArrowRight,
  CalendarDays,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useAnalyticsOverview, useDoctorSpecializations } from '@/hooks/useAnalytics';
import { StatCard, Card, CardDark, PageHeader, Badge } from '@/components/ui/Cards';
import EmptyState from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/Table';
import { compactNumber, formatDate, initials } from '@/lib/utils';

const CHART_COLORS = ['#C9F45A', '#3C9B58', '#E9A83B', '#D6E8A0', '#D95757', '#687064', '#2A3D1C', '#9CB358', '#E2C17A', '#7D8368'];
const CHART_TOOLTIP = {
  contentStyle: {
    background: '#101B0B',
    border: '1px solid #2A3D1C',
    borderRadius: 12,
    color: '#F1F0E7',
    fontSize: 12,
  },
  labelStyle: { color: '#D6E8A0' },
};

export default function DashboardPage() {
  const { data, isLoading, isError } = useAnalyticsOverview();
  const stats = data?.data;

  if (isError) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="Analytics unavailable"
        description="The analytics service could not be reached. Refresh or try again shortly."
      />
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded bg-ivory-dark" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-ivory-dark" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-2xl bg-ivory-dark lg:col-span-2" />
          <div className="h-80 animate-pulse rounded-2xl bg-ivory-dark" />
        </div>
      </div>
    );
  }

  const monthlyGrowth = stats.monthlyGrowthPercent ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Live operational overview of doctors and patients."
      />

      {/* Stat row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Doctors" value={compactNumber(stats.totalDoctors)} icon={Stethoscope} />
        <StatCard label="Total Patients" value={compactNumber(stats.totalPatients)} icon={Users} tone="light" />
        <StatCard
          label="Active Doctors"
          value={compactNumber(stats.activeDoctors)}
          icon={UserCheck}
          deltaLabel={`${stats.inactiveDoctors} inactive`}
        />
        <StatCard
          label="New Patients (30d)"
          value={compactNumber(stats.newPatientsThisMonth)}
          icon={CalendarDays}
          delta={monthlyGrowth}
          deltaLabel="vs previous month"
          tone="light"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Patient registrations</h2>
              <p className="text-xs text-ink-soft">Monthly growth over the last {stats.monthlySeries.length || 6} months</p>
            </div>
            <Badge tone="lime">{compactNumber(stats.newPatientsThisMonth)} this month</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={(stats.monthlySeries || []).map((d) => ({ month: d._id, count: d.count }))}>
                <defs>
                  <linearGradient id="limeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9F45A" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#C9F45A" stopOpacity={0.15} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E5D8" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#687064' }} stroke="#E2E5D8" />
                <YAxis tick={{ fontSize: 11, fill: '#687064' }} stroke="#E2E5D8" allowDecimals={false} />
                <Tooltip {...CHART_TOOLTIP} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Patients"
                  stroke="#17240F"
                  strokeWidth={2}
                  fill="url(#limeFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <CardDark className="p-5">
          <div className="mb-2">
            <h2 className="font-display text-lg font-bold">Doctors by specialization</h2>
            <p className="text-xs text-lime-soft/70">Distribution across {stats.totalDoctors} doctors</p>
          </div>
          {stats.patientsByCondition && <SpecializationMini />}
        </CardDark>
      </div>

      {/* Recent + growth */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent doctors */}
        <Card className="p-0 lg:col-span-1">
          <div className="flex items-center justify-between border-b border-line p-4">
            <h2 className="font-display text-base font-bold text-ink">Recent doctors</h2>
            <Link href="/doctors" className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-line">
            {stats.recentDoctors.length === 0 && (
              <p className="p-6 text-center text-sm text-ink-soft">No doctors registered yet.</p>
            )}
            {stats.recentDoctors.map((doc, i) => (
              <motion.div
                key={doc.id || doc._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest font-display text-xs font-bold text-lime">
                  {initials(doc.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{doc.name}</p>
                  <p className="truncate text-xs text-ink-soft">{doc.specialization}</p>
                </div>
                <Badge tone={doc.isActive ? 'green' : 'gray'}>{doc.isActive ? 'Active' : 'Inactive'}</Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recent patients */}
        <Card className="p-0 lg:col-span-1">
          <div className="flex items-center justify-between border-b border-line p-4">
            <h2 className="font-display text-base font-bold text-ink">Recent patients</h2>
            <Link href="/patients" className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-line">
            {stats.recentPatients.length === 0 && (
              <p className="p-6 text-center text-sm text-ink-soft">No patients registered yet.</p>
            )}
            {stats.recentPatients.map((p, i) => (
              <motion.div
                key={p.id || p._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime font-display text-xs font-bold text-forest">
                  {initials(p.fullName)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{p.fullName}</p>
                  <p className="text-xs text-ink-soft">
                    {p.age} yrs · {p.condition}
                  </p>
                </div>
                <span className="hidden shrink-0 text-xs text-ink-soft sm:block">{formatDate(p.createdAt)}</span>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Patients per doctor summary */}
        <CardDark className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Patients per doctor</h2>
              <p className="text-xs text-lime-soft/70">Current operating balance</p>
            </div>
            <UserCheck className="h-6 w-6 text-lime" />
          </div>
          <p className="mt-6 font-display text-5xl font-bold text-lime">
            {stats.avgPatientsPerDoctor}
          </p>
          <p className="mt-1 text-sm text-ivory/70">average patients per doctor</p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-forest-700/70 px-4 py-3">
              <span className="text-sm text-ivory/80">Busiest doctor</span>
              <span className="font-display text-lg font-bold text-white">{stats.maxDoctorLoad}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-forest-700/70 px-4 py-3">
              <span className="text-sm text-ivory/80">Patient load ratio</span>
              <span className="font-display text-lg font-bold text-white">
                {stats.activeDoctors} : {stats.totalPatients}
              </span>
            </div>
          </div>
        </CardDark>
      </div>
    </div>
  );
}

/** small pie for the specialization distribution on the dark panel */
function SpecializationMini() {
  const { data, isLoading } = useDoctorSpecializations();
  const rows = (data?.data || []).slice(0, 6);

  if (isLoading) {
    return <div className="mt-6 h-56 animate-pulse rounded-xl bg-forest-700/70" />;
  }
  if (rows.length === 0) {
    return <p className="mt-6 text-sm text-ivory/60">No specializations recorded yet.</p>;
  }

  return (
    <div className="mt-2">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={rows}
              dataKey="count"
              nameKey="specialization"
              innerRadius="58%"
              outerRadius="85%"
              paddingAngle={3}
              stroke="#101B0B"
            >
              {rows.map((entry, i) => (
                <Cell key={entry.specialization} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip {...CHART_TOOLTIP} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {rows.map((r, i) => (
          <div key={r.specialization} className="flex items-center gap-2 text-xs text-ivory/80">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span className="truncate">{r.specialization}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
