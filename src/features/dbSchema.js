'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SPECIALIZATIONS } from '../constants';

export const DOCTOR_SPECIALIZATIONS = SPECIALIZATIONS;

export const doctorSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120, 'Name is too long'),
  specialization: z.enum(SPECIALIZATIONS, { message: 'Choose a specialization' }),
  hospital: z.string().trim().min(2, 'Hospital is required').max(160, 'Hospital name is too long'),
  phone: z.string().trim().min(6, 'Enter a valid phone number').max(24, 'Phone is too long'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  isActive: z.boolean(),
});

export const patientSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required').max(120, 'Name is too long'),
  age: z.coerce
    .number()
    .int('Age must be a whole number')
    .min(1, 'Age must be at least 1')
    .max(130, 'Age cannot exceed 130'),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Choose a gender' }),
  phone: z.string().trim().min(6, 'Enter a valid phone number').max(24, 'Phone is too long'),
  email: z.union([z.literal(''), z.string().trim().email('Enter a valid email')]).optional(),
  condition: z.enum(SPECIALIZATIONS ? [] : []), // replaced immediately below
  doctorId: z.string(),
  notes: z.string().max(2000, 'Notes are too long').optional(),
}).transform((v) => ({ ...v, email: v.email || null }));
