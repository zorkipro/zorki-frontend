/**
 * Упрощенная система логирования
 * Только для критических ошибок в production
 */

const isDev = import.meta.env.DEV;

/**
 * Логирование ошибок
 * Работает только для критических ошибок
 */
export function logError(message: string, error?: unknown): void {
  if (isDev) {
    console.error(`❌ [ERROR] ${message}`, error || '');
  }
}

/**
 * Логирование отладочной информации
 * Работает только в development
 */
export function logDev(message: string, data?: unknown): void {
  if (isDev) {
    console.log(`🔍 [DEV] ${message}`, data || '');
  }
}

/**
 * Логирование предупреждений
 * Работает только в development
 */
export function logWarn(message: string, data?: unknown): void {
  if (isDev) {
    console.warn(`⚠️ [WARN] ${message}`, data || '');
  }
}

/**
 * Логирование критических ошибок
 * Логируется всегда, даже в production
 */
export function logCritical(message: string, error?: unknown): void {
  console.error(`🔥 [CRITICAL] ${message}`, error || '');
}

/**
 * Простой logger объект для обратной совместимости
 */
export const logger = {
  dev: logDev,
  error: logError,
  warn: logWarn,
  critical: logCritical,
};