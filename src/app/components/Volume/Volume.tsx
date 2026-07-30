import cn from 'classnames';
import styles from './Volume.module.css';

export default function Volume() {
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
        />
      </div>
    </div>
  );
}
