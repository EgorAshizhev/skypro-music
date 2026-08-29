import type { Track } from '@/data/tracks';

/**
 * Порядок сортировки треков по году выпуска.
 * 'default' — порядок как пришёл с сервера (без сортировки).
 * 'new' — сначала новые (по убыванию года).
 * 'old' — сначала старые (по возрастанию года).
 */
export type SortOrder = 'default' | 'new' | 'old';

export interface SelectedFilters {
  authors: string[];
  genres: string[];
  sort: SortOrder;
}

export const emptyFilters: SelectedFilters = {
  authors: [],
  genres: [],
  sort: 'default',
};

/**
 * Список уникальных исполнителей из НЕотфильтрованного списка треков.
 * У трека может быть несколько исполнителей через запятую — каждый
 * учитывается отдельно.
 */
export function getUniqueAuthors(tracks: Track[]): string[] {
  const authors = new Set<string>();
  tracks.forEach((track) => {
    track.author
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
      .forEach((name) => authors.add(name));
  });
  return Array.from(authors);
}

/** Список уникальных жанров из НЕотфильтрованного списка треков. */
export function getUniqueGenres(tracks: Track[]): string[] {
  const genres = new Set<string>();
  tracks.forEach((track) => {
    if (track.genre) genres.add(track.genre);
  });
  return Array.from(genres);
}

/**
 * Фильтрация по поисковому запросу: ищем совпадение в любом месте
 * названия трека, без учёта регистра. Пустой запрос ничего не отсеивает.
 */
export function filterBySearch(tracks: Track[], query: string): Track[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return tracks;
  return tracks.filter((track) =>
    track.title.toLowerCase().includes(normalized),
  );
}

/** Фильтрация по выбранным исполнителям (логика "или"). */
export function filterByAuthors(tracks: Track[], authors: string[]): Track[] {
  if (authors.length === 0) return tracks;
  return tracks.filter((track) =>
    track.author
      .split(',')
      .map((name) => name.trim())
      .some((name) => authors.includes(name)),
  );
}

/** Фильтрация по выбранным жанрам (логика "или"). */
export function filterByGenres(tracks: Track[], genres: string[]): Track[] {
  if (genres.length === 0) return tracks;
  return tracks.filter((track) => genres.includes(track.genre));
}

/** Сортировка по году выпуска. Не мутирует исходный массив. */
export function sortTracksByYear(tracks: Track[], sort: SortOrder): Track[] {
  if (sort === 'default') return tracks;
  return [...tracks].sort((a, b) =>
    sort === 'new' ? b.year - a.year : a.year - b.year,
  );
}

/**
 * Применяет поиск, фильтры и сортировку к списку треков за один проход.
 * Порядок важен только для читаемости результата — сортировка всегда
 * применяется последней, после того как список уже отфильтрован.
 */
export function applyTrackFilters(
  tracks: Track[],
  filters: SelectedFilters,
  search: string,
): Track[] {
  const searched = filterBySearch(tracks, search);
  const byAuthor = filterByAuthors(searched, filters.authors);
  const byGenre = filterByGenres(byAuthor, filters.genres);
  return sortTracksByYear(byGenre, filters.sort);
}
