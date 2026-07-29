import styles from './Sidebar.module.css';

const playlists = [
  { id: 1, image: '/img/playlist01.png' },
  { id: 2, image: '/img/playlist02.png' },
  { id: 3, image: '/img/playlist03.png' },
];

export default function Sidebar() {
  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        <p className={styles.sidebar__personalName}>Sergey.Ivanov</p>
        <div className={styles.sidebar__icon}>
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>
      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          {playlists.map((playlist) => (
            <div key={playlist.id} className={styles.sidebar__item}>
              <a className={styles.sidebar__link} href="#">
                {/*TODO: img -> Image*/}
                <img
                  className={styles.sidebar__img}
                  src={playlist.image}
                  alt="day's playlist"
                  width={250}
                  height={170}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
