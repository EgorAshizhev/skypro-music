'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Centerblock.module.css';
import Search from '@/app/components/Search/Search';
import Filter, { type SelectedFilters } from '@/app/components/Filter/Filter';
import Playlist from '@/app/components/Playlist/Playlist';
import Loader from '@/app/components/Loader/Loader';
import ErrorMessage from '@/app/components/ErrorMessage/ErrorMessage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllTracks } from '@/store/features/tracksSlice';
import { fetchSelectionTracks } from '@/store/features/selectionsSlice';
import { fetchFavorites } from '@/store/features/favoritesSlice';
import { setPlaylist } from '@/store/features/playerSlice';
import type { Track } from '@/data/tracks';

interface CenterblockProps {
  selectionId?: number;
  // Режим страницы "Мои треки" — показывает только избранные треки
  // пользователя и требует авторизации.
  favoritesOnly?: boolean;
}

const emptyFilters: SelectedFilters = { author: [], year: [], genre: [] };

export default function Centerblock({
  selectionId,
  favoritesOnly = false,
}: CenterblockProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const allTracksState = useAppSelector((state) => state.tracks);
  const selectionState = useAppSelector((state) => state.selections);
  const favoritesState = useAppSelector((state) => state.favorites);
  const { user, authChecked } = useAppSelector((state) => state.auth);

  const [filters, setFilters] = useState<SelectedFilters>(emptyFilters);

  // Сброс фильтров при переходе между главной и подборкой — по
  // рекомендованному React-паттерну "adjust state during render",
  // а не setState внутри useEffect (вызывает лишний ререндер).
  const [prevSelectionId, setPrevSelectionId] = useState(selectionId);
  if (selectionId !== prevSelectionId) {
    setPrevSelectionId(selectionId);
    setFilters(emptyFilters);
  }

  // Страница избранного доступна только авторизованным пользователям —
  // как только проверка сессии завершена и пользователя нет, уводим на /signin.
  useEffect(() => {
    if (favoritesOnly && authChecked && !user) {
      router.replace('/signin');
    }
  }, [favoritesOnly, authChecked, user, router]);

  useEffect(() => {
    if (favoritesOnly) {
      if (user && favoritesState.status === 'idle') {
        dispatch(fetchFavorites());
      }
      return;
    }
    if (selectionId !== undefined) {
      dispatch(fetchSelectionTracks(selectionId));
    } else if (allTracksState.status === 'idle') {
      dispatch(fetchAllTracks());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoritesOnly, selectionId, dispatch, user]);

  const title = favoritesOnly
    ? 'Мои треки'
    : selectionId !== undefined
      ? (selectionState.currentName ?? 'Подборка')
      : 'Треки';

  const status = favoritesOnly
    ? favoritesState.status
    : selectionId !== undefined
      ? selectionState.currentStatus
      : allTracksState.status;

  const error = favoritesOnly
    ? favoritesState.error
    : selectionId !== undefined
      ? selectionState.currentError
      : allTracksState.error;

  const sourceTracks: Track[] = favoritesOnly
    ? favoritesState.tracks
    : selectionId !== undefined
      ? selectionState.currentTracks
      : allTracksState.items;

  const filteredTracks = useMemo(() => {
    return sourceTracks.filter((track) => {
      const authorOk =
        filters.author.length === 0 ||
        track.author
          .split(',')
          .some((name) => filters.author.includes(name.trim()));
      const yearOk =
        filters.year.length === 0 || filters.year.includes(track.year);
      const genreOk =
        filters.genre.length === 0 || filters.genre.includes(track.genre);
      return authorOk && yearOk && genreOk;
    });
  }, [sourceTracks, filters]);

  useEffect(() => {
    dispatch(setPlaylist(filteredTracks));
  }, [filteredTracks, dispatch]);

  // Пока не завершилась проверка сессии (или пользователь уже уводится на
  // /signin), не рендерим содержимое защищённой страницы.
  if (favoritesOnly && (!authChecked || !user)) {
    return (
      <div className={styles.centerblock}>
        <Loader text="Проверка авторизации" />
      </div>
    );
  }

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>{title}</h2>
      <Filter
        tracks={sourceTracks}
        selected={filters}
        onChange={setFilters}
      />
      <div className={styles.centerblock__playlistWrapper}>
        {(status === 'loading' || status === 'idle') && (
          <Loader text="Загрузка треков" />
        )}
        {status === 'failed' && <ErrorMessage message={error ?? undefined} />}
        {status === 'succeeded' && <Playlist tracks={filteredTracks} />}
      </div>
    </div>
  );
}
