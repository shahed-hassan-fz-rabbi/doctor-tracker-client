'use client';

import { useRouter } from 'next/navigation';
import { useDoctor, useUpdateDoctor } from '@/hooks/useDoctors';
import DoctorForm from '@/features/doctors/DoctorForm';
import { Card, PageHeader } from '@/components/ui/Cards';
import TableSkeleton from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { Stethoscope } from 'lucide-react';

export default function EditDoctorPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { data, isLoading, isError, error } = useDoctor(id);
  const updateDoctor = useUpdateDoctor();
  const toast = useToast();

  async function onValid(values) {
    try {
      await updateDoctor.mutateAsync({ id, body: values });
      toast.success('Doctor record updated.');
      router.push(`/doctors/${id}`);
    } catch (err) {
      toast.error(err?.message || 'Could not update the doctor.');
      throw err;
    }
  }

  if (isLoading) return <TableSkeleton rows={4} />;

  if (isError) {
    return (
      <EmptyState
        icon={Stethoscope}
        title={error?.status === 404 ? 'Doctor not found' : 'Could not load doctor'}
        description={error?.status === 404 ? 'This record may have been deleted.' : 'Try again in a moment.'}
        action={
          <button onClick={() => router.push('/doctors')} className="text-sm font-semibold text-forest hover:underline">
            ← Back to doctors
          </button>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Edit doctor"
        description={`Updating the record of ${data.data.name}.`}
      />

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest">
            <Stethoscope className="h-5 w-5 text-lime" />
          </span>
          <div>
            <h2 className="font-display text-base font-bold text-ink">Doctor record</h2>
            <p className="text-xs text-ink-soft">Only the fields you change are validated and sent.</p>
          </div>
        </div>

        <DoctorForm
          initialDoctor={data.data}
          onValid={onValid}
          submitting={updateDoctor.isPending}
          error={updateDoctor.error}
        />
      </Card>
    </div>
  );
}
