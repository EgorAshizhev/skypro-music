import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Filter from './Filter';
import { emptyFilters } from '@/utils/trackFilters';
import type { Track } from '@/data/tracks';

function makeTrack(overrides: Partial<Track>): Track {
  return {
    id: 1,
    title: 'Track',
    author: 'Author',
    album: 'Album',
    duration: '3:00',
    genre: 'Genre',
    year: 2020,
    trackFile: 'file.mp3',
    ...overrides,
  };
}

const tracks: Track[] = [
  makeTrack({ id: 1, author: 'Nero', genre: 'Электронная музыка', year: 2021 }),
  makeTrack({ id: 2, author: 'Dynoro, Mr. Gee', genre: 'Инди', year: 2018 }),
];

describe('Filter', () => {
  it('shows the option lists built from the unfiltered track list when opened', async () => {
    const user = userEvent.setup();
    render(
      <Filter tracks={tracks} selected={emptyFilters} onChange={vi.fn()} />,
    );

    await user.click(screen.getByText('исполнителю'));
    expect(screen.getByText('Nero')).toBeInTheDocument();
    expect(screen.getByText('Mr. Gee')).toBeInTheDocument();
  });

  it('toggles an author into the selection (multi-select)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Filter tracks={tracks} selected={emptyFilters} onChange={onChange} />,
    );

    await user.click(screen.getByText('исполнителю'));
    await user.click(screen.getByText('Nero'));

    expect(onChange).toHaveBeenCalledWith({
      ...emptyFilters,
      authors: ['Nero'],
    });
  });

  it('removes an author already in the selection when clicked again', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Filter
        tracks={tracks}
        selected={{ ...emptyFilters, authors: ['Nero'] }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByText('исполнителю (1)'));
    await user.click(screen.getByText('Nero'));

    expect(onChange).toHaveBeenCalledWith({ ...emptyFilters, authors: [] });
  });

  it('applies a single sort order when a year option is chosen and closes the dropdown', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Filter tracks={tracks} selected={emptyFilters} onChange={onChange} />,
    );

    await user.click(screen.getByText('году выпуска'));
    await user.click(screen.getByText('Сначала новые'));

    expect(onChange).toHaveBeenCalledWith({ ...emptyFilters, sort: 'new' });
    expect(screen.queryByText('Сначала старые')).not.toBeInTheDocument();
  });

  it('toggles a genre into the selection (multi-select)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Filter tracks={tracks} selected={emptyFilters} onChange={onChange} />,
    );

    await user.click(screen.getByText('жанру'));
    await user.click(screen.getByText('Инди'));

    expect(onChange).toHaveBeenCalledWith({
      ...emptyFilters,
      genres: ['Инди'],
    });
  });
});
