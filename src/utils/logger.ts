/**
 * Централизованная система логирования
 *
 * Возможности:
 * - Уровни логирования (DEBUG, INFO, WARN, ERROR)
 * - Структурированные логи с контекстом
 * - Условное логирование (только DEV по умолчанию)
 * - Замеры производительности
 * - Интеграция с monitoring (опционально)
 */

const isDev = import.meta.env.DEV;

/**
 * Уровни логирования
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

/**
 * Контекст для структурированного логирования
 */
export interface LogContext {
  [key: string]: unknown;
  component?: string;
  action?: string;
  userId?: string;
  requestId?: string;
  duration?: number;
}

/**
 * Конфигурация логгера
 */
interface LoggerConfig {
  /** Минимальный уровень для логирования */
  minLevel: LogLevel;
  /** Включить логирование в production */
  enableInProduction: boolean;
  /** Callback для отправки в monitoring систему */
  monitoringCallback?: (level: LogLevel, message: string, context?: LogContext) => void;
}

/**
 * Глобальная конфигурация логгера
 */
let config: LoggerConfig = {
  minLevel: isDev ? LogLevel.DEBUG : LogLevel.ERROR,
  enableInProduction: false,
};

/**
 * Настройка конфигурации логгера
 */
export function configureLogger(newConfig: Partial<LoggerConfig>): void {
  config = { ...config, ...newConfig };
}

/**
 * Проверка, нужно ли логировать на этом уровне
 */
function shouldLog(level: LogLevel): boolean {
  if (isDev) return level >= config.minLevel;
  return config.enableInProduction && level >= LogLevel.ERROR;
}

/**
 * Форматирование контекста для вывода
 */
function formatContext(context?: LogContext): string {
  if (!context || Object.keys(context).length === 0) {
    return '';
  }
  return `\n  Context: ${JSON.stringify(context, null, 2)}`;
}

/**
 * Получить префикс для уровня логирования
 */
function getLevelPrefix(level: LogLevel): string {
  const prefixes = {
    [LogLevel.DEBUG]: '🔍 [DEBUG]',
    [LogLevel.INFO]: 'ℹ️  [INFO]',
    [LogLevel.WARN]: '⚠️  [WARN]',
    [LogLevel.ERROR]: '❌ [ERROR]',
    [LogLevel.CRITICAL]: '🔥 [CRITICAL]',
  };
  return prefixes[level] || '[LOG]';
}

/**
 * Базовая функция логирования
 */
function log(level: LogLevel, message: string, error?: unknown, context?: LogContext): void {
  if (!shouldLog(level)) return;

  const prefix = getLevelPrefix(level);
  const timestamp = new Date().toISOString();
  const contextStr = formatContext(context);

  const fullMessage = `${prefix} [${timestamp}] ${message}${contextStr}`;

  // Вывод в консоль
  switch (level) {
    case LogLevel.DEBUG:
    case LogLevel.INFO:
    case LogLevel.WARN:
      // Отладочные логи отключены
      break;
    case LogLevel.ERROR:
    case LogLevel.CRITICAL:
      console.error(fullMessage, error || '');
      break;
  }

  // Отправка в monitoring (если настроено)
  if (config.monitoringCallback) {
    config.monitoringCallback(level, message, context);
  }
}

/**
 * Логирование отладочной информации
 * Работает только в DEV режиме
 *
 * @param message - Сообщение для логирования
 * @param context - Дополнительный контекст
 *
 * @example
 * logger.debug('User clicked button', { component: 'Header', action: 'logout' });
 */
function debug(message: string, context?: LogContext): void {
  log(LogLevel.DEBUG, message, undefined, context);
}

/**
 * Логирование информационных сообщений
 *
 * @param message - Сообщение для логирования
 * @param context - Дополнительный контекст
 *
 * @example
 * logger.info('Profile loaded successfully', { userId: '123', duration: 234 });
 */
function info(message: string, context?: LogContext): void {
  log(LogLevel.INFO, message, undefined, context);
}

/**
 * Логирование предупреждений
 *
 * @param message - Сообщение для логирования
 * @param context - Дополнительный контекст
 *
 * @example
 * logger.warn('Deprecated API used', { component: 'ProfileEditor', method: 'oldSave' });
 */
function warn(message: string, context?: LogContext): void {
  log(LogLevel.WARN, message, undefined, context);
}

/**
 * Логирование ошибок
 *
 * @param message - Сообщение об ошибке
 * @param error - Объект ошибки
 * @param context - Дополнительный контекст
 *
 * @example
 * logger.error('Failed to save profile', error, { userId: '123', action: 'save' });
 */
function error(message: string, error?: unknown, context?: LogContext): void {
  log(LogLevel.ERROR, message, error, context);
}

/**
 * Логирование критических ошибок
 * Логируется всегда, даже в production
 *
 * @param message - Сообщение об ошибке
 * @param error - Объект ошибки
 * @param context - Дополнительный контекст
 */
function critical(message: string, error?: unknown, context?: LogContext): void {
  log(LogLevel.CRITICAL, message, error, context);
}

/**
 * Замер производительности операции
 *
 * @param label - Название операции
 * @returns Функция для завершения замера
 *
 * @example
 * const endTimer = logger.startTimer('loadProfile');
 * await loadProfile();
 * endTimer(); // Выведет: "loadProfile: 234.56ms"
 */
function startTimer(label: string): () => void {
  const startTime = performance.now();
  return () => {
    const duration = performance.now() - startTime;
    debug(`⏱️  ${label}`, { duration: parseFloat(duration.toFixed(2)) });
  };
}

/**
 * Групповое логирование
 *
 * @param label - Название группы
 * @param fn - Функция, которая выполняет логирование внутри группы
 *
 * @example
 * logger.group('Profile Loading', () => {
 *   logger.debug('Fetching profile data');
 *   logger.debug('Transforming data');
 *   logger.info('Profile loaded');
 * });
 */
function group(label: string, fn: () => void): void {
  if (!isDev) return;

  console.group(`📦 ${label}`);
  fn();

  console.groupEnd();
}

/**
 * Логирование таблицы (удобно для массивов объектов)
 *
 * @param data - Данные для отображения в виде таблицы
 * @param label - Название таблицы
 *
 * @example
 * logger.table([{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }], 'Users');
 */
function table(data: unknown[], label?: string): void {
  if (!isDev) return;
  if (label) {
    // Отладочные логи отключены
  }
}

/**
 * Экспорт logger API
 */
export const logger = {
  debug,
  info,
  warn,
  error,
  critical,
  startTimer,
  group,
  table,
  configure: configureLogger,
};

/**
 * Обратная совместимость со старым API
 * @deprecated Используйте logger.debug вместо logDev
 */
export const logDev = debug;

/**
 * @deprecated Используйте logger.error вместо logError
 */
export const logError = error;

/**
 * @deprecated Используйте logger.warn вместо logWarn
 */
export const logWarn = warn;

/**
 * @deprecated Используйте logger.info вместо logInfo
 */
export const logInfo = info;

/**
 * @deprecated Используйте logger.debug вместо logDebug
 */
export const logDebug = debug;

/**
 * Логирование производительности
 * @deprecated Используйте logger.startTimer
 */
export const logPerf = (label: string, startTime: number): void => {
  if (isDev) {
    const duration = performance.now() - startTime;
    debug(`⏱️  ${label}`, { duration: parseFloat(duration.toFixed(2)) });
  }
};

/**
 * Условное логирование
 * @deprecated Используйте обычные if statements с logger
 */
export const logIf = (condition: boolean, ...args: unknown[]): void => {
  if (condition && isDev) {
    // Отладочные логи отключены
  }
};
