import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export const doctorKeys = {
  all: ['doctors'],
  list: (params) => ['doctors', 'list', params],
  detail: (id) => ['doctors', 'detail', id],
  patients: (id, params) => ['doctors', 'patients', id, params],
};

export function useDoctors(params) {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => apiFetch('/doctors', { params }),
    placeholderData: (prev) => prev,
  });
}

export function useDoctor(id) {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: () => apiFetch(`/doctors/${id}`),
    enabled: Boolean(id),
  });
}

export function useDoctorPatients(id, params) {
  return useQuery({
    queryKey: doctorKeys.patients(id, params),
    queryFn: () => apiFetch(`/doctors/${id}/patients`, { params }),
    enabled: Boolean(id),
    placeholderData: (prev) => prev,
  });
}

export function useCreateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => apiFetch('/doctors', { method: 'POST', body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: doctorKeys.all }),
  });
}

export function useUpdateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => apiFetch(`/doctors/${id}`, { method: 'PATCH', body }),
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: doctorKeys.all });
      qc.invalidateQueries({ queryKey: doctorKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useDeleteDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiFetch(`/doctors/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: doctorKeys.all });
      qc.invalidateQueries({ queryKey: ['patients'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
