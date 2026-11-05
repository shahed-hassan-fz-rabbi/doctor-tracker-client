import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import Home from './page';
import PublicNavbar from '@/components/public/PublicNavbar';
import ThemeToggle from '@/components/public/ThemeToggle';

describe('public homepage', () => {
  it('renders public product information and routes admin access to existing login', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /manage your healthcare operations/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'About Doctor Tracker' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tools for confident administration' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ready to Simplify Healthcare Administration?' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /admin login|access admin dashboard|go to admin login/i })
      .every((link) => link.getAttribute('href') === '/login')).toBe(true);
    expect(screen.queryByText(/patients per doctor|total doctors|patient growth/i)).not.toBeInTheDocument();
  });

  it('provides section navigation and working responsive menu controls', () => {
    render(<PublicNavbar />);

    expect(screen.getByRole('link', { name: 'Doctor Tracker home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '#features');

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    const mobileNavigation = screen.getByRole('navigation', { name: 'Mobile navigation' });
    expect(within(mobileNavigation).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact');
    expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(within(mobileNavigation).getByRole('link', { name: 'Contact' }));
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });
});

describe('landing theme toggle', () => {
  it('toggles scheme-dark, persists the choice and updates accessibility state', () => {
    const { container } = render(<ThemeToggle />);
    document.documentElement.classList.remove('scheme-dark');

    const button = screen.getByRole('button', { name: 'Switch to dark theme' });
    expect(button).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAccessibleName('Switch to light theme');
    expect(document.documentElement.classList.contains('scheme-dark')).toBe(true);
    expect(window.localStorage.getItem('dt-landing-theme')).toBe('dark');

    fireEvent.click(button);
    expect(document.documentElement.classList.contains('scheme-dark')).toBe(false);
    expect(window.localStorage.getItem('dt-landing-theme')).toBe('light');

    container.remove();
    document.documentElement.classList.remove('scheme-dark');
  });
});
