import { describe, it, expect } from 'vitest';
import { doctorFormSchema } from './doctorSchema';

describe('doctor form schema (Zod)', () => {
  const valid = {
    name: 'Dr. Ada Marlow',
    specialization: 'Cardiology',
    hospital: 'Greenview General Hospital',
    phone: '+1 202 5550143',
    email: 'ada@hospital.com',
    isActive: true,
  };

  it('accepts a valid doctor', () => {
    expect(() => doctorFormSchema.parse(valid)).not.toThrow();
  });

  it('rejects a short name', () => {
    expect(() => doctorFormSchema.parse({ ...valid, name: 'A' })).toThrow();
  });

  it('rejects an unsupported specialization', () => {
    expect(() => doctorFormSchema.parse({ ...valid, specialization: 'Astrology' })).toThrow();
  });

  it('rejects an invalid email', () => {
    expect(() => doctorFormSchema.parse({ ...valid, email: 'nope' })).toThrow();
  });

  it('rejects a short phone', () => {
    expect(() => doctorFormSchema.parse({ ...valid, phone: '12' })).toThrow();
  });

  it('requires a hospital', () => {
    expect(() => doctorFormSchema.parse({ ...valid, hospital: '' })).toThrow();
  });
});
