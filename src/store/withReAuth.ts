import type { AppDispatch, RootState } from './store';
import { ApiError } from '@/services/httpClient';
import { refreshToken as refreshTokenRequest } from '@/services/authApi';
import { setAccessToken, logout } from './features/authSlice';

/**
 * Оборачивает авторизованный запрос к API логикой обновления токена.
 *
 * Берёт текущий access-токен из стора и выполняет `fn`. Если сервер
 * отвечает 401 (токен протух), делает запрос на обновление токена по
 * refresh-токену, сохраняет новый access-токен в сторе/localStorage и
 * повторяет исходный запрос один раз с новым токеном. Если refresh-токена
 * нет или он тоже невалиден — разлогинивает пользователя и пробрасывает
 * ошибку дальше.
 */
export async function withReAuth<T>(
  getState: () => RootState,
  dispatch: AppDispatch,
  fn: (token: string) => Promise<T>,
): Promise<T> {
  const { accessToken, refreshToken } = getState().auth;

  if (!accessToken) {
    throw new ApiError('Пользователь не авторизован', 401);
  }

  try {
    return await fn(accessToken);
  } catch (err) {
    const isUnauthorized = err instanceof ApiError && err.status === 401;
    if (!isUnauthorized) {
      throw err;
    }

    if (!refreshToken) {
      dispatch(logout());
      throw err;
    }

    try {
      const { access } = await refreshTokenRequest(refreshToken);
      dispatch(setAccessToken(access));
      return await fn(access);
    } catch (refreshErr) {
      console.error('Не удалось обновить токен:', refreshErr);
      // Разлогиниваем только если refresh-токен реально невалиден/просрочен
      // (сервер явно ответил ошибкой). Сетевой сбой (например, нет
      // соединения) — не повод стирать сессию пользователя.
      const isRefreshRejectedByServer =
        refreshErr instanceof ApiError && refreshErr.status !== 0;
      if (isRefreshRejectedByServer) {
        dispatch(logout());
      }
      throw refreshErr;
    }
  }
}
