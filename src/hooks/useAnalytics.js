import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export const analyticsKeys = {
  all: ['analytics'],
  overview: ['analytics', 'overview'],
  growth: (months) => ['analytics', 'patient-growth', months],
  condition: ['analytics', 'patients-by-condition'],
  perDoctor: ['analytics', 'patients-per-doctor'],
  specializations: ['analytics', 'doctor-specializations'],
};

export function useAnalyticsOverview() {
  return useQuery({ queryKey: analyticsKeys.overview, queryFn: () => apiFetch('/analytics/overview') });
}

export function usePatientGrowth(months = 6) {
  return useQuery({
    queryKey: analyticsKeys.growth(months),
    queryFn: () => apiFetch('/analytics/patient-growth', { params: { months } }),
  });
}

export function usePatientsByCondition() {
  return useQuery({ queryKey: analyticsKeys.condition, queryFn: () => apiFetch('/analytics/patients-by-condition') });
}

export function usePatientsPerDoctor() {
  return useQuery({ queryKey: analyticsKeys.perDoctor, queryFn: () => apiFetch('/analytics/patients-per-doctor') });
}

export function useDoctorSpecializations() {
  return useQuery({ queryKey: analyticsKeys.specializations, queryFn: () => apiFetch('/analytics/doctor-specializations') });
}
