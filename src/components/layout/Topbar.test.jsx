import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Topbar from './Topbar';

const { pathnameMock, pushMock } = vi.hoisted(() => ({ pathnameMock: vi.fn(), pushMock: vi.fn() }));

vi.mock('next/navigation', () => ({
  usePathname: pathnameMock,
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useMe: () => ({ data: { data: { user: { name: 'Test Admin' } } } }),
}));

describe('Topbar page context', () => {
  beforeEach(() => pushMock.mockReset());

  it('shows patient search and routes the add action to the patient form', () => {
    pathnameMock.mockReturnValue('/patients');
    render(<Topbar onMenuClick={() => {}} />);

    expect(screen.getByRole('textbox', { name: 'Search patients' })).toHaveAttribute('placeholder', 'Search patients…');
    fireEvent.click(screen.getByRole('button', { name: 'Add Patient' }));
    expect(pushMock).toHaveBeenCalledWith('/patients/new');
  });

  it('sends patient topbar searches to the patient page filter', () => {
    pathnameMock.mockReturnValue('/patients');
    const searchHandler = vi.fn();
    window.addEventListener('doctor-tracker:patient-search', searchHandler);
    render(<Topbar onMenuClick={() => {}} />);

    const input = screen.getByRole('textbox', { name: 'Search patients' });
    fireEvent.change(input, { target: { value: 'Nila Rahman' } });
    fireEvent.submit(input.closest('form'));

    expect(searchHandler).toHaveBeenCalledTimes(1);
    expect(searchHandler.mock.calls[0][0].detail.query).toBe('Nila Rahman');
    expect(pushMock).not.toHaveBeenCalled();
    window.removeEventListener('doctor-tracker:patient-search', searchHandler);
  });

  it('preserves doctor quick-search and add behavior on other pages', () => {
    pathnameMock.mockReturnValue('/dashboard');
    render(<Topbar onMenuClick={() => {}} />);

    expect(screen.getByRole('textbox', { name: 'Search doctors' })).toHaveAttribute('placeholder', 'Search doctors…');
    fireEvent.click(screen.getByRole('button', { name: 'Add Doctor' }));
    expect(pushMock).toHaveBeenCalledWith('/doctors/new');
  });
});
