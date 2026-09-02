'use client';

import { useEffect, useState, type FormEvent } from 'react';
import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Signin.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginThunk } from '@/store/features/authSlice';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loginStatus, loginError, user, authChecked } = useAppSelector(
    (state) => state.auth,
  );
  const isLoading = loginStatus === 'loading';

  // Если сессия уже есть (например, пользователь перешёл на /signin по
  // старой ссылке или из истории браузера) — сразу уводим на главную,
  // а не показываем форму входа заново.
  useEffect(() => {
    if (authChecked && user) {
      router.replace('/');
    }
  }, [authChecked, user, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !password.trim()) {
      setFormError('Заполните все поля');
      return;
    }

    const result = await dispatch(
      loginThunk({ email: email.trim(), password }),
    );

    if (loginThunk.fulfilled.match(result)) {
      router.push('/');
    }
  }

  const errorText = formError || loginError;

  if (authChecked && user) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form} onSubmit={handleSubmit}>
            <Link href="/" className={styles.modal__logo}>
              <Image
                src="/img/logo_modal.png"
                alt="logo"
                width={140}
                height={21}
              />
            </Link>
            <input
              className={cn(styles.modal__input, styles.login)}
              type="text"
              name="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <input
              className={styles.modal__input}
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <div className={styles.errorContainer}>{errorText}</div>
            <button
              className={styles.modal__btnEnter}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
            <Link href="/signup" className={styles.modal__btnSignup}>
              Зарегистрироваться
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
