import { afterEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginPage from './page';

const { replaceMock, mutateAsyncMock, useMeMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  mutateAsyncMock: vi.fn(),
  useMeMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useMe: useMeMock,
  useLogin: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
  }),
}));

vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

function renderLogin() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <LoginPage />
    </QueryClientProvider>
  );
}

afterEach(() => {
  replaceMock.mockReset();
  mutateAsyncMock.mockReset();
  useMeMock.mockReset();
});

describe('LoginPage Redesign', () => {
  it('renders the branding headline and healthcare SaaS feature highlights', () => {
    useMeMock.mockReturnValue({ data: null, isSuccess: false });
    renderLogin();

    expect(
      screen.getByRole('heading', { name: /one place for every doctor and patient record/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Doctors Management')).toBeInTheDocument();
    expect(screen.getAllByText('Patient Records').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Smart Analytics')).toBeInTheDocument();
    expect(screen.getByText(/40/)).toBeInTheDocument();
    expect(screen.getByText(/260/)).toBeInTheDocument();
  });

  it('renders the sign in card with welcome text, Google OAuth, and email/password fields', () => {
    useMeMock.mockReturnValue({ data: null, isSuccess: false });
    renderLogin();

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('toggles password visibility when the show/hide button is clicked', () => {
    useMeMock.mockReturnValue({ data: null, isSuccess: false });
    renderLogin();

    const passwordInput = screen.getByLabelText(/^password$/i);
    const toggleButton = screen.getByRole('button', { name: 'Show password' });

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('displays validation errors when submitting an empty form', async () => {
    useMeMock.mockReturnValue({ data: null, isSuccess: false });
    renderLogin();

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it('displays the demo section and handles availability state cleanly', () => {
    useMeMock.mockReturnValue({ data: null, isSuccess: false });
    renderLogin();

    expect(screen.getByRole('region', { name: /demo credentials and preview/i })).toBeInTheDocument();
    expect(screen.getByText('DEMO ACCOUNT')).toBeInTheDocument();
    expect(screen.getByText('READ ONLY')).toBeInTheDocument();
  });
});
