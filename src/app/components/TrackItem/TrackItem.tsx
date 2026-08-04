'use client';

import cn from 'classnames';
import styles from './TrackItem.module.css';
import type { Track } from '@/data/tracks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentTrack, togglePlay } from '@/store/features/playerSlice';

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
      dispatch(setCurrentTrack(track));
    }
  }

  return (
    <div className={styles.playlist__item}>
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage} onClick={handleClick}>
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
            <a
              className={styles.track__titleLink}
              href=""
              onClick={(e) => e.preventDefault()}
            >
              {track.title}{' '}
              {track.subtitle && (
                <span className={styles.track__titleSpan}>
                  {track.subtitle}
                </span>
              )}
            </a>
          </div>
        </div>
        <div className={styles.track__author}>
          <a className={styles.track__authorLink} href="">
            {track.author}
          </a>
        </div>
        <div className={styles.track__album}>
          <a className={styles.track__albumLink} href="">
            {track.album}
          </a>
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