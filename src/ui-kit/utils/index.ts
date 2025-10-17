/**
 * UTILS - Утилиты и хелперы
 *
 * Вспомогательные функции для работы с UI
 */

// ============================================================================
// CLASS NAME UTILITIES
// ============================================================================

/**
 * Объединяет классы с поддержкой условий
 *
 * @example
 * cn('base-class', isActive && 'active', 'another-class')
 */
export { cn } from '@/lib/utils';

// ============================================================================
// FORMATTERS - Форматирование данных
// ============================================================================

/**
 * Форматирует число с разделителями тысяч
 *
 * @example
 * formatNumber(1000000) // "1,000,000"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num);
}

/**
 * Форматирует число для компактного отображения
 *
 * @example
 * formatCompactNumber(1500) // "1.5K"
 * formatCompactNumber(1500000) // "1.5M"
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Форматирует цену в белорусских рублях
 *
 * @example
 * formatPrice(100) // "100 BYN"
 */
export function formatPrice(price: number): string {
  return `${price} BYN`;
}

/**
 * Форматирует процент
 *
 * @example
 * formatPercent(3.5) // "3.5%"
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Форматирует дату в читаемый формат
 *
 * @example
 * formatDate('2025-01-06') // "6 января 2025"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Форматирует дату в относительный формат
 *
 * @example
 * formatRelativeDate('2025-01-05') // "вчера"
 */
export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'сегодня';
  if (days === 1) return 'вчера';
  if (days < 7) return `${days} дней назад`;
  if (days < 30) return `${Math.floor(days / 7)} недель назад`;
  if (days < 365) return `${Math.floor(days / 30)} месяцев назад`;
  return `${Math.floor(days / 365)} лет назад`;
}

// ============================================================================
// VALIDATION - Валидация
// ============================================================================

/**
 * Проверяет, является ли значение валидным Instagram username
 */
export function isValidInstagramUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
  return usernameRegex.test(username);
}

// ============================================================================
// STRING UTILITIES - Работа со строками
// ============================================================================

/**
 * Обрезает строку до заданной длины и добавляет многоточие
 *
 * @example
 * truncate('Very long text', 10) // "Very long..."
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Капитализирует первую букву строки
 *
 * @example
 * capitalize('hello') // "Hello"
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Преобразует строку в slug
 *
 * @example
 * slugify('Hello World') // "hello-world"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================================
// ARRAY UTILITIES - Работа с массивами
// ============================================================================

/**
 * Группирует массив по ключу
 *
 * @example
 * groupBy(users, 'role') // { admin: [...], user: [...] }
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Убирает дубликаты из массива
 *
 * @example
 * unique([1, 2, 2, 3]) // [1, 2, 3]
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Сортирует массив по ключу
 *
 * @example
 * sortBy(users, 'name') // отсортированные пользователи
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

// ============================================================================
// DEBOUNCE & THROTTLE
// ============================================================================

/**
 * Debounce функция - вызывается только после задержки
 *
 * @example
 * const debouncedSearch = debounce(search, 300);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle функция - ограничивает частоту вызовов
 *
 * @example
 * const throttledScroll = throttle(handleScroll, 100);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// LOCAL STORAGE
// ============================================================================

/**
 * Безопасное сохранение в localStorage
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Silent error - localStorage might be disabled
  }
}

/**
 * Безопасное чтение из localStorage
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    // Silent error - localStorage might be disabled
    return defaultValue;
  }
}

/**
 * Удаление из localStorage
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // Silent error - localStorage might be disabled
  }
}

// ============================================================================
// SESSION STORAGE
// ============================================================================

/**
 * Безопасное сохранение в sessionStorage
 */
export function setSessionStorage<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Silent error - sessionStorage might be disabled
  }
}

/**
 * Безопасное чтение из sessionStorage
 */
export function getSessionStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    // Silent error - sessionStorage might be disabled
    return defaultValue;
  }
}

/**
 * Удаление из sessionStorage
 */
export function removeSessionStorage(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    // Silent error - sessionStorage might be disabled
  }
}
