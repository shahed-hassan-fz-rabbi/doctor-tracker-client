import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export const patientKeys = {
  all: ['patients'],
  list: (params) => ['patients', 'list', params],
  detail: (id) => ['patients', 'detail', id],
};

export function usePatients(params) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => apiFetch('/patients', { params }),
    placeholderData: (prev) => prev,
  });
}

export function usePatient(id) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => apiFetch(`/patients/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => apiFetch('/patients', { method: 'POST', body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientKeys.all });
      qc.invalidateQueries({ queryKey: doctorKeysForInvalidation() });
    },
  });
}

export function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => apiFetch(`/patients/${id}`, { method: 'PATCH', body }),
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: patientKeys.all });
      qc.invalidateQueries({ queryKey: patientKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: ['doctors'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiFetch(`/patients/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientKeys.all });
      qc.invalidateQueries({ queryKey: ['doctors'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

/** used by useCreatePatient for doctor rosters invalidation */
function doctorKeysForInvalidation() {
  return ['doctors'];
}
