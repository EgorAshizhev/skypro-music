'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { hydrateAuth, type AuthUser } from './features/authSlice';
import { fetchFavorites } from './features/favoritesSlice';
import { useAppDispatch, useAppSelector } from './hooks';

function AuthHydrator() {
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    try {
      const rawUser = localStorage.getItem('sm_user');
      const accessToken = localStorage.getItem('sm_access');
      const refreshToken = localStorage.getItem('sm_refresh');

      if (rawUser && accessToken && refreshToken) {
        const user = JSON.parse(rawUser) as AuthUser;
        store.dispatch(hydrateAuth({ user, accessToken, refreshToken }));
        return;
      }
    } catch {
      // повреждённые данные в localStorage — просто игнорируем
    }

    // authChecked нужно выставить в любом случае — даже если сохранённой
    // сессии не было, чтобы защищённые страницы знали, что проверка уже
    // прошла и можно принимать решение о редиректе.
    store.dispatch(hydrateAuth(null));
  }, []);

  return null;
}

// Подгружает список избранных треков сразу как только пользователь
// авторизован (после восстановления сессии или логина), и сбрасывает его
// при выходе — единая точка синхронизации, без дублирования в компонентах.
function FavoritesSync() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const status = useAppSelector((state) => state.favorites.status);

  useEffect(() => {
    if (accessToken && status === 'idle') {
      dispatch(fetchFavorites());
    }
  }, [accessToken, status, dispatch]);

  return null;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      <FavoritesSync />
      {children}
    </Provider>
  );
}
