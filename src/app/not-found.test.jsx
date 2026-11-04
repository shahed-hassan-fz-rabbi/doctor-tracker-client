import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import NotFound from './not-found';

const { backMock } = vi.hoisted(() => ({ backMock: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: backMock }),
}));

afterEach(() => {
  cleanup();
  backMock.mockClear();
});

describe('NotFound', () => {
  it('provides dashboard and home navigation', () => {
    render(<NotFound />);

    expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Dashboard/ })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: /Go to Home/ })).toHaveAttribute('href', '/');
  });

  it('offers the browser back action when history is available', async () => {
    window.history.pushState({}, '', '/previous-page');
    render(<NotFound />);

    const backButton = await screen.findByRole('button', { name: /Go back/ });
    fireEvent.click(backButton);
    await waitFor(() => expect(backMock).toHaveBeenCalledOnce());
  });
});
