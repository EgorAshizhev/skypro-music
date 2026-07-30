import cn from 'classnames';
import styles from './TrackPlay.module.css';

export default function TrackPlay() {
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
            Ты та...
          </a>
        </div>
        <div className={styles.trackPlay__album}>
          <a className={styles.trackPlay__albumLink} href="">
            Баста
          </a>
        </div>
      </div>

      <div className={styles.trackPlay__likeDis}>
        <div className={cn(styles.trackPlay__like, 'btnIcon')}>
          <svg className={cn(styles.trackPlay__likeSvg, 'likeSvg')}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>
        </div>
        <div className={cn(styles.trackPlay__dislike, 'btnIcon')}>
          <svg className={cn(styles.trackPlay__dislikeSvg, 'dislikeSvg')}>
            <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
          </svg>
        </div>
      </div>
    </div>
  );
}
