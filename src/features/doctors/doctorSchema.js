import { z } from 'zod';
import { SPECIALIZATIONS } from './constants';

export const doctorFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120, 'Name is too long'),
  specialization: z.enum(SPECIALIZATIONS, { message: 'Choose a specialization' }),
  hospital: z.string().trim().min(2, 'Hospital is required').max(160, 'Hospital name is too long'),
  phone: z.string().trim().min(6, 'Enter a valid phone number').max(24, 'Phone is too long'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  isActive: z.boolean(),
});

export const defaultDoctorForm = (doctor) => ({
  name: doctor?.name || '',
  specialization: doctor?.specialization || '',
  hospital: doctor?.hospital || '',
  phone: doctor?.phone || '',
  email: doctor?.email || '',
  isActive: doctor?.isActive ?? true,
});
