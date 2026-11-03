'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doctorFormSchema, defaultDoctorForm } from './doctorSchema';
import { SPECIALIZATIONS } from '../constants';
import { Input, Select, Field } from '@/components/ui/Form';
import Button from '@/components/ui/Button';

/**
 * Doctor create/edit form. `initialDoctor` supplies values in edit mode;
 * onValid receives the validated payload.
 */
export default function DoctorForm({ initialDoctor, onValid, submitting, error }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: defaultDoctorForm(initialDoctor),
    mode: 'onTouched',
  });

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5" noValidate>
      <Field label="Full name" error={errors.name}>
        <Input placeholder="e.g. Dr. Ada Marlow" autoComplete="off" {...register('name')} />
      </Field>

      <Field label="Specialization" error={errors.specialization}>
        <Select {...register('specialization')}>
          <option value="">Select specialization…</option>
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Hospital" error={errors.hospital}>
        <Input placeholder="e.g. Greenview General Hospital" {...register('hospital')} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" error={errors.phone}>
          <Input placeholder="+1 202 5550143" autoComplete="off" {...register('phone')} />
        </Field>

        <Field label="Email" error={errors.email}>
          <Input
            type="email"
            placeholder="doctor@hospital.com"
            autoComplete="off"
            {...register('email')}
          />
        </Field>
      </div>

      {/* Active toggle — real checkbox bound to react-hook-form */}
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white p-4 transition hover:bg-ivory">
        <input type="checkbox" className="peer sr-only" {...register('isActive')} />
        <span
          className="flex h-5 w-9 items-center rounded-full bg-line p-0.5 transition peer-checked:bg-forest peer-checked:[&>span]:translate-x-4"
          aria-hidden="true"
        >
          <span className="h-4 w-4 rounded-full bg-white shadow transition-transform" />
        </span>
        <span className="text-sm font-medium text-ink">Active doctor</span>
      </label>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
          {error?.message}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" loading={submitting}>
        {initialDoctor ? 'Save changes' : 'Create doctor'}
      </Button>
    </form>
  );
}
