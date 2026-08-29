'use client';

import { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import styles from './Filter.module.css';
import type { Track } from '@/data/tracks';
import {
  getUniqueAuthors,
  getUniqueGenres,
  type SelectedFilters,
  type SortOrder,
} from '@/utils/trackFilters';

export type { SelectedFilters } from '@/utils/trackFilters';
export { emptyFilters } from '@/utils/trackFilters';

interface FilterProps {
  tracks: Track[];
  selected: SelectedFilters;
  onChange: (filters: SelectedFilters) => void;
}

type FilterName = 'authors' | 'genres' | 'sort';

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'new', label: 'Сначала новые' },
  { value: 'old', label: 'Сначала старые' },
];

export default function Filter({ tracks, selected, onChange }: FilterProps) {
  const [openFilter, setOpenFilter] = useState<FilterName | null>(null);

  // Пересчитываем списки уникальных значений только когда реально меняется
  // исходный (неотфильтрованный) список треков, а не на каждый ререндер
  // (например, при открытии/закрытии выпадающего списка).
  const authorOptions = useMemo(() => getUniqueAuthors(tracks), [tracks]);
  const genreOptions = useMemo(() => getUniqueGenres(tracks), [tracks]);

  const handleFilterClick = useCallback((name: FilterName) => {
    setOpenFilter((prev) => (prev === name ? null : name));
  }, []);

  const toggleAuthor = useCallback(
    (value: string) => {
      const next = selected.authors.includes(value)
        ? selected.authors.filter((v) => v !== value)
        : [...selected.authors, value];
      onChange({ ...selected, authors: next });
    },
    [selected, onChange],
  );

  const toggleGenre = useCallback(
    (value: string) => {
      const next = selected.genres.includes(value)
        ? selected.genres.filter((v) => v !== value)
        : [...selected.genres, value];
      onChange({ ...selected, genres: next });
    },
    [selected, onChange],
  );

  const chooseSort = useCallback(
    (value: SortOrder) => {
      onChange({ ...selected, sort: value });
      setOpenFilter(null);
    },
    [selected, onChange],
  );

  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>

      <div className={styles.filter__wrapper}>
        <div
          className={cn(styles.filter__button, 'btn-text', {
            [styles.active]: openFilter === 'authors' || selected.authors.length > 0,
          })}
          onClick={() => handleFilterClick('authors')}
        >
          исполнителю
          {selected.authors.length > 0 ? ` (${selected.authors.length})` : ''}
        </div>
        {openFilter === 'authors' && (
          <ul className={styles.filter__list}>
            {authorOptions.map((author) => (
              <li
                key={author}
                className={cn(styles.filter__listItem, {
                  [styles.filter__listItem_active]:
                    selected.authors.includes(author),
                })}
                onClick={() => toggleAuthor(author)}
              >
                {author}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.filter__wrapper}>
        <div
          className={cn(styles.filter__button, 'btn-text', {
            [styles.active]: openFilter === 'sort' || selected.sort !== 'default',
          })}
          onClick={() => handleFilterClick('sort')}
        >
          году выпуска
        </div>
        {openFilter === 'sort' && (
          <ul className={styles.filter__list}>
            {sortOptions.map((option) => (
              <li
                key={option.value}
                className={cn(styles.filter__listItem, {
                  [styles.filter__listItem_active]:
                    selected.sort === option.value,
                })}
                onClick={() => chooseSort(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.filter__wrapper}>
        <div
          className={cn(styles.filter__button, 'btn-text', {
            [styles.active]: openFilter === 'genres' || selected.genres.length > 0,
          })}
          onClick={() => handleFilterClick('genres')}
        >
          жанру
          {selected.genres.length > 0 ? ` (${selected.genres.length})` : ''}
        </div>
        {openFilter === 'genres' && (
          <ul className={styles.filter__list}>
            {genreOptions.map((genre) => (
              <li
                key={genre}
                className={cn(styles.filter__listItem, {
                  [styles.filter__listItem_active]:
                    selected.genres.includes(genre),
                })}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
