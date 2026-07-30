import styles from './Signup.module.css';
import cn from 'classnames';
import Link from 'next/link';

export default function Signup() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form}>
            <Link href="/" className={styles.modal__logo}>
              <img src="/img/logo_modal.png" alt="logo" />
            </Link>
            <input
              className={cn(styles.modal__input, styles.login)}
              type="text"
              name="login"
              placeholder="Почта"
            />
            <input
              className={styles.modal__input}
              type="password"
              name="password"
              placeholder="Пароль"
            />
            <input
              className={styles.modal__input}
              type="password"
              name="confirmPassword"
              placeholder="Повторите пароль"
            />
            <div className={styles.errorContainer}></div>
            <button className={styles.modal__btnSignupEnt}>
              Зарегистрироваться
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
