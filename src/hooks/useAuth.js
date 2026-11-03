import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export const AUTH_KEYS = {
  me: ['auth', 'me'],
};

/** Logged-in admin profile; drives the auth guard + sidebar identity. */
export function useMe() {
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: () => apiFetch('/auth/me'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }) => apiFetch('/auth/login', { method: 'POST', body: { email, password } }),
    onSuccess: (data) => {
      // prime the cache so the guard + sidebar render instantly
      qc.setQueryData(AUTH_KEYS.me, data);
      qc.invalidateQueries({ queryKey: AUTH_KEYS.me });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch('/auth/logout', { method: 'POST' }),
    onSettled: () => {
      qc.clear();
    },
  });
}
