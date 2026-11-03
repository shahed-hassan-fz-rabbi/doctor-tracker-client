'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
import { TrendingUp, PieChart as PieIcon, Users as UsersIcon, Stethoscope } from 'lucide-react';
import { usePatientGrowth, usePatientsByCondition, usePatientsPerDoctor, useDoctorSpecializations } from '@/hooks/useAnalytics';
import { Card, PageHeader, Badge, StatCard } from '@/components/ui/Cards';
import { TableSkeleton } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { compactNumber } from '@/lib/utils';

const COLORS = ['#C9F45A', '#3C9B58', '#E9A83B', '#D6E8A0', '#D95757', '#687064', '#2A3D1C', '#9CB358', '#E2C17A', '#7D8368'];
const TOOLTIP = {
  contentStyle: {
    background: '#101B0B',
    border: '1px solid #2A3D1C',
    borderRadius: 12,
    color: '#F1F0E7',
    fontSize: 12,
  },
  labelStyle: { color: '#D6E8A0' },
};

/** Full analytics page — every figure comes from the backend aggregation endpoints. */
export default function AnalyticsPage() {
  const [months, setMonths] = useState(6);
  const growth = usePatientGrowth(months);
  const condition = usePatientsByCondition();
  const perDoctor = usePatientsPerDoctor();
  const specializations = useDoctorSpecializations();

  const isLoading = growth.isLoading || condition.isLoading || perDoctor.isLoading;

  if (isLoading) return <TableSkeleton rows={8} />;

  const conditionRows = condition.data?.data || [];
  const perDoctorData = perDoctor.data?.data || { rows: [], avgPatientsPerDoctor: 0 };
  const specializationRows = specializations.data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Aggregated insight from the live database — computed server-side."
      />

      {/* Growth timeline */}
      <Card className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ivory-dark">
              <TrendingUp className="h-4 w-4 text-ink" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Patient growth</h2>
              <p className="text-xs text-ink-soft">New registrations per month</p>
            </div>
          </div>
          <div className="flex gap-1 rounded-lg border border-line bg-white p-1">
            {[6, 12, 24].map((m) => (
              <button
                key={m}
                onClick={() => setMonths(m)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  months === m ? 'bg-forest text-ivory' : 'text-ink-soft hover:bg-ivory'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
        {growth.data?.data?.length === 0 ? (
          <EmptyState icon={TrendingUp} title="No registrations in this period" />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth.data?.data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E5D8" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#687064' }} stroke="#E2E5D8" />
                <YAxis tick={{ fontSize: 11, fill: '#687064' }} stroke="#E2E5D8" allowDecimals={false} />
                <Tooltip {...TOOLTIP} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="New patients"
                  stroke="#17240F"
                  strokeWidth={2.5}
                  dot={{ fill: '#C9F45A', stroke: '#17240F', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Condition distribution + specializations */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ivory-dark">
              <PieIcon className="h-4 w-4 text-ink" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Patients by condition</h2>
              <p className="text-xs text-ink-soft">Share of each condition across the record base</p>
            </div>
          </div>
          {conditionRows.length === 0 ? (
            <EmptyState icon={PieIcon} title="No patient conditions recorded" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={conditionRows}
                      dataKey="count"
                      nameKey="condition"
                      innerRadius="55%"
                      outerRadius="82%"
                      paddingAngle={3}
                      stroke="#FFFFFF"
                    >
                      {conditionRows.map((entry, i) => (
                        <Cell key={entry.condition} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...TOOLTIP} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-2">
                {conditionRows.map((r, i) => (
                  <li key={r.condition} className="flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="flex-1 text-ink">{r.condition}</span>
                    <span className="text-ink-soft">
                      {r.count} · {r.percentage}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ivory-dark">
              <Stethoscope className="h-4 w-4 text-ink" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Doctor specializations</h2>
              <p className="text-xs text-ink-soft">How the roster is distributed</p>
            </div>
          </div>
          {specializationRows.length === 0 ? (
            <EmptyState icon={Stethoscope} title="No doctors registered yet" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={specializationRows.map((r) => ({ ...r, label: r.specialization.slice(0, 6) }))}
                  margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E5D8" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#687064' }} stroke="#E2E5D8" />
                  <YAxis tick={{ fontSize: 11, fill: '#687064' }} stroke="#E2E5D8" allowDecimals={false} />
                  <Tooltip {...TOOLTIP} />
                  <Bar dataKey="count" name="Doctors" fill="#C9F45A" radius={[6, 6, 0, 0]} stroke="#17240F" strokeWidth={1} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Patients per doctor */}
      <Card className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ivory-dark">
              <UsersIcon className="h-4 w-4 text-ink" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Patients per doctor</h2>
              <p className="text-xs text-ink-soft">Operating load of every doctor in the roster</p>
            </div>
          </div>
          <Badge tone="lime">Average {perDoctorData.avgPatientsPerDoctor} patients/doctor</Badge>
        </div>

        {perDoctorData.rows.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No doctors registered yet" />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perDoctorData.rows.slice(0, 12)} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E5D8" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#687064' }}
                  stroke="#E2E5D8"
                  tickFormatter={(v) => v.replace('Dr. ', '')}
                />
                <YAxis tick={{ fontSize: 11, fill: '#687064' }} stroke="#E2E5D8" allowDecimals={false} />
                <Tooltip {...TOOLTIP} />
                <Bar dataKey="patientCount" name="Patients" fill="#3C9B58" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}
