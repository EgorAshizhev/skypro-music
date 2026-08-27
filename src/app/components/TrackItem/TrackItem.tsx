'use client';

import cn from 'classnames';
import styles from './TrackItem.module.css';
import type { Track } from '@/data/tracks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { playTrack, togglePlay } from '@/store/features/playerSlice';

interface TrackItemProps {
  track: Track;
}

export default function TrackItem({ track }: TrackItemProps) {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);

  const isCurrent = currentTrack?.id === track.id;
  const isCurrentPlaying = isCurrent && isPlaying;

  function handleClick() {
    if (isCurrent) {
      dispatch(togglePlay());
    } else {
      dispatch(playTrack(track));
    }
  }

  return (
    <div className={styles.playlist__item}>
      <div
        className={cn(styles.playlist__track, 'btn')}
        onClick={handleClick}
      >
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
        <div>
          <svg className={styles.track__timeSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles.track__timeText}>{track.duration}</span>
        </div>
      </div>
    </div>
  );
}