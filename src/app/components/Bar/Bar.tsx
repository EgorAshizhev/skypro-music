import styles from './Bar.module.css';
import PlayerControls from '@/app/components/PlayerControls/PlayerControls';
import TrackPlay from '@/app/components/TrackPlay/TrackPlay';
import Volume from '@/app/components/Volume/Volume';

export default function Bar() {
  return (
    <div className={styles.bar}>
      <div className={styles.bar__content}>
        <div className={styles.bar__playerProgress}></div>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <PlayerControls />
            <TrackPlay />
          </div>
          <div className={styles.bar__volumeBlock}>
            <Volume />
          </div>
        </div>
      </div>
    </div>
  );
}
