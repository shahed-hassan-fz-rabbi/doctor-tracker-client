'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Users,
  Plus,
  UserMinus,
} from 'lucide-react';
import { useDoctor, useDoctorPatients, useDeleteDoctor } from '@/hooks/useDoctors';
import { usePatients } from '@/hooks/usePatients';
import { Card, CardDark, PageHeader, Badge } from '@/components/ui/Cards';
import Button from '@/components/ui/Button';
import Table, { TableSkeleton } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog, { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import { formatDate, initials } from '@/lib/utils';

/**
 * Doctor details: profile card + the doctor's paginated patient roster.
 * Includes "remove patient from roster" without deleting the record.
 */
export default function DoctorDetailsPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const doctorQuery = useDoctor(id);
  const [rosterPage, setRosterPage] = useState(1);
  const patientsQuery = useDoctorPatients(id, { page: rosterPage, limit: 8 });
  const deleteDoctor = useDeleteDoctor();
  const toast = useToast();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [removing, setRemoving] = useState(null);

  const { data: doctorData, isLoading, isError, error } = doctorQuery;
  const doctor = doctorData?.data;
  const roster = patientsQuery.data?.data || [];
  const rosterMeta = patientsQuery.data?.meta;

  async function handleDelete() {
    setConfirmDelete(false);
    try {
      await deleteDoctor.mutateAsync(doctor.id);
      toast.success(`“${doctor.name}” deleted.`);
      router.replace('/doctors');
    } catch (err) {
      toast.error(err?.message || 'Could not delete the doctor.');
    }
  }

  if (isLoading) return <TableSkeleton rows={5} />;

  if (isError) {
    return (
      <EmptyState
        icon={Stethoscope}
        title={error?.status === 404 ? 'Doctor not found' : 'Could not load doctor'}
        description={error?.status === 404 ? 'This record may have been deleted.' : 'Try again in a moment.'}
        action={
          <Link href="/doctors" className="text-sm font-semibold text-forest hover:underline">
            ← Back to doctors
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to
        href="/doctors"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to doctors
      </Link>

      {/* Profile header card (dark, layered) */}
      <CardDark className="overflow-hidden">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-lime/10 blur-2xl" />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-lime font-display text-2xl font-bold text-forest shadow-[0_8px_24px_rgba(201,244,90,0.35)]">
              {initials(doctor.name)}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-2xl font-bold sm:text-3xl">{doctor.name}</h1>
                <Badge tone={doctor.isActive ? 'lime' : 'gray'}>
                  {doctor.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-lime-soft">{doctor.specialization} · {doctor.hospital}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="dark"
                size="md"
                onClick={() => setAddOpen(true)}
                className="bg-lime text-ink hover:bg-lime/90"
              >
                <Plus className="h-4 w-4" /> Add patient
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 text-white hover:bg-white/20"
                onClick={() => router.push(`/doctors/${id}/edit`)}
                aria-label="Edit doctor"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-danger/40 bg-white/10 text-white hover:bg-danger/30"
                onClick={() => setConfirmDelete(true)}
                aria-label="Delete doctor"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <IconInfo icon={Building2} label="Hospital" value={doctor.hospital} />
            <IconInfo icon={Phone} label="Phone" value={doctor.phone} />
            <IconInfo icon={Mail} label="Email" value={doctor.email} small />
            <IconInfo icon={Users} label="Patients" value={String(doctor.patientCount)} />
          </div>
        </div>
      </CardDark>

      {/* Patient roster */}
      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-line p-4 sm:p-5">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Patient roster</h2>
            <p className="text-xs text-ink-soft">
              {rosterMeta ? `${rosterMeta.total} patient${rosterMeta.total === 1 ? '' : 's'} under this doctor` : '…'}
            </p>
          </div>
          <Button size="sm" variant="subtle" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {patientsQuery.isLoading ? (
          <TableSkeleton rows={4} />
        ) : roster.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No patients yet"
            description="Patients added here will show in this doctor's roster."
            action={
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4" /> Add first patient
              </Button>
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
                { key: 'phone', label: 'Phone' },
                { key: 'created', label: 'Registered' },
                { key: 'actions', label: '' },
              ]}
            >
              <tbody>
                {roster.map((p, i) => (
                  <motion.tr
                    key={p.id || p._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="group border-b border-line last:border-0 hover:bg-ivory/60"
                  >
                    <td className="py-3.5 pr-4">
                      <Link href={`/patients/${p.id || p._id}`} className="font-medium text-ink hover:underline font-display">
                        {p.fullName}
                      </Link>
                    </td>
                    <td className="pr-4 text-sm text-ink-soft">{p.age} · {p.gender}</td>
                    <td className="pr-4">
                      <Badge tone="green">{p.condition}</Badge>
                    </td>
                    <td className="pr-4 text-sm text-ink-soft">{p.phone}</td>
                    <td className="pr-4 text-sm text-ink-soft">{formatDate(p.createdAt)}</td>
                    <td className="pr-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setRemoving(p)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-danger/10 hover:text-danger cursor-pointer"
                          aria-label={`Remove ${p.fullName} from roster`}
                        >
                          <UserMinus className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </Table>

            {/* Mobile roster cards */}
            <div className="md:hidden">
              {roster.map((p) => (
                <Link
                  key={p.id || p._id}
                  href={`/patients/${p.id || p._id}`}
                  className="flex items-center gap-3 border-b border-line p-4 last:border-0 active:bg-ivory"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ivory-dark font-display text-xs font-bold text-ink">
                    {initials(p.fullName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{p.fullName}</p>
                    <p className="text-xs text-ink-soft">{p.condition} · {p.age} yrs</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setRemoving(p);
                    }}
                    className="rounded-lg p-2 text-ink-soft hover:text-danger"
                    aria-label={`Remove ${p.fullName}`}
                  >
                    <UserMinus className="h-4 w-4" />
                  </button>
                </Link>
              ))}
            </div>

            {rosterMeta && (
              <div className="border-t border-line p-4">
                <Pagination meta={rosterMeta} onPageChange={setRosterPage} />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modals & dialogs */}
      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${doctor.name}?`}
        description="The doctor record will be removed. Patients stay in the system but become unassigned."
        confirmLabel="Delete doctor"
        loading={deleteDoctor.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={`Add patient under ${doctor.name}`}>
        <AddPatientInline
          doctor={{ id, name: doctor.name }}
          onDone={() => {
            setAddOpen(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(removing)}
        title={`Remove ${removing?.fullName || 'patient'} from roster?`}
        description="The patient record is kept, but will no longer be linked to this doctor. You can re-assign them from the patients page."
        confirmLabel="Remove"
        loading={false}
        onConfirm={async () => {
          try {
            const { apiFetch } = await import('@/lib/api');
            await apiFetch(`/doctors/${id}/patients/${removing.id || removing._id}`, {
              method: 'DELETE',
            });
            toast.success(`${removing.fullName} removed from the roster.`);
            setRemoving(null);
          } catch (err) {
            toast.error(err?.message || 'Could not remove the patient.');
          }
        }}
        onCancel={() => setRemoving(null)}
      />
    </div>
  );
}

function IconInfo({ icon: Icon, label, value, small = false }) {
  return (
    <div className="rounded-xl bg-forest-700/60 p-3">
      <div className="flex items-center gap-1.5 text-lime-soft/80">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className={`mt-1 font-medium text-ivory ${small ? 'truncate text-xs' : 'truncate text-sm'}`}>
        {value || '—'}
      </p>
    </div>
  );
}

/** Inline "add patient" form used inside the doctor page modal. */
function AddPatientInline({ doctor, onDone }) {
  const { data: patientsData } = usePatients({ limit: 0, page: 1 });
  const allPatients = patientsData?.data || [];
  const [selectedPat, setSelectedPat] = useState('');
  const [pending, setPending] = useState(false);
  const toast = useToast();
  const { patientsQuery } = { patientsQuery: null };

  // "Add existing patient" allows linking an unassigned patient
  const candidates = allPatients.filter((p) => !p.doctorId);

  async function addToRoster() {
    if (!selectedPat) {
      toast.error('Pick an existing unassigned patient first.');
      return;
    }
    setPending(true);
    try {
      const { apiFetch } = await import('@/lib/api');
      await apiFetch(`/patients/${selectedPat.id}`, {
        method: 'PATCH',
        body: { doctorId: doctor.id },
      });
      toast.success(`${selectedPat.fullName} added to ${doctor.name}'s roster.`);
      onDone();
    } catch (err) {
      toast.error(err?.message || 'Could not add the patient.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">Link an existing unassigned patient to {doctor.name}.</p>
      <select
        value={selectedPat}
        onChange={(e) => {
          const opt = candidates.find((c) => (c.id || c._id) === e.target.value);
          setSelectedPat(opt);
        }}
        className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:border-lime focus:ring-2 focus:ring-lime/40"
        aria-label="Choose unassigned patient"
      >
        <option value="">Select patient…</option>
        {candidates.map((c) => (
          <option key={c.id || c._id} value={c.id || c._id}>
            {c.fullName} — {c.condition}
          </option>
        ))}
      </select>
      <Button className="w-full" loading={pending} onClick={addToRoster}>
        Add to roster
      </Button>
      <p className="text-center text-xs text-ink-soft">
        or create a brand-new patient from the Patients page.
      </p>
    </div>
  );
}
