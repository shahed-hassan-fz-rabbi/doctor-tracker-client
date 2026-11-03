'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
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
import { useToast } from '@/components/ui/Toast';
import { Input, Select, Field } from '@/components/ui/Form';
import { formatDate } from '@/lib/utils';

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
        action={
          <Button onClick={() => router.push('/doctors/new')}>
            <Plus className="h-4 w-4" />
            Add Doctor
          </Button>
        }
      />

      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1 lg:max-w-sm">
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
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex-1">
            <Field label="Specialization">
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

            <Field label="From">
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => {
                  setFilters((f) => ({ ...f, dateFrom: e.target.value }));
                  setPage(1);
                }}
                aria-label="Registered from"
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
                aria-label="Registered to"
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
          </div>

          {hasFilters && (
            <button
              onClick={() => {
                setFilters({ search: '', specialization: '', dateFrom: '', dateTo: '', sortBy: 'createdAt', sortOrder: 'desc' });
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

      {/* List */}
      <Card className="p-0">
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
              !hasFilters && (
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
              className="hidden md:block"
              columns={[
                { key: 'name', label: 'Doctor' },
                { key: 'specialization', label: 'Specialization' },
                { key: 'hospital', label: 'Hospital' },
                { key: 'patients', label: 'Patients' },
                { key: 'created', label: 'Registered' },
                { key: 'actions', label: '' },
              ]}
            >
              <tbody>
                {rows.map((doc, i) => (
                  <motion.tr
                    key={doc.id || doc._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="group border-b border-line last:border-0 hover:bg-ivory/60"
                  >
                    <td className="py-3.5 pr-4">
                      <ILink href={`/doctors/${doc.id || doc._id}`} className="font-medium text-ink hover:text-forest hover:underline font-display">
                        {doc.name}
                      </ILink>
                      <p className="text-xs text-ink-soft">{doc.email}</p>
                    </td>
                    <td className="pr-4 text-sm text-ink">{doc.specialization}</td>
                    <td className="pr-4 text-sm text-ink-soft">{doc.hospital}</td>
                    <td className="pr-4">
                      <Badge tone="lime">{doc.patientCount}</Badge>
                    </td>
                    <td className="pr-4 text-sm text-ink-soft">{formatDate(doc.createdAt)}</td>
                    <td className="pr-4">
                      <div className="flex justify-end gap-1 opacity-60 transition group-hover:opacity-100">
                        <IconLink
                          to={`/doctors/${doc.id || doc._id}`}
                          icon={Eye}
                          label={`View ${doc.name}`}
                        />
                        <IconLink
                          to={`/doctors/${doc.id || doc._id}/edit`}
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
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </Table>

            {/* Mobile cards */}
            <div className=" Divide-y divide-line md:hidden">
              {rows.map((doc) => (
                <ILink
                  key={doc.id || doc._id}
                  href={`/doctors/${doc.id || doc._id}`}
                  className="block border-b border-line p-4 last:border-0 active:bg-ivory"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink font-display">{doc.name}</p>
                      <p className="truncate text-xs text-ink-soft">
                        {doc.specialization} · {doc.hospital}
                      </p>
                    </div>
                    <Badge tone="lime">{doc.patientCount} pts</Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-ink-soft">
                    <span>{formatDate(doc.createdAt)}</span>
                    <span className="text-ink-soft/70">View details →</span>
                  </div>
                </ILink>
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

function IconLink({ to, icon: Icon, label }) {
  return (
    <ILink
      to={to}
      className="rounded-lg p-2 text-ink-soft transition hover:bg-ivory-dark hover:text-ink"
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </ILink>
  );
}
