import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';

describe('Search', () => {
  it('renders the current value', () => {
    render(<Search value="tro" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Поиск')).toHaveValue('tro');
  });

  it('calls onChange with the new value while typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Search value="" onChange={onChange} />);

    await user.type(screen.getByPlaceholderText('Поиск'), 'tro');

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith('o');
  });

  it('is a controlled input — it does not change without a value prop update', async () => {
    const user = userEvent.setup();
    render(<Search value="fixed" onChange={vi.fn()} />);

    const input = screen.getByPlaceholderText('Поиск');
    await user.type(input, 'x');

    expect(input).toHaveValue('fixed');
  });
});
