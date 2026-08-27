import type { ApiErrorBody } from '@/types/api';

export const BASE_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

// Единая точка выполнения запросов к API.
// Возвращает типизированный Promise<T> и бросает ApiError с человекочитаемым
// сообщением, если сервер ответил не 2xx.
export async function apiRequest<T>(
  path: string,
  { token, headers, ...options }: RequestOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError('Не удалось соединиться с сервером', 0);
  }

  if (!response.ok) {
    let message = `Произошла ошибка (${response.status})`;
    try {
      const data: ApiErrorBody = await response.json();
      message = data.message || data.detail || message;
    } catch {
      // тело ответа не JSON — оставляем сообщение по умолчанию
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  try {
    return (await response.json()) as T;
  } catch (err) {
    console.error('Ответ API не является валидным JSON:', err);
    throw new ApiError('Сервер вернул некорректный ответ', response.status);
  }
}
