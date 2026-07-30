import styles from './TrackItem.module.css';
import type { Track } from '@/data/tracks';

interface TrackItemProps {
  track: Track;
}

export default function TrackItem({ track }: TrackItemProps) {
  return (
    <div className={styles.playlist__item}>
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            <svg className={styles.track__titleSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
            </svg>
          </div>
          <div>
            <a className={styles.track__titleLink} href="">
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
