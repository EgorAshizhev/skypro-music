'use client';

import cn from 'classnames';
import styles from './PlayerControls.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { togglePlay, setCurrentTrack } from '@/store/features/playerSlice';
import { tracks } from '@/data/tracks';

export default function PlayerControls() {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);

  function handlePlayPause() {
    if (currentTrack) {
      dispatch(togglePlay());
    }
  }

  function switchTrack(step: 1 | -1) {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + step + tracks.length) % tracks.length;
    dispatch(setCurrentTrack(tracks[nextIndex]));
  }

  return (
    <div className={styles.player__controls}>
      <div
        className={cn(styles.player__btnPrev, 'btnIcon')}
        onClick={() => switchTrack(-1)}
      >
        <svg className={styles.player__btnPrevSvg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
        </svg>
      </div>
      <div className={cn(styles.player__btnPlay, 'btn')} onClick={handlePlayPause}>
        <svg className={styles.player__btnPlaySvg}>
          <use
            xlinkHref={
              isPlaying
                ? '/img/icon/sprite.svg#icon-pause'
                : '/img/icon/sprite.svg#icon-play'
            }
          ></use>
        </svg>
      </div>
      <div
        className={cn(styles.player__btnNext, 'btnIcon')}
        onClick={() => switchTrack(1)}
      >
        <svg className={styles.player__btnNextSvg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
        </svg>
      </div>
      <div className={cn(styles.player__btnRepeat, 'btnIcon')}>
        <svg className={styles.player__btnRepeatSvg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
        </svg>
      </div>
      <div className={cn(styles.player__btnShuffle, 'btnIcon')}>
        <svg className={styles.player__btnShuffleSvg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
        </svg>
      </div>
    </div>
  );
}