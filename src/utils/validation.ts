/**
 * Валидация UUID строки
 * @param uuid - строка для проверки
 * @returns true если строка является валидным UUID
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }

  // Регулярное выражение для проверки UUID v4 формата
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Проверяет, является ли строка валидным UUID или null/undefined
 * @param uuid - строка для проверки
 * @returns true если строка является валидным UUID или null/undefined
 */
export function isValidUUIDOrNull(uuid: string | null | undefined): boolean {
  if (uuid === null || uuid === undefined) {
    return true;
  }
  return isValidUUID(uuid);
}
