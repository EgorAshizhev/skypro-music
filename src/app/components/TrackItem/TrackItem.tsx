'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import styles from './TrackItem.module.css';
import type { Track } from '@/data/tracks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { playTrack, togglePlay } from '@/store/features/playerSlice';
import { toggleFavoriteThunk } from '@/store/features/favoritesSlice';

interface TrackItemProps {
  track: Track;
}

export default function TrackItem({ track }: TrackItemProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);
  const isAuthenticated = useAppSelector((state) =>
    Boolean(state.auth.accessToken),
  );
  const isLiked = useAppSelector((state) =>
    state.favorites.ids.includes(track.id),
  );
  const isPending = useAppSelector((state) =>
    state.favorites.pendingIds.includes(track.id),
  );

  const isCurrent = currentTrack?.id === track.id;
  const isCurrentPlaying = isCurrent && isPlaying;

  const handleClick = useCallback(() => {
    if (isCurrent) {
      dispatch(togglePlay());
    } else {
      dispatch(playTrack(track));
    }
  }, [dispatch, isCurrent, track]);

  const handleLikeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isAuthenticated) {
        router.push('/signin');
        return;
      }
      if (isPending) return;
      dispatch(toggleFavoriteThunk(track));
    },
    [dispatch, isAuthenticated, isPending, router, track],
  );

  return (
    <div className={styles.playlist__item}>
      <div className={cn(styles.playlist__track, 'btn')} onClick={handleClick}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            {isCurrent ? (
              <span
                className={cn(styles.track__dot, {
                  [styles.track__dot_playing]: isCurrentPlaying,
                })}
              />
            ) : (
              <svg className={styles.track__titleSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
              </svg>
            )}
          </div>
          <div>
            <span className={styles.track__titleLink}>
              {track.title}{' '}
              {track.subtitle && (
                <span className={styles.track__titleSpan}>
                  {track.subtitle}
                </span>
              )}
            </span>
          </div>
        </div>
        <div className={styles.track__author}>
          <span className={styles.track__authorLink}>{track.author}</span>
        </div>
        <div className={styles.track__album}>
          <span className={styles.track__albumLink}>{track.album}</span>
        </div>
        <div className={styles.track__timeWrapper}>
          <button
            type="button"
            className={cn(styles.track__likeBtn, {
              [styles.track__likeBtn_pending]: isPending,
            })}
            onClick={handleLikeClick}
            aria-label={
              isLiked ? 'Убрать из избранного' : 'Добавить в избранное'
            }
            aria-pressed={isLiked}
          >
            <svg
              className={cn(styles.track__timeSvg, {
                [styles.track__timeSvg_liked]: isLiked,
              })}
            >
              <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
            </svg>
          </button>
          <span className={styles.track__timeText}>{track.duration}</span>
        </div>
      </div>
    </div>
  );
}
