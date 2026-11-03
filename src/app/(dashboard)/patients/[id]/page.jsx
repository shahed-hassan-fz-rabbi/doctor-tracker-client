'use client';

import Link from 'next/link';
import { use } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2, Users, Phone, Mail, HeartPulse, CalendarDays } from 'lucide-react';
import { usePatient, useDeletePatient } from '@/hooks/usePatients';
import { Card, CardDark, PageHeader, Badge } from '@/components/ui/Cards';
import Button from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { ConfirmDialog, useToast } from '@/components/ui/Toast';
import { formatDate, initials } from '@/lib/utils';

/** Patient details: identity card, assigned doctor, notes and audit dates. */
export default function PatientDetailsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError, error } = usePatient(id);
  const deletePatient = useDeletePatient();
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const patient = data?.data;

  async function handleDelete() {
    setConfirmDelete(false);
    try {
      await deletePatient.mutateAsync(patient.id);
      toast.success(`“${patient.fullName}” deleted.`);
      router.replace('/patients');
    } catch (err) {
      toast.error(err?.message || 'Could not delete the patient.');
    }
  }

  if (isLoading) return <TableSkeleton rows={5} />;

  if (isError) {
    return (
      <EmptyState
        icon={Users}
        title={error?.status === 404 ? 'Patient not found' : 'Could not load patient'}
        description={error?.status === 404 ? 'This record may have been deleted.' : 'Try again in a moment.'}
        action={
          <Link href="/patients" className="text-sm font-semibold text-forest hover:underline">
            ← Back to patients
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/patients" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to patients
      </Link>

      {/* identity header */}
      <CardDark className="overflow-hidden">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-lime/10 blur-2xl" />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-lime font-display text-2xl font-bold text-forest shadow-[0_8px_24px_rgba(201,244,90,0.35)]">
              {initials(patient.fullName)}
            </span>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{patient.fullName}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge tone="lime">{patient.condition}</Badge>
                <Badge tone="gray">{patient.age} yrs</Badge>
                <Badge tone="gray">{patient.gender}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20"
                onClick={() => router.push(`/patients/${id}/edit`)}
                aria-label="Edit patient"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-danger/40 bg-white/10 text-white hover:bg-danger/30"
                onClick={() => setConfirmDelete(true)}
                aria-label="Delete patient"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <IconInfo icon={Phone} label="Phone" value={patient.phone} />
            <IconInfo icon={Mail} label="Email" value={patient.email || '—'} small />
            <IconInfo icon={CalendarDays} label="Registered" value={formatDate(patient.createdAt)} />
            <IconInfo icon={HeartPulse} label="Last updated" value={formatDate(patient.updatedAt)} />
          </div>
        </div>
      </CardDark>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* assigned doctor */}
        <Card className="p-5 lg:col-span-1">
          <h2 className="font-display text-base font-bold text-ink">Treating doctor</h2>
          {patient.doctor ? (
            <Link
              href={`/doctors/${patient.doctorId}`}
              className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-ivory p-4 transition hover:bg-line/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-forest font-display text-xs font-bold text-lime">
                {initials(patient.doctor.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink font-display">{patient.doctor.name}</p>
                <p className="truncate text-xs text-ink-soft">{patient.doctor.specialization} · {patient.doctor.hospital}</p>
              </div>
            </Link>
          ) : (
            <EmptyState
              icon={Users}
              title="No doctor assigned"
              description="Assign one through the patient edit form."
              className="py-8"
              action={
                <Button size="sm" onClick={() => router.push(`/patients/${id}/edit`)}>
                  Assign doctor
                </Button>
              }
            />
          )}
        </Card>

        {/* notes */}
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-display text-base font-bold text-ink">Administrative notes</h2>
          <div className="mt-4 rounded-xl border border-line bg-ivory p-4">
            <p className="text-sm leading-relaxed text-ink">
              {patient.notes || <span className="text-ink-soft italic">No notes recorded for this patient.</span>}
            </p>
          </div>
          <p className="mt-3 text-xs text-ink-soft">
            Notes are administrative only — Doctor Tracker stores records, not diagnoses.
          </p>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${patient.fullName}?`}
        description="This removes the patient record permanently. This action cannot be undone."
        confirmLabel="Delete patient"
        loading={deletePatient.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
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
      <p className={`mt-1 truncate font-medium text-ivory ${small ? 'text-xs' : 'text-sm'}`}>{value}</p>
    </div>
  );
}
