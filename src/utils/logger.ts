/**
 * Упрощенная система логирования
 * Только для критических ошибок в production
 */

const isDev = import.meta.env.DEV;

/**
 * Логирование ошибок
 * Работает только в development режиме
 * @param message - сообщение об ошибке
 * @param error - объект ошибки (опционально)
 * @param context - дополнительный контекст (опционально, только для development)
 */
export function logError(message: string, error?: unknown, context?: Record<string, unknown>): void {
  if (isDev) {
    if (context) {
      console.error(`❌ [ERROR] ${message}`, error || '', context);
    } else {
      console.error(`❌ [ERROR] ${message}`, error || '');
    }
  }
}

/**
 * Логирование критических ошибок
 * Логируется всегда, даже в production
 * @param message - сообщение об ошибке
 * @param error - объект ошибки (опционально)
 * @param context - дополнительный контекст (опционально)
 */
export function logCritical(message: string, error?: unknown, context?: Record<string, unknown>): void {
  if (context) {
    console.error(`🔥 [CRITICAL] ${message}`, error || '', context);
  } else {
    console.error(`🔥 [CRITICAL] ${message}`, error || '');
  }
}

/**
 * Простой logger объект для обратной совместимости
 */
export const logger = {
  error: logError,
  critical: logCritical,
};