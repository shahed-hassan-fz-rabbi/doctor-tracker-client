import { describe, it, expect } from 'vitest';

// schema module is plain JS — evaluate dynamically to keep this test env-lean
const { patientFormSchema } = await import('./patientSchema');

describe('patient form schema (Zod)', () => {
  const valid = {
    fullName: 'Jamie Okafor',
    age: 34,
    gender: 'Male',
    phone: '+1 202 5550170',
    email: 'jamie@example.com',
    condition: 'Diabetes',
    doctorId: 'unassigned',
    notes: '',
  };

  it('accepts a valid patient', () => {
    const parsed = patientFormSchema.parse(valid);
    expect(parsed.fullName).toBe('Jamie Okafor');
  });

  it('transforms empty email to null', () => {
    const parsed = patientFormSchema.parse({ ...valid, email: '' });
    expect(parsed.email).toBeNull();
  });

  it('rejects an out-of-range age', () => {
    expect(() => patientFormSchema.parse({ ...valid, age: 500 })).toThrow();
  });

  it('rejects a fractional age', () => {
    expect(() => patientFormSchema.parse({ ...valid, age: 30.5 })).toThrow();
  });

  it('rejects an invalid optional email', () => {
    expect(() => patientFormSchema.parse({ ...valid, email: 'not-an-email' })).toThrow();
  });

  it('rejects an unsupported condition', () => {
    expect(() => patientFormSchema.parse({ ...valid, condition: 'Witchcraft' })).toThrow();
  });

  it('rejects an unsupported gender', () => {
    expect(() => patientFormSchema.parse({ ...valid, gender: 'Robot' })).toThrow();
  });

  it('rejects a missing doctor assignment choice', () => {
    expect(() => patientFormSchema.parse({ ...valid, doctorId: '' })).toThrow();
  });
});
