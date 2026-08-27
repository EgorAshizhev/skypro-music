// Некоторые эндпоинты этого API возвращают массив напрямую, другие —
// обёрнутым в объект (например, { success, data: [...] } или
// { success, result: [...] }, как в ответе на регистрацию).
// Эта функция достаёт массив независимо от конкретной обёртки.
export function extractArray<T>(payload: unknown, context: string): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    for (const key of ['data', 'result', 'items', 'tracks', 'selections']) {
      if (Array.isArray(obj[key])) {
        return obj[key] as T[];
      }
    }
  }

  console.error(`Неожиданная форма ответа API (${context}):`, payload);
  throw new Error(
    `API вернул данные в неожиданном формате (${context}) — смотрите объект в консоли`,
  );
}
