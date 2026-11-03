'use client';

import { useRouter } from 'next/navigation';
import { usePatients, useCreatePatient, useDeletePatient } from '@/hooks/usePatients';
import { CONDITIONS, GENDERS } from '@/features/constants';
import { Card, PageHeader, Badge } from '@/components/ui/Cards';
import Button from '@/components/ui/Button';
import Table, { TableSkeleton } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { ConfirmDialog, useToast } from '@/components/ui/Toast';
import { Input, Select, Field } from '@/components/ui/Form';
import { formatDate, initials } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Search, X, Plus, Users, Trash2, Pencil, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Patients index page: server-side search (debounced), condition/gender/doctor
 * filters, date range, sorting, pagination — all delegated to the API.
 */
export default function PatientsPage() {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    condition: '',
    gender: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);

  // Debounced search — 350ms after typing stops
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => (f.search === searchInput ? f : { ...f, search: searchInput }));
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const listParams = useMemo(() => {
    const clean = Object.fromEntries(
      Object.entries({ ...filters, page, limit: 10 }).filter(([, v]) => v !== '' && v != null)
    );
    return clean;
  }, [filters, page]);

  const { data, isLoading, isError } = usePatients(listParams);
  const deletePatient = useDeletePatient();
  const toast = useToast();
  const [pendingDelete, setPendingDelete] = useState(null);

  const rows = data?.data || [];
  const meta = data?.meta;

  const hasFilters = Boolean(
    filters.search || filters.condition || filters.gender || filters.dateFrom || filters.dateTo
  );

  async function handleConfirmDelete(p) {
    setPendingDelete(null);
    try {
      await deletePatient.mutateAsync(p.id || p._id);
      toast.success(`“${p.fullName}” was removed from the records.`);
    } catch (err) {
      toast.error(err?.message || 'Could not delete this patient.');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Every registered patient across the practice."
        action={
          <Button onClick={() => router.push('/patients/new')}>
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        }
      />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1 lg:max-w-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search name, phone, email…"
                className="pl-9"
                aria-label="Search patients"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex-1 xl:grid-cols-5">
            <Field label="Condition">
              <Select
                value={filters.condition}
                onChange={(e) => {
                  setFilters((f) => ({ ...f, condition: e.target.value }));
                  setPage(1);
                }}
                aria-label="Filter by condition"
              >
                <option value="">All</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Gender">
              <Select
                value={filters.gender}
                onChange={(e) => {
                  setFilters((f) => ({ ...f, gender: e.target.value }));
                  setPage(1);
                }}
                aria-label="Filter by gender"
              >
                <option value="">All</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="From">
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => {
                  setFilters((f) => ({ ...f, dateFrom: e.target.value }));
                  setPage(1);
                }}
              />
            </Field>

            <Field label="To">
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => {
                  setFilters((f) => ({ ...f, dateTo: e.target.value }));
                  setPage(1);
                }}
              />
            </Field>

            <Field label="Sort by">
              <Select
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split(':');
                  setFilters((f) => ({ ...f, sortBy, sortOrder }));
                  setPage(1);
                }}
                aria-label="Sort patients"
              >
                <option value="createdAt:desc">Newest first</option>
                <option value="createdAt:asc">Oldest first</option>
                <option value="fullName:asc">Name (A→Z)</option>
                <option value="fullName:desc">Name (Z→A)</option>
                <option value="age:asc">Age (low→high)</option>
                <option value="age:desc">Age (high→low)</option>
                <option value="condition:asc">Condition (A→Z)</option>
              </Select>
            </Field>
          </div>

          {hasFilters && (
            <button
              onClick={() => {
                setFilters({ search: '', condition: '', gender: '', dateFrom: '', dateTo: '', sortBy: 'createdAt', sortOrder: 'desc' });
                setSearchInput('');
                setPage(1);
              }}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-sm text-ink-soft hover:bg-ivory cursor-pointer"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0">
        {isLoading ? (
          <TableSkeleton rows={6} />
        ) : isError ? (
          <EmptyState
            icon={Users}
            title="Could not load patients"
            description="The patients service is unreachable right now. Try refreshing."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Users}
            title={hasFilters ? 'No patients match your filters' : 'No patients yet'}
            description={hasFilters ? 'Try adjusting or clearing the filters above.' : 'Register the first patient to get started.'}
            action={
              !hasFilters && (
                <Button onClick={() => router.push('/patients/new')}>
                  <Plus className="h-4 w-4" />
                  Add Patient
                </Button>
              )
            }
          />
        ) : (
          <>
            <Table
              className="hidden md:block"
              columns={[
                { key: 'name', label: 'Patient' },
                { key: 'age', label: 'Age / Gender' },
                { key: 'condition', label: 'Condition' },
                { key: 'doctor', label: 'Doctor' },
                { key: 'created', label: 'Registered' },
                { key: 'actions', label: '' },
              ]}
            >
              {rows.map((p, i) => (
                <motion.tr
                  key={p.id || p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="group border-b border-line last:border-0 hover:bg-ivory/60"
                  data-testid="patient-row"
                >
                  <td className="py-3.5 pr-4">
                    <Link href={`/patients/${p.id || p._id}`} className="font-medium text-ink hover:underline font-display">
                      {p.fullName}
                    </Link>
                    <p className="text-xs text-ink-soft">{p.phone}</p>
                  </td>
                  <td className="pr-4 text-sm text-ink-soft">{p.age} · {p.gender}</td>
                  <td className="pr-4">
                    <Badge tone="green">{p.condition}</Badge>
                  </td>
                  <td className="pr-4 text-sm text-ink-soft">
                    {p.doctor ? p.doctor.name : <span className="italic">Unassigned</span>}
                  </td>
                  <td className="pr-4 text-sm text-ink-soft">{formatDate(p.createdAt)}</td>
                  <td className="pr-4">
                    <div className="flex justify-end gap-1 opacity-60 transition group-hover:opacity-100">
                      <IconLink href={`/patients/${p.id || p._id}`} icon={Eye} label={`View ${p.fullName}`} />
                      <IconLink href={`/patients/${p.id || p._id}/edit`} icon={Pencil} label={`Edit ${p.fullName}`} />
                      <button
                        onClick={() => setPendingDelete(p)}
                        className="rounded-lg p-2 text-ink-soft transition hover:bg-danger/10 hover:text-danger cursor-pointer"
                        aria-label={`Delete ${p.fullName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </Table>

            {/* Mobile cards */}
            <div className="md:hidden">
              {rows.map((p) => (
                <Link
                  key={p.id || p._id}
                  href={`/patients/${p.id || p._id}`}
                  className="flex items-center gap-3 border-b border-line p-4 last:border-0 active:bg-ivory"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime font-display text-xs font-bold text-forest">
                    {initials(p.fullName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{p.fullName}</p>
                    <p className="truncate text-xs text-ink-soft">
                      {p.condition} · {p.age} yrs · {p.doctor ? p.doctor.name : 'Unassigned'}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-ink-soft">{formatDate(p.createdAt)}</span>
                </Link>
              ))}
            </div>

            <div className="border-t border-line p-4">
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${pendingDelete?.fullName || 'patient'}?`}
        description="This removes the patient record permanently. This action cannot be undone."
        confirmLabel="Delete patient"
        loading={deletePatient.isPending}
        onConfirm={() => handleConfirmDelete(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function IconLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="rounded-lg p-2 text-ink-soft transition hover:bg-ivory-dark hover:text-ink"
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}
