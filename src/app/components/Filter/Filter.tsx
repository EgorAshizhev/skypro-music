'use client';

import { useState } from 'react';
import cn from 'classnames';
import styles from './Filter.module.css';
import type { Track } from '@/data/tracks';

export interface SelectedFilters {
  author: string[];
  year: number[];
  genre: string[];
}

interface FilterProps {
  tracks: Track[];
  selected: SelectedFilters;
  onChange: (filters: SelectedFilters) => void;
}

type FilterName = keyof SelectedFilters;

function getUniqueAuthors(tracks: Track[]): string[] {
  const authors = new Set<string>();
  tracks.forEach((track) => {
    track.author.split(',').forEach((name) => authors.add(name.trim()));
  });
  return Array.from(authors);
}

function getUniqueYears(tracks: Track[]): number[] {
  const years = new Set<number>();
  tracks.forEach((track) => years.add(track.year));
  return Array.from(years).sort((a, b) => b - a);
}

function getUniqueGenres(tracks: Track[]): string[] {
  const genres = new Set<string>();
  tracks.forEach((track) => genres.add(track.genre));
  return Array.from(genres);
}

export default function Filter({ tracks, selected, onChange }: FilterProps) {
  const [openFilter, setOpenFilter] = useState<FilterName | null>(null);

  const filters: { name: FilterName; label: string; items: (string | number)[] }[] = [
    { name: 'author', label: 'исполнителю', items: getUniqueAuthors(tracks) },
    { name: 'year', label: 'году выпуска', items: getUniqueYears(tracks) },
    { name: 'genre', label: 'жанру', items: getUniqueGenres(tracks) },
  ];

  function handleFilterClick(name: FilterName) {
    setOpenFilter((prev) => (prev === name ? null : name));
  }

  function toggleValue(name: FilterName, value: string | number) {
    const current = selected[name] as (string | number)[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    onChange({ ...selected, [name]: next });
  }

  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>
      {filters.map((filter) => {
        const activeCount = selected[filter.name].length;
        return (
          <div key={filter.name} className={styles.filter__wrapper}>
            <div
              className={cn(styles.filter__button, 'btn-text', {
                [styles.active]: openFilter === filter.name || activeCount > 0,
              })}
              onClick={() => handleFilterClick(filter.name)}
            >
              {filter.label}
              {activeCount > 0 ? ` (${activeCount})` : ''}
            </div>
            {openFilter === filter.name && (
              <ul className={styles.filter__list}>
                {filter.items.map((item) => (
                  <li
                    key={item}
                    className={cn(styles.filter__listItem, {
                      [styles.filter__listItem_active]: (
                        selected[filter.name] as (string | number)[]
                      ).includes(item),
                    })}
                    onClick={() => toggleValue(filter.name, item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
