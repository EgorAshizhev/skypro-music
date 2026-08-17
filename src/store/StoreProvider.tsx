'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { hydrateAuth, type AuthUser } from './features/authSlice';

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
      }
    } catch {
      // повреждённые данные в localStorage — просто игнорируем
    }
  }, []);

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
      {children}
    </Provider>
  );
}
