'use client';

import { useRouter } from 'next/navigation';
import { useDoctors } from '@/hooks/useDoctors';
import { usePatient, useUpdatePatient } from '@/hooks/usePatients';
import PatientForm from '@/features/patients/PatientForm';
import { Card, PageHeader } from '@/components/ui/Cards';
import TableSkeleton from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { Users } from 'lucide-react';

export default function EditPatientPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { data, isLoading, isError, error } = usePatient(id);
  const updatePatient = useUpdatePatient();
  const toast = useToast();

  const { data: doctorsData } = useDoctors({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' });
  const doctors = (doctorsData?.data || []).filter((d) => d.isActive);

  async function onValid(values) {
    try {
      await updatePatient.mutateAsync({ id, body: values });
      toast.success('Patient record updated.');
      router.push(`/patients/${id}`);
    } catch (err) {
      toast.error(err?.message || 'Could not update the patient.');
      throw err;
    }
  }

  if (isLoading) return <TableSkeleton rows={4} />;

  if (isError) {
    return (
      <EmptyState
        icon={Users}
        title={error?.status === 404 ? 'Patient not found' : 'Could not load patient'}
        description={error?.status === 404 ? 'This record may have been deleted.' : 'Try again in a moment.'}
        action={
          <button onClick={() => router.push('/patients')} className="text-sm font-semibold text-forest hover:underline">
            ← Back to patients
          </button>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Edit patient"
        description={`Updating the record of ${data.data.fullName}.`}
      />

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime">
            <Users className="h-5 w-5 text-forest" />
          </span>
          <div>
            <h2 className="font-display text-base font-bold text-ink">Patient record</h2>
            <p className="text-xs text-ink-soft">Only the fields you change are validated and sent.</p>
          </div>
        </div>

        <PatientForm
          initialPatient={data.data}
          doctors={doctors}
          onValid={onValid}
          submitting={updatePatient.isPending}
          error={updatePatient.error}
        />
      </Card>
    </div>
  );
}
