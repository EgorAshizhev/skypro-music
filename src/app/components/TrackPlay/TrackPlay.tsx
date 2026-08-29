'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import styles from './TrackPlay.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavoriteThunk } from '@/store/features/favoritesSlice';

export default function TrackPlay() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isAuthenticated = useAppSelector((state) =>
    Boolean(state.auth.accessToken),
  );
  const isLiked = useAppSelector((state) =>
    currentTrack ? state.favorites.ids.includes(currentTrack.id) : false,
  );
  const isPending = useAppSelector((state) =>
    currentTrack ? state.favorites.pendingIds.includes(currentTrack.id) : false,
  );

  const handleLikeClick = useCallback(() => {
    if (!currentTrack) return;
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }
    if (isPending) return;
    dispatch(toggleFavoriteThunk(currentTrack));
  }, [currentTrack, dispatch, isAuthenticated, isPending, router]);

  return (
    <div className={styles.player__trackPlay}>
      <div className={styles.trackPlay__contain}>
        <div className={styles.trackPlay__image}>
          <svg className={styles.trackPlay__svg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
          </svg>
        </div>
        <div className={styles.trackPlay__author}>
          <a className={styles.trackPlay__authorLink} href="">
            {currentTrack ? currentTrack.title : 'Трек не выбран'}
          </a>
        </div>
        <div className={styles.trackPlay__album}>
          <a className={styles.trackPlay__albumLink} href="">
            {currentTrack?.author ?? ''}
          </a>
        </div>
      </div>

      <div className={styles.trackPlay__likeDis}>
        <button
          type="button"
          className={cn(styles.trackPlay__like, 'btnIcon', {
            [styles.trackPlay__like_pending]: isPending,
          })}
          onClick={handleLikeClick}
          disabled={!currentTrack}
          aria-label={
            isLiked ? 'Убрать из избранного' : 'Добавить в избранное'
          }
          aria-pressed={isLiked}
        >
          <svg
            className={cn(styles.trackPlay__likeSvg, 'likeSvg', {
              [styles.trackPlay__likeSvg_liked]: isLiked,
            })}
          >
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>
        </button>
      </div>
    </div>
  );
}
