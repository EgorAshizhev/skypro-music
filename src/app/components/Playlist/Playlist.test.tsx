import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Playlist from './Playlist';
import type { Track } from '@/data/tracks';

vi.mock('@/app/components/TrackItem/TrackItem', () => ({
  default: ({ track }: { track: Track }) => (
    <div data-testid="track-item">{track.title}</div>
  ),
}));

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

describe('Playlist', () => {
  it('shows a message and renders no track rows when the list is empty', () => {
    render(<Playlist tracks={[]} />);

    expect(screen.getByText('Нет подходящих треков')).toBeInTheDocument();
    expect(screen.queryAllByTestId('track-item')).toHaveLength(0);
  });

  it('renders one row per track, in order', () => {
    const tracks = [
      makeTrack({ id: 1, title: 'First' }),
      makeTrack({ id: 2, title: 'Second' }),
    ];
    render(<Playlist tracks={tracks} />);

    const rows = screen.getAllByTestId('track-item');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('First');
    expect(rows[1]).toHaveTextContent('Second');
    expect(screen.queryByText('Нет подходящих треков')).not.toBeInTheDocument();
  });
});
