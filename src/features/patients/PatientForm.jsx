'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientFormSchema, defaultPatientForm } from './patientSchema';
import { CONDITIONS, GENDERS } from '../constants';
import { SPECIALIZATIONS } from '../constants';
import { Input, Select, Textarea, Field } from '@/components/ui/Form';
import Button from '@/components/ui/Button';

/**
 * Patient create/edit form.
 * `doctors` is the paginated doctor list used for the assignment select —
 * pass an "unassigned" option here as the default value.
 */
export default function PatientForm({
  initialPatient,
  doctors = [],
  onValid,
  submitting,
  error,
  allowDoctorSelect = true,
  fixedDoctorId = null,
  fixedDoctorName = null,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientFormSchema),
    defaultValues: defaultPatientForm(
      fixedDoctorId && !initialPatient ? { ...initialPatient, doctorId: fixedDoctorId } : initialPatient
    ),
    mode: 'onTouched',
  });

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5" noValidate>
      <Field label="Full name" error={errors.fullName}>
        <Input placeholder="e.g. Jamie Okafor" autoComplete="off" {...register('fullName')} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Age" error={errors.age}>
          <Input type="number" min="1" max="130" placeholder="34" {...register('age')} />
        </Field>

        <Field label="Gender" error={errors.gender}>
          <Select {...register('gender')}>
            <option value="">Select gender…</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" error={errors.phone}>
          <Input placeholder="+1 202 5550170" autoComplete="off" {...register('phone')} />
        </Field>

        <Field label="Email (optional)" error={errors.email} hint="Used for record matching, never required">
          <Input type="email" placeholder="patient@example.com" autoComplete="off" {...register('email')} />
        </Field>
      </div>

      <Field label="Condition" error={errors.condition}>
        <Select {...register('condition')}>
          <option value="">Select condition…</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Field>

      {fixedDoctorId ? (
        <Field label="Treating doctor">
          <Input value={fixedDoctorName || 'Selected doctor'} readOnly disabled className="bg-ivory-dark" />
        </Field>
      ) : allowDoctorSelect ? (
        <Field
          label="Assigned doctor"
          error={errors.doctorId}
          hint="Patients can also be unassigned now and linked later"
        >
          <Select {...register('doctorId')}>
            <option value="unassigned">Unassigned</option>
            {doctors.map((doc) => (
              <option key={doc.id || doc._id} value={doc.id || doc._id}>
                {doc.name} — {doc.specialization}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      <Field label="Notes (optional)" error={errors.notes}>
        <Textarea placeholder="Administrative notes about this patient record…" {...register('notes')} />
      </Field>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
          {error?.message}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" loading={submitting}>
        {initialPatient ? 'Save changes' : 'Create patient'}
      </Button>
    </form>
  );
}
