'use client';

import { useEffect, useState, type FormEvent } from 'react';
import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Signup.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupThunk, resetSignupStatus } from '@/store/features/authSlice';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { signupStatus, signupError, user, authChecked } = useAppSelector(
    (state) => state.auth,
  );
  const isLoading = signupStatus === 'loading';

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

    if (password !== confirmPassword) {
      setFormError('Пароли не совпадают');
      return;
    }

    // В макете нет отдельного поля "Имя пользователя" — используем
    // локальную часть почты (до @) как username, требуемый API.
    const username = email.trim().split('@')[0];

    const result = await dispatch(
      signupThunk({ email: email.trim(), password, username }),
    );

    if (signupThunk.fulfilled.match(result)) {
      dispatch(resetSignupStatus());
      router.push('/signin');
    }
  }

  const errorText = formError || signupError;

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
            <input
              className={styles.modal__input}
              type="password"
              name="confirmPassword"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            <div className={styles.errorContainer}>{errorText}</div>
            <button
              className={styles.modal__btnSignupEnt}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
