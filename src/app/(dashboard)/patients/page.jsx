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
import { IS_DEMO } from '@/lib/api';

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

  useEffect(() => {
    function handleTopbarSearch(event) {
      const value = event.detail?.query;
      if (typeof value !== 'string') return;
      setSearchInput(value);
      setPage(1);
    }

    window.addEventListener('doctor-tracker:patient-search', handleTopbarSearch);
    return () => window.removeEventListener('doctor-tracker:patient-search', handleTopbarSearch);
  }, []);

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
        action={!IS_DEMO && (
          <Button onClick={() => router.push('/patients/new')}>
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        )}
      />

      {/* Filters */}
      <Card className="p-4 sm:p-5">
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          <Field label="Search patients" className="min-w-0 xl:col-span-2">
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
          </Field>

          <Field label="Condition" className="min-w-0">
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

          <Field label="Gender" className="min-w-0">
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

          <Field label="From" className="min-w-0">
              <Input
                type="date"
                value={filters.dateFrom}
                aria-label="Filter from date"
                onChange={(e) => {
                  setFilters((f) => ({ ...f, dateFrom: e.target.value }));
                  setPage(1);
                }}
              />
          </Field>

          <Field label="To" className="min-w-0">
              <Input
                type="date"
                value={filters.dateTo}
                aria-label="Filter to date"
                onChange={(e) => {
                  setFilters((f) => ({ ...f, dateTo: e.target.value }));
                  setPage(1);
                }}
              />
          </Field>

          <Field label="Sort by" className="min-w-0">
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

          {hasFilters && (
            <button
              onClick={() => {
                setFilters({ search: '', condition: '', gender: '', dateFrom: '', dateTo: '', sortBy: 'createdAt', sortOrder: 'desc' });
                setSearchInput('');
                setPage(1);
              }}
              className="inline-flex h-10 w-fit items-center gap-1.5 self-end rounded-lg border border-line bg-white px-3 text-sm text-ink-soft transition hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/50 cursor-pointer"
              aria-label="Clear patient filters"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card className="min-w-0 p-0">
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
              !hasFilters && !IS_DEMO && (
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
              className="hidden min-w-0 md:block"
              tableClassName="min-w-[1105px] table-fixed"
              columns={[
                { key: 'name', label: 'Patient', width: '260px', className: 'pl-6' },
                { key: 'age', label: 'Age / Gender', width: '130px', className: 'pl-4' },
                { key: 'condition', label: 'Condition', width: '170px', className: 'pl-4' },
                { key: 'doctor', label: 'Doctor', width: '205px', className: 'pl-4' },
                { key: 'created', label: 'Registered', width: '170px', className: 'pl-4' },
                { key: 'actions', label: 'Actions', width: '170px', className: 'pl-4 pr-6 text-right' },
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
                  <td className="py-3.5 pl-6 pr-5">
                    <Link href={`/patients/${p.id || p._id}`} className="block break-words text-sm font-semibold text-ink hover:underline font-display">
                      {p.fullName}
                    </Link>
                    <p className="mt-0.5 whitespace-nowrap text-xs text-ink-soft">{p.phone}</p>
                  </td>
                  <td className="px-4 text-sm text-ink-soft"><span className="font-semibold text-ink">{p.age}</span><span className="mx-1 text-ink-soft/60">·</span>{p.gender}</td>
                  <td className="px-4">
                    <Badge tone="green">{p.condition}</Badge>
                  </td>
                  <td className="break-words px-4 text-sm text-ink-soft">
                    {p.doctor ? p.doctor.name : <span className="italic">Unassigned</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 text-sm text-ink-soft">{formatDate(p.createdAt)}</td>
                  <td className="px-4">
                    <div className="flex justify-end gap-1.5">
                      <IconLink href={`/patients/${p.id || p._id}`} icon={Eye} label={`View ${p.fullName}`} />
                      {!IS_DEMO && <IconLink href={`/patients/${p.id || p._id}/edit`} icon={Pencil} label={`Edit ${p.fullName}`} />}
                      {!IS_DEMO && <>
                      <button
                        onClick={() => setPendingDelete(p)}
                        className="rounded-lg p-2 text-ink-soft transition hover:bg-danger/10 hover:text-danger cursor-pointer"
                        aria-label={`Delete ${p.fullName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      </>}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </Table>

            {/* Mobile cards */}
            <div className="divide-y divide-line md:hidden">
              {rows.map((p) => (
                <article key={p.id || p._id} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-3 p-4">
                  <Link
                    href={`/patients/${p.id || p._id}`}
                    aria-label={`View ${p.fullName}`}
                    className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime font-display text-xs font-bold text-forest shadow-soft">
                      {initials(p.fullName)}
                    </span>
                    <span className="min-w-0">
                      <span className="block break-words text-sm font-semibold text-ink">{p.fullName}</span>
                      <span className="mt-0.5 block break-all text-xs text-ink-soft">{p.phone}</span>
                    </span>
                  </Link>
                  <div className="flex items-center gap-1 self-center">
                    <IconLink href={`/patients/${p.id || p._id}`} icon={Eye} label={`View ${p.fullName}`} />
                    {!IS_DEMO && <IconLink href={`/patients/${p.id || p._id}/edit`} icon={Pencil} label={`Edit ${p.fullName}`} />}
                    {!IS_DEMO && <>
                    <button
                      onClick={() => setPendingDelete(p)}
                      className="rounded-lg p-2 text-ink-soft transition hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 cursor-pointer"
                      aria-label={`Delete ${p.fullName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    </>}
                  </div>
                  <div className="col-span-2 grid min-w-0 grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3 text-xs">
                    <PatientMeta label="Age / Gender" value={`${p.age} · ${p.gender}`} />
                    <PatientMeta label="Condition" value={p.condition} />
                    <PatientMeta label="Doctor" value={p.doctor ? p.doctor.name : 'Unassigned'} />
                    <PatientMeta label="Registered" value={formatDate(p.createdAt)} />
                  </div>
                </article>
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

function IconLink({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
      className="rounded-lg p-2 text-ink-soft transition hover:bg-ivory-dark hover:text-ink"
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}

function PatientMeta({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="font-medium uppercase tracking-wide text-ink-soft/75">{label}</p>
      <p className="mt-0.5 break-words text-sm font-medium text-ink">{value}</p>
    </div>
  );
}
