'use client';

import cn from 'classnames';
import styles from './PlayerControls.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  togglePlay,
  nextTrack,
  prevTrack,
  toggleShuffle,
  toggleRepeat,
} from '@/store/features/playerSlice';

export default function PlayerControls() {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);
  const isShuffle = useAppSelector((state) => state.player.isShuffle);
  const isRepeat = useAppSelector((state) => state.player.isRepeat);

  function handlePlayPause() {
    if (currentTrack) {
      dispatch(togglePlay());
    }
  }

  return (
    <div className={styles.player__controls}>
      <div
        className={cn(styles.player__btnPrev, 'btnIcon')}
        onClick={() => dispatch(prevTrack())}
      >
        <svg className={styles.player__btnPrevSvg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
        </svg>
      </div>
      <div
        className={cn(styles.player__btnPlay, 'btn')}
        onClick={handlePlayPause}
      >
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
        onClick={() => dispatch(nextTrack())}
      >
        <svg className={styles.player__btnNextSvg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
        </svg>
      </div>
      <div
        className={cn(styles.player__btnRepeat, 'btnIcon')}
        onClick={() => dispatch(toggleRepeat())}
      >
        <svg
          className={styles.player__btnRepeatSvg}
          style={isRepeat ? { stroke: '#ffffff' } : undefined}
        >
          <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
        </svg>
      </div>
      <div
        className={cn(styles.player__btnShuffle, 'btnIcon')}
        onClick={() => dispatch(toggleShuffle())}
      >
        <svg
          className={styles.player__btnShuffleSvg}
          style={isShuffle ? { stroke: '#ffffff' } : undefined}
        >
          <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
        </svg>
      </div>
    </div>
  );
}
