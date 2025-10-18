/**
 * Утилиты для работы с username
 */

/**
 * Нормализует username, убирая символ @ если он есть
 *
 * @param username - Исходный username (может содержать @)
 * @returns Нормализованный username без @
 *
 * @example
 * normalizeUsername('@username') // 'username'
 * normalizeUsername('username') // 'username'
 * normalizeUsername('@user_name') // 'user_name'
 */
export function normalizeUsername(username: string | undefined | null): string {
  if (!username) {
    return "";
  }

  return username.replace("@", "").trim();
}

/**
 * Форматирует username для отображения, добавляя @ если его нет
 *
 * @param username - Исходный username
 * @returns Отформатированный username с @
 *
 * @example
 * formatUsernameForDisplay('username') // '@username'
 * formatUsernameForDisplay('@username') // '@username'
 */
export function formatUsernameForDisplay(
  username: string | undefined | null,
): string {
  if (!username) {
    return "";
  }

  const normalized = normalizeUsername(username);
  return normalized ? `@${normalized}` : "";
}
