'use client';

import { useEffect } from 'react';
import styles from './Toast.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearFavoritesError } from '@/store/features/favoritesSlice';

const AUTO_HIDE_MS = 4000;

// Показывает ошибки операций с избранным (не удалось поставить/снять лайк,
// не удалось загрузить список) в виде всплывающего уведомления.
export default function Toast() {
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.favorites.error);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      dispatch(clearFavoritesError());
    }, AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div className={styles.toast} role="alert">
      {message}
    </div>
  );
}
