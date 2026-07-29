import cn from 'classnames';
import styles from './PlayerControls.module.css';

export default function PlayerControls() {
  return (
    <div className={styles.player__controls}>
      <div className={styles.player__btnPrev}>
        <svg className={styles.player__btnPrevSvg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
        </svg>
      </div>
      <div className={cn(styles.player__btnPlay, 'btn')}>
        <svg className={styles.player__btnPlaySvg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-play"></use>
        </svg>
      </div>
      <div className={styles.player__btnNext}>
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
