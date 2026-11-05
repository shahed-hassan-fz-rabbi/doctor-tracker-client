import { afterEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AuthGuard from './AuthGuard';

const { useMeMock, replaceMock, pathnameMock } = vi.hoisted(() => ({
  useMeMock: vi.fn(),
  replaceMock: vi.fn(),
  pathnameMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: pathnameMock,
  useRouter: () => ({ replace: replaceMock }),
}));
vi.mock('@/hooks/useAuth', () => ({
  AUTH_KEYS: { me: ['auth', 'me'] },
  useMe: useMeMock,
}));

function renderGuard(pathname = '/dashboard') {
  pathnameMock.mockReturnValue(pathname);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthGuard><div>Protected dashboard</div></AuthGuard>
    </QueryClientProvider>
  );
}

afterEach(() => {
  useMeMock.mockReset();
  replaceMock.mockReset();
  pathnameMock.mockReset();
});

describe('AuthGuard', () => {
  it('renders the public homepage without enabling the protected session request', () => {
    useMeMock.mockReturnValue({ isLoading: true, isError: false });
    renderGuard('/');

    expect(screen.getByText('Protected dashboard')).toBeInTheDocument();
    expect(useMeMock).toHaveBeenCalledWith({ enabled: false });
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('shows a temporary loading state while checking the session', () => {
    useMeMock.mockReturnValue({ isLoading: true, isError: false });
    renderGuard();
    expect(screen.getByRole('status', { name: 'Loading Doctor Tracker' })).toBeInTheDocument();
    expect(screen.getByText('Preparing your healthcare workspace')).toBeInTheDocument();
  });

  it('redirects unauthenticated requests to login with their return path', async () => {
    useMeMock.mockReturnValue({ isLoading: false, isError: true, error: { status: 401 } });
    renderGuard();
    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/login?next=%2Fdashboard'));
  });

  it('shows a retryable error instead of an empty protected page', async () => {
    const refetch = vi.fn();
    useMeMock.mockReturnValue({
      isLoading: false,
      isError: true,
      isFetching: false,
      error: new Error('Could not reach the Doctor Tracker API.'),
      refetch,
    });
    renderGuard();

    expect(screen.getByRole('alert')).toHaveTextContent('Could not reach the Doctor Tracker API.');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders protected content after the session is verified', () => {
    useMeMock.mockReturnValue({ isLoading: false, isError: false });
    renderGuard();
    expect(screen.getByText('Protected dashboard')).toBeInTheDocument();
  });
});
