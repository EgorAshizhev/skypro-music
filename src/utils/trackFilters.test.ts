import { describe, expect, it } from 'vitest';
import type { Track } from '@/data/tracks';
import {
  applyTrackFilters,
  emptyFilters,
  filterByAuthors,
  filterByGenres,
  filterBySearch,
  getUniqueAuthors,
  getUniqueGenres,
  sortTracksByYear,
} from './trackFilters';

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
  makeTrack({
    id: 1,
    title: 'Elektro',
    author: 'Nero',
    genre: 'Электронная музыка',
    year: 2021,
  }),
  makeTrack({
    id: 2,
    title: 'Troelf',
    author: 'Dynoro, Outwork, Mr. Gee',
    genre: 'Инди',
    year: 2018,
  }),
  makeTrack({
    id: 3,
    title: 'FooTroBar',
    author: 'Ali Bakgor',
    genre: 'Электронная музыка',
    year: 2024,
  }),
  makeTrack({
    id: 4,
    title: 'Non Stop',
    author: 'Стоункат, Psychopath',
    genre: 'Рок',
    year: 2015,
  }),
];

describe('getUniqueAuthors', () => {
  it('returns an empty list for an empty input', () => {
    expect(getUniqueAuthors([])).toEqual([]);
  });

  it('splits multi-author strings and dedupes', () => {
    const result = getUniqueAuthors([
      makeTrack({ author: 'A, B' }),
      makeTrack({ author: 'B' }),
      makeTrack({ author: '' }),
    ]);
    expect(result).toEqual(['A', 'B']);
  });
});

describe('getUniqueGenres', () => {
  it('returns an empty list for an empty input', () => {
    expect(getUniqueGenres([])).toEqual([]);
  });

  it('dedupes genres and skips empty ones', () => {
    const result = getUniqueGenres([
      makeTrack({ genre: 'Рок' }),
      makeTrack({ genre: 'Рок' }),
      makeTrack({ genre: '' }),
      makeTrack({ genre: 'Инди' }),
    ]);
    expect(result).toEqual(['Рок', 'Инди']);
  });
});

describe('filterBySearch', () => {
  it('returns all tracks for an empty query', () => {
    expect(filterBySearch(tracks, '')).toEqual(tracks);
  });

  it('returns all tracks for a whitespace-only query', () => {
    expect(filterBySearch(tracks, '   ')).toEqual(tracks);
  });

  it('matches a substring anywhere in the title, case-insensitively', () => {
    const result = filterBySearch(tracks, 'tro');
    expect(result.map((t) => t.title)).toEqual([
      'Elektro',
      'Troelf',
      'FooTroBar',
    ]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterBySearch(tracks, 'zzz')).toEqual([]);
  });
});

describe('filterByAuthors', () => {
  it('returns all tracks when no authors are selected', () => {
    expect(filterByAuthors(tracks, [])).toEqual(tracks);
  });

  it('matches tracks with multiple comma-separated authors', () => {
    const result = filterByAuthors(tracks, ['Outwork']);
    expect(result.map((t) => t.id)).toEqual([2]);
  });

  it('matches on any of several selected authors (OR logic)', () => {
    const result = filterByAuthors(tracks, ['Nero', 'Ali Bakgor']);
    expect(result.map((t) => t.id)).toEqual([1, 3]);
  });

  it('returns an empty array when no author matches', () => {
    expect(filterByAuthors(tracks, ['Unknown Artist'])).toEqual([]);
  });
});

describe('filterByGenres', () => {
  it('returns all tracks when no genres are selected', () => {
    expect(filterByGenres(tracks, [])).toEqual(tracks);
  });

  it('matches on any of several selected genres (OR logic)', () => {
    const result = filterByGenres(tracks, ['Рок', 'Инди']);
    expect(result.map((t) => t.id)).toEqual([2, 4]);
  });

  it('returns an empty array when no genre matches', () => {
    expect(filterByGenres(tracks, ['Джаз'])).toEqual([]);
  });
});

describe('sortTracksByYear', () => {
  it('leaves the order untouched for "default"', () => {
    const result = sortTracksByYear(tracks, 'default');
    expect(result).toBe(tracks);
  });

  it('sorts newest first for "new"', () => {
    const result = sortTracksByYear(tracks, 'new');
    expect(result.map((t) => t.year)).toEqual([2024, 2021, 2018, 2015]);
  });

  it('sorts oldest first for "old"', () => {
    const result = sortTracksByYear(tracks, 'old');
    expect(result.map((t) => t.year)).toEqual([2015, 2018, 2021, 2024]);
  });

  it('does not mutate the original array', () => {
    const original = [...tracks];
    sortTracksByYear(tracks, 'new');
    expect(tracks).toEqual(original);
  });
});

describe('applyTrackFilters', () => {
  it('returns the input untouched when filters and search are empty', () => {
    expect(applyTrackFilters(tracks, emptyFilters, '')).toEqual(tracks);
  });

  it('combines search, author, genre filters and sorting together', () => {
    const result = applyTrackFilters(
      tracks,
      { authors: [], genres: ['Электронная музыка'], sort: 'old' },
      'tro',
    );
    // "tro" search -> Elektro(2021), Troelf(2018) excluded by genre, FooTroBar(2024)
    // genre "Электронная музыка" -> Elektro(2021), FooTroBar(2024)
    // sorted oldest first
    expect(result.map((t) => t.title)).toEqual(['Elektro', 'FooTroBar']);
  });

  it('returns an empty array when combined filters match nothing', () => {
    const result = applyTrackFilters(
      tracks,
      { authors: ['Nero'], genres: ['Рок'], sort: 'default' },
      '',
    );
    expect(result).toEqual([]);
  });
});
