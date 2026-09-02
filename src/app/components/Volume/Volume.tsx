'use client';

import cn from 'classnames';
import styles from './Volume.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setVolume } from '@/store/features/playerSlice';

export default function Volume() {
  const dispatch = useAppDispatch();
  const volume = useAppSelector((state) => state.player.volume);

  return (
    <div className={styles.volume__content}>
      <div className={styles.volume__image}>
        <svg className={styles.volume__svg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
        </svg>
      </div>
      <div className={cn(styles.volume__progress, 'btn')}>
        <input
          className={cn(styles.volume__progressLine, 'btn')}
          type="range"
          name="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => dispatch(setVolume(Number(e.target.value)))}
        />
      </div>
    </div>
  );
}
