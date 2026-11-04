'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Stethoscope,
  Plus,
  Search,
  X,
  SlidersHorizontal,
  Pencil,
  Trash2,
  Eye,
} from 'lucide-react';
import { useDoctors, useDeleteDoctor } from '@/hooks/useDoctors';
import { SPECIALIZATIONS } from '@/features/constants';
import { Card, PageHeader, Badge } from '@/components/ui/Cards';
import Button from '@/components/ui/Button';
import Table, { TableSkeleton } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { ConfirmDialog, useToast } from '@/components/ui/Toast';
import { Input, Select, Field } from '@/components/ui/Form';
import { formatDate } from '@/lib/utils';
import { IS_DEMO } from '@/lib/api';

/**
 * Doctors index page: server-side search (debounced), specialization filter,
 * date-range filter, sorting and pagination — all driven by API params.
 */
export default function DoctorsPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [searchInput, setSearchInput] = useState(params.get('search') || '');
  const [filters, setFilters] = useState({
    search: params.get('search') || '',
    specialization: '',
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
      Object.entries({ ...filters, page, limit: 10, sort: undefined }).filter(
        ([, v]) => v !== '' && v !== undefined && v !== null
      )
    );
    return clean;
  }, [filters, page]);

  const { data, isLoading, isError } = useDoctors(listParams);
  const deleteDoctor = useDeleteDoctor();
  const toast = useToast();
  const [pendingDelete, setPendingDelete] = useState(null);

  const rows = data?.data || [];
  const meta = data?.meta;

  const hasFilters = Boolean(
    filters.search || filters.specialization || filters.dateFrom || filters.dateTo
  );

  async function handleConfirmDelete(doctor, doctorName) {
    setPendingDelete(null);
    try {
      await deleteDoctor.mutateAsync(doctor.id || doctor._id);
      toast.success(`“${doctorName}” deleted. Their patients are now unassigned.`);
    } catch (err) {
      toast.error(err?.message || 'Could not delete this doctor.');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        description="Registered specialists across every partner hospital."
        action={!IS_DEMO && (
          <Button onClick={() => router.push('/doctors/new')}>
            <Plus className="h-4 w-4" />
            Add Doctor
          </Button>
        )}
      />

      {/* Filter bar */}
      <Card className="p-4 sm:p-5">
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <Field label="Search doctors" className="min-w-0 xl:col-span-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search name, hospital, specialization…"
                className="pl-9"
                aria-label="Search doctors"
              />
            </div>
          </Field>

          <Field label="Specialization" className="min-w-0 xl:col-span-2">
            <Select
              value={filters.specialization}
              onChange={(e) => {
                setFilters((f) => ({ ...f, specialization: e.target.value }));
                setPage(1);
              }}
              aria-label="Filter by specialization"
            >
              <option value="">All</option>
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="From" className="min-w-0">
            <Input
              type="date"
              value={filters.dateFrom}
              className="w-full min-w-0"
              onChange={(e) => {
                setFilters((f) => ({ ...f, dateFrom: e.target.value }));
                setPage(1);
              }}
              aria-label="Registered from"
            />
          </Field>

          <Field label="To" className="min-w-0">
            <Input
              type="date"
              value={filters.dateTo}
              className="w-full min-w-0"
              onChange={(e) => {
                setFilters((f) => ({ ...f, dateTo: e.target.value }));
                setPage(1);
              }}
              aria-label="Registered to"
            />
          </Field>

          <Field label="Sort by" className="min-w-0">
            <Select
              value={`${filters.sortBy}:${filters.sortOrder}`}
              className="w-full min-w-0"
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split(':');
                setFilters((f) => ({ ...f, sortBy, sortOrder }));
                setPage(1);
              }}
              aria-label="Sort doctors"
            >
              <option value="createdAt:desc">Newest first</option>
              <option value="createdAt:asc">Oldest first</option>
              <option value="name:asc">Name (A→Z)</option>
              <option value="name:desc">Name (Z→A)</option>
              <option value="specialization:asc">Specialization (A→Z)</option>
              <option value="hospital:asc">Hospital (A→Z)</option>
            </Select>
          </Field>

          {hasFilters && (
            <button
              onClick={() => {
                setFilters({ search: '', specialization: '', dateFrom: '', dateTo: '', sortBy: 'createdAt', sortOrder: 'desc' });
                setSearchInput('');
                setPage(1);
              }}
              className="inline-flex h-10 w-fit items-center gap-1.5 self-end rounded-lg border border-line bg-white px-3 text-sm text-ink-soft transition hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/50 cursor-pointer"
              aria-label="Clear doctor filters"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* List */}
      <Card className="min-w-0 p-0">
        {isLoading ? (
          <TableSkeleton rows={6} />
        ) : isError ? (
          <EmptyState
            icon={Stethoscope}
            title="Could not load doctors"
            description="The doctors service is unreachable right now. Try refreshing."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title={hasFilters ? 'No doctors match your filters' : 'No doctors yet'}
            description={
              hasFilters
                ? 'Try adjusting or clearing the filters above.'
                : 'Register the first doctor to start building the roster.'
            }
            action={
              !hasFilters && !IS_DEMO && (
                <Button onClick={() => router.push('/doctors/new')}>
                  <Plus className="h-4 w-4" />
                  Add Doctor
                </Button>
              )
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <Table
              className="hidden min-w-0 md:block"
              tableClassName="min-w-[1000px] table-fixed xl:min-w-0"
              columns={[
                { key: 'name', label: 'Doctor', width: '24%', className: 'pl-6 pr-5' },
                { key: 'specialization', label: 'Specialization', width: '17%', className: 'px-4' },
                { key: 'hospital', label: 'Hospital', width: '19%', className: 'px-4' },
                { key: 'patients', label: 'Patients', width: '9%', className: 'px-4' },
                { key: 'created', label: 'Registered', width: '15%', className: 'px-4' },
                { key: 'actions', label: 'Actions', width: '16%', className: 'px-6 text-right' },
              ]}
            >
              {rows.map((doc, i) => (
                  <motion.tr
                    key={doc.id || doc._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="group border-b border-line last:border-0 hover:bg-ivory/60"
                  >
                    <td className="py-3.5 pl-6 pr-5 align-middle">
                      <Link href={`/doctors/${doc.id || doc._id}`} className="block break-words font-semibold text-ink hover:text-forest hover:underline font-display">
                        {doc.name}
                      </Link>
                      <p className="mt-0.5 break-all text-xs text-ink-soft">{doc.email}</p>
                    </td>
                    <td className="px-4 py-3.5 align-middle text-sm text-ink">{doc.specialization}</td>
                    <td className="break-words px-4 py-3.5 align-middle text-sm text-ink-soft">{doc.hospital}</td>
                    <td className="px-4 py-3.5 align-middle">
                      <Badge tone="lime">{doc.patientCount}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 align-middle text-sm text-ink-soft">{formatDate(doc.createdAt)}</td>
                    <td className="px-6 py-3.5 align-middle">
                      <div className="flex justify-end gap-1.5">
                        <IconLink
                          href={`/doctors/${doc.id || doc._id}`}
                          icon={Eye}
                          label={`View ${doc.name}`}
                        />
                        {!IS_DEMO && <>
                        <IconLink
                          href={`/doctors/${doc.id || doc._id}/edit`}
                          icon={Pencil}
                          label={`Edit ${doc.name}`}
                        />
                        <button
                          onClick={() => setPendingDelete({ id: doc.id || doc._id, name: doc.name })}
                          className="rounded-lg p-2 text-ink-soft transition hover:bg-danger/10 hover:text-danger cursor-pointer"
                          aria-label={`Delete ${doc.name}`}
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
              {rows.map((doc) => (
                <article key={doc.id || doc._id} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-3 p-4">
                  <Link
                    href={`/doctors/${doc.id || doc._id}`}
                    aria-label={`View ${doc.name}`}
                    className="min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60"
                  >
                    <span className="block break-words font-semibold text-ink font-display">{doc.name}</span>
                    <span className="mt-0.5 block break-all text-xs text-ink-soft">{doc.email}</span>
                  </Link>
                  <div className="flex items-start gap-1">
                    <IconLink href={`/doctors/${doc.id || doc._id}`} icon={Eye} label={`View ${doc.name}`} />
                    {!IS_DEMO && <IconLink href={`/doctors/${doc.id || doc._id}/edit`} icon={Pencil} label={`Edit ${doc.name}`} />}
                    {!IS_DEMO && <>
                    <button
                      onClick={() => setPendingDelete({ id: doc.id || doc._id, name: doc.name })}
                      className="rounded-lg p-2 text-ink-soft transition hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 cursor-pointer"
                      aria-label={`Delete ${doc.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    </>}
                  </div>
                  <div className="col-span-2 grid min-w-0 grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3 text-xs sm:grid-cols-3">
                    <DoctorMeta label="Specialization" value={doc.specialization} />
                    <DoctorMeta label="Hospital" value={doc.hospital} />
                    <DoctorMeta label="Patients" value={doc.patientCount} />
                    <DoctorMeta label="Registered" value={formatDate(doc.createdAt)} />
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
        title={`Delete ${pendingDelete?.name || 'doctor'}?`}
        description="The doctor will be removed permanently. Their patients will be kept but marked unassigned."
        confirmLabel="Delete doctor"
        loading={deleteDoctor.isPending}
        onConfirm={() => handleConfirmDelete(pendingDelete, pendingDelete.name)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function IconLink({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
      className="rounded-lg p-2 text-ink-soft transition hover:bg-ivory-dark hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/50"
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}

function DoctorMeta({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="font-medium uppercase tracking-wide text-ink-soft/75">{label}</p>
      <p className="mt-0.5 break-words text-sm font-medium text-ink">{value}</p>
    </div>
  );
}
