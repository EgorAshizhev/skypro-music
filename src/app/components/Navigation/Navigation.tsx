'use client';

import { useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Link href="/">
          {/*TODO: img -> Image*/}
          <img
            width={250}
            height={170}
            className={styles.logo__image}
            src="/img/logo.png"
            alt="logo"
          />
        </Link>
      </div>
      <button
        type="button"
        className={styles.nav__burger}
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label="Открыть/закрыть меню"
        aria-expanded={isMenuOpen}
      >
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </button>
      <div
        className={cn(styles.nav__menu, {
          [styles.nav__menu_hidden]: !isMenuOpen,
        })}
      >
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link href="/" className={styles.menu__link}>
              Главное
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link href="/playlist" className={styles.menu__link}>
              Мой плейлист
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link href="/signin" className={styles.menu__link}>
              Войти
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
