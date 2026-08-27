'use client';

import { useState, type FormEvent } from 'react';
import cn from 'classnames';
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
  const { loginStatus, loginError } = useAppSelector((state) => state.auth);
  const isLoading = loginStatus === 'loading';

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

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form} onSubmit={handleSubmit}>
            <Link href="/" className={styles.modal__logo}>
              <img src="/img/logo_modal.png" alt="logo" />
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
