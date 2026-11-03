import { z } from 'zod';
import { CONDITIONS, GENDERS } from '../constants';

export const patientFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required').max(120, 'Name is too long'),
  age: z.coerce
    .number()
    .int('Age must be a whole number')
    .min(1, 'Age must be at least 1')
    .max(130, 'Age cannot exceed 130'),
  gender: z.enum(GENDERS, { message: 'Choose a gender' }),
  phone: z.string().trim().min(6, 'Enter a valid phone number').max(24, 'Phone is too long'),
  email: z
    .union([z.literal(''), z.string().trim().email('Enter a valid email')])
    .nullish()
    .transform((v) => v || null),
  condition: z.enum(CONDITIONS, { message: 'Choose a condition' }),
  doctorId: z.string().min(1, 'Select a doctor or "Unassigned"'),
  notes: z.string().max(2000, 'Notes are too long').optional(),
});

export const defaultPatientForm = (patient) => ({
  fullName: patient?.fullName || '',
  age: patient?.age ?? undefined,
  gender: patient?.gender || '',
  phone: patient?.phone || '',
  email: patient?.email || '',
  condition: patient?.condition || '',
  doctorId: patient?.doctorId ? String(patient.doctorId.id || patient.doctorId) : 'unassigned',
  notes: patient?.notes || '',
});
