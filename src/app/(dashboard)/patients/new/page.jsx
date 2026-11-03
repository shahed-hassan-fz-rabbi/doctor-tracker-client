'use client';

import { useRouter } from 'next/navigation';
import { useDoctors } from '@/hooks/useDoctors';
import { useCreatePatient } from '@/hooks/usePatients';
import PatientForm from '@/features/patients/PatientForm';
import { Card, PageHeader } from '@/components/ui/Cards';
import { useToast } from '@/components/ui/Toast';
import { Users } from 'lucide-react';

export default function AddPatientPage() {
  const router = useRouter();
  const createPatient = useCreatePatient();
  const toast = useToast();

  // doctor list for the assignment select (first page is enough for a picker;
  // it is capped at 100 per page by the API)
  const { data: doctorsData } = useDoctors({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' });
  const doctors = (doctorsData?.data || []).filter((d) => d.isActive);

  async function onValid(values) {
    try {
      const res = await createPatient.mutateAsync(values);
      toast.success(`“${values.fullName}” was registered.`);
      router.replace(`/patients/${res.data.id}`);
    } catch (err) {
      toast.error(err?.message || 'Could not create the patient.');
      throw err;
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Add patient"
        description="Register a new patient record and optionally assign a doctor."
      />

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime">
            <Users className="h-5 w-5 text-forest" />
          </span>
          <div>
            <h2 className="font-display text-base font-bold text-ink">Patient record</h2>
            <p className="text-xs text-ink-soft">All fields are validated before submission.</p>
          </div>
        </div>

        <PatientForm
          doctors={doctors}
          onValid={onValid}
          submitting={createPatient.isPending}
          error={createPatient.error}
        />
      </Card>
    </div>
  );
}
