'use client';

import { useState } from 'react';
import cn from 'classnames';
import styles from './Filter.module.css';
import { tracks } from '@/data/tracks';

type FilterName = 'author' | 'year' | 'genre';

function getUniqueAuthors(): string[] {
  const authors = new Set<string>();
  tracks.forEach((track) => {
    track.author.split(',').forEach((name) => authors.add(name.trim()));
  });
  return Array.from(authors);
}

function getUniqueYears(): number[] {
  const years = new Set<number>();
  tracks.forEach((track) => years.add(track.year));
  return Array.from(years).sort((a, b) => b - a);
}

function getUniqueGenres(): string[] {
  const genres = new Set<string>();
  tracks.forEach((track) => genres.add(track.genre));
  return Array.from(genres);
}

const filters: {
  name: FilterName;
  label: string;
  items: (string | number)[];
}[] = [
  { name: 'author', label: 'исполнителю', items: getUniqueAuthors() },
  { name: 'year', label: 'году выпуска', items: getUniqueYears() },
  { name: 'genre', label: 'жанру', items: getUniqueGenres() },
];

export default function Filter() {
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(null);

  function handleFilterClick(name: FilterName) {
    setActiveFilter((prev) => (prev === name ? null : name));
  }

  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>
      {filters.map((filter) => (
        <div key={filter.name} className={styles.filter__wrapper}>
          <div
            className={cn(styles.filter__button, 'btn-text', {
              [styles.active]: activeFilter === filter.name,
            })}
            onClick={() => handleFilterClick(filter.name)}
          >
            {filter.label}
          </div>
          {activeFilter === filter.name && (
            <ul className={styles.filter__list}>
              {filter.items.map((item) => (
                <li key={item} className={styles.filter__listItem}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
