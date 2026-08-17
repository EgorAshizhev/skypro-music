'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';
import Loader from '@/app/components/Loader/Loader';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSelections } from '@/store/features/selectionsSlice';
import { logout } from '@/store/features/authSlice';

const fallbackImages = [
  '/img/playlist01.png',
  '/img/playlist02.png',
  '/img/playlist03.png',
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);
  const { list, listStatus } = useAppSelector((state) => state.selections);

  useEffect(() => {
    if (listStatus === 'idle') {
      dispatch(fetchSelections());
    }
  }, [listStatus, dispatch]);

  function handleLogout() {
    dispatch(logout());
    router.push('/signin');
  }

  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        <p className={styles.sidebar__personalName}>
          {user?.username ?? 'Гость'}
        </p>
        <button
          type="button"
          className={styles.sidebar__icon}
          onClick={handleLogout}
          aria-label="Выйти"
        >
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </button>
      </div>
      <div className={styles.sidebar__block}>
        {listStatus === 'loading' && <Loader text="Загрузка подборок" />}
        {listStatus === 'succeeded' && (
          <div className={styles.sidebar__list}>
            {list.map((selection, index) => (
              <div key={selection.id} className={styles.sidebar__item}>
                <Link
                  className={styles.sidebar__link}
                  href={`/selection/${selection.id}`}
                >
                  {/*TODO: img -> Image*/}
                  <img
                    className={styles.sidebar__img}
                    src={fallbackImages[index % fallbackImages.length]}
                    alt={selection.name}
                    width={250}
                    height={170}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
