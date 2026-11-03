import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('renders its label and handles clicks', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save changes</Button>);

    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows the spinner and disables clicks while loading', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>
    );

    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(screen.queryByText('Save')).toBeInTheDocument();
    expect(btn.querySelector('span')).toBeTruthy();
  });

  it('respects the disabled prop', () => {
    render(<Button disabled>Snooze</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
