'use client';

import cn from 'classnames';
import styles from './Playlist.module.css';
import TrackItem from '@/app/components/TrackItem/TrackItem';
import type { Track } from '@/data/tracks';

interface PlaylistProps {
  tracks: Track[];
}

export default function Playlist({ tracks }: PlaylistProps) {
  return (
    <div className={styles.centerblock__content}>
      <div className={styles.content__title}>
        <div className={cn(styles.playlistTitle__col, styles.col01)}>
          Трек
        </div>
        <div className={cn(styles.playlistTitle__col, styles.col02)}>
          Исполнитель
        </div>
        <div className={cn(styles.playlistTitle__col, styles.col03)}>
          Альбом
        </div>
        <div className={cn(styles.playlistTitle__col, styles.col04)}>
          <svg className={styles.playlistTitle__svg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
          </svg>
        </div>
      </div>
      <div className={styles.content__playlist}>
        {tracks.length === 0 ? (
          <div className={styles.emptyState}>Нет подходящих треков</div>
        ) : (
          tracks.map((track) => <TrackItem key={track.id} track={track} />)
        )}
      </div>
    </div>
  );
}
