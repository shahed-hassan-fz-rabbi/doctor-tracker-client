'use client';

import { useRouter } from 'next/navigation';
import { useCreateDoctor } from '@/hooks/useDoctors';
import DoctorForm from '@/features/doctors/DoctorForm';
import { Card, PageHeader } from '@/components/ui/Cards';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { Stethoscope } from 'lucide-react';

export default function AddDoctorPage() {
  const router = useRouter();
  const createDoctor = useCreateDoctor();
  const toast = useToast();

  async function onValid(values) {
    try {
      const res = await createDoctor.mutateAsync(values);
      toast.success(`“${values.name}” was added to the roster.`);
      router.replace(`/doctors/${res.data.id}`);
    } catch (err) {
      // surface server-side issues (e.g. duplicate email) inline
      toast.error(err?.message || 'Could not create the doctor.');
      throw err;
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Add doctor"
        description="Register a new specialist in the Doctor Tracker roster."
      />

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest">
            <Stethoscope className="h-5 w-5 text-lime" />
          </span>
          <div>
            <h2 className="font-display text-base font-bold text-ink">Doctor record</h2>
            <p className="text-xs text-ink-soft">All fields are validated before submission.</p>
          </div>
        </div>

        <DoctorForm
          onValid={onValid}
          submitting={createDoctor.isPending}
          error={createDoctor.error}
        />
      </Card>
    </div>
  );
}
