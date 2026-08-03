import styles from './Centerblock.module.css';
import Search from '@/app/components/Search/Search';
import Filter from '@/app/components/Filter/Filter';
import Playlist from '@/app/components/Playlist/Playlist';

export default function Centerblock() {
  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>Треки</h2>
      <Filter />
      {/* Добавляем обертку для Playlist */}
      <div className={styles.centerblock__playlistWrapper}>
        <Playlist />
      </div>
    </div>
  );
}