/**
 * Утилита для повторных попыток выполнения асинхронных операций
 *
 * Поддерживает:
 * - Exponential backoff
 * - Настраиваемое количество попыток
 * - Условное повторение (только для определенных ошибок)
 * - Callbacks для логирования
 */

import { logger } from '@/utils/logger';
import { isApiError } from '@/utils/type-guards';

/**
 * Опции для retry логики
 */
export interface RetryOptions {
  /** Максимальное количество попыток (по умолчанию 3) */
  maxAttempts?: number;
  /** Начальная задержка в мс (по умолчанию 1000) */
  delay?: number;
  /** Коэффициент увеличения задержки (по умолчанию 2) */
  backoff?: number;
  /** Максимальная задержка в мс (по умолчанию 30000 - 30 сек) */
  maxDelay?: number;
  /** Функция для определения, нужно ли повторять попытку */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  /** Callback перед каждой попыткой */
  onAttempt?: (attempt: number) => void;
  /** Callback при ошибке попытки */
  onError?: (error: unknown, attempt: number) => void;
  /** Название операции (для логирования) */
  operationName?: string;
}

/**
 * Статистика повторных попыток
 */
export interface RetryStats {
  /** Общее количество попыток */
  totalAttempts: number;
  /** Успешно выполнено */
  successful: boolean;
  /** Время выполнения в мс */
  duration: number;
  /** Ошибки при попытках */
  errors: unknown[];
}

/**
 * Задержка выполнения на указанное время
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Вычисление задержки с exponential backoff
 */
function calculateDelay(
  attempt: number,
  options: Required<Pick<RetryOptions, 'delay' | 'backoff' | 'maxDelay'>>
): number {
  const exponentialDelay = options.delay * Math.pow(options.backoff, attempt - 1);
  return Math.min(exponentialDelay, options.maxDelay);
}

/**
 * Стандартная функция для определения, нужно ли повторять попытку
 * Повторяет только для сетевых ошибок и 5xx кодов
 */
function defaultShouldRetry(error: unknown, attempt: number): boolean {
  // Не повторяем на последней попытке
  if (attempt >= 3) return false;

  // Повторяем для сетевых ошибок
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  // Повторяем для 5xx ошибок сервера
  if (isApiError(error)) {
    return error.statusCode >= 500 && error.statusCode < 600;
  }

  // Не повторяем для остальных ошибок
  return false;
}

/**
 * Выполняет асинхронную операцию с повторными попытками
 *
 * @param fn - Асинхронная функция для выполнения
 * @param options - Опции retry
 * @returns Результат выполнения функции
 * @throws Последняя ошибка, если все попытки не удались
 *
 * @example
 * // Простое использование
 * const data = await withRetry(() => fetchProfile(id));
 *
 * @example
 * // С настройками
 * const data = await withRetry(
 *   () => fetchProfile(id),
 *   {
 *     maxAttempts: 5,
 *     delay: 2000,
 *     backoff: 2,
 *     operationName: 'fetchProfile',
 *     shouldRetry: (error) => error instanceof NetworkError
 *   }
 * );
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 2,
    maxDelay = 30000,
    shouldRetry = defaultShouldRetry,
    onAttempt,
    onError,
    operationName = 'Operation',
  } = options;

  const errors: unknown[] = [];
  const startTime = performance.now();

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Callback перед попыткой
      if (onAttempt) {
        onAttempt(attempt);
      }

      // Логирование попытки
      if (attempt > 1) {
        logger.debug(`Retry attempt ${attempt}/${maxAttempts}`, {
          operation: operationName,
        });
      }

      // Выполняем функцию
      const result = await fn();

      // Успех! Логируем если были повторы
      if (attempt > 1) {
        logger.info(`${operationName} succeeded after ${attempt} attempts`, {
          duration: performance.now() - startTime,
        });
      }

      return result;
    } catch (error) {
      errors.push(error);

      // Callback при ошибке
      if (onError) {
        onError(error, attempt);
      }

      // Логируем ошибку
      logger.warn(`Attempt ${attempt}/${maxAttempts} failed`, {
        operation: operationName,
        error: error instanceof Error ? error.message : String(error),
      });

      // Если это последняя попытка или не нужно повторять - выбрасываем ошибку
      if (attempt === maxAttempts || !shouldRetry(error, attempt)) {
        logger.error(`${operationName} failed after ${attempt} attempts`, error, {
          totalDuration: performance.now() - startTime,
          attempts: attempt,
        });
        throw error;
      }

      // Вычисляем задержку и ждем
      const delayTime = calculateDelay(attempt, { delay, backoff, maxDelay });
      logger.debug(`Waiting ${delayTime}ms before retry`, {
        operation: operationName,
      });
      await sleep(delayTime);
    }
  }

  // Этот код не должен выполниться, но TypeScript требует return
  throw new Error('Retry failed');
}

/**
 * Версия withRetry с возвратом статистики
 *
 * @param fn - Асинхронная функция для выполнения
 * @param options - Опции retry
 * @returns Объект с результатом и статистикой
 *
 * @example
 * const { result, stats } = await withRetryStats(() => fetchProfile(id));
 * // Completed in ${stats.duration}ms with ${stats.totalAttempts} attempts
 */
export async function withRetryStats<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<{ result: T; stats: RetryStats }> {
  const errors: unknown[] = [];
  const startTime = performance.now();
  let totalAttempts = 0;

  const modifiedOptions: RetryOptions = {
    ...options,
    onError: (error, attempt) => {
      errors.push(error);
      if (options.onError) {
        options.onError(error, attempt);
      }
    },
    onAttempt: (attempt) => {
      totalAttempts = attempt;
      if (options.onAttempt) {
        options.onAttempt(attempt);
      }
    },
  };

  try {
    const result = await withRetry(fn, modifiedOptions);

    return {
      result,
      stats: {
        totalAttempts,
        successful: true,
        duration: performance.now() - startTime,
        errors,
      },
    };
  } catch (error) {
    throw error; // Re-throw with stats already collected
  }
}

/**
 * Обертка для Promise.all с retry логикой для каждого промиса
 *
 * @param promises - Массив функций, возвращающих промисы
 * @param options - Опции retry
 * @returns Массив результатов
 *
 * @example
 * const results = await retryAll([
 *   () => fetchUser(1),
 *   () => fetchUser(2),
 *   () => fetchUser(3),
 * ], { maxAttempts: 3 });
 */
export async function retryAll<T>(
  promises: Array<() => Promise<T>>,
  options: RetryOptions = {}
): Promise<T[]> {
  const retriablePromises = promises.map((fn) => withRetry(fn, options));
  return Promise.all(retriablePromises);
}

/**
 * Обертка для Promise.allSettled с retry логикой
 * Полезно когда нужно выполнить все операции даже если некоторые упали
 *
 * @param promises - Массив функций, возвращающих промисы
 * @param options - Опции retry
 * @returns Массив результатов (fulfilled и rejected)
 *
 * @example
 * const results = await retryAllSettled([
 *   () => fetchUser(1),
 *   () => fetchUser(2),
 *   () => fetchUser(3),
 * ]);
 *
 * results.forEach((result, index) => {
 *   if (result.status === 'fulfilled') {
 *     // User ${index + 1}:
 *   } else {
 *     console.error(`Failed to fetch user ${index + 1}:`, result.reason);
 *   }
 * });
 */
export async function retryAllSettled<T>(
  promises: Array<() => Promise<T>>,
  options: RetryOptions = {}
): Promise<PromiseSettledResult<T>[]> {
  const retriablePromises = promises.map((fn) => withRetry(fn, options));
  return Promise.allSettled(retriablePromises);
}

/**
 * Создает функцию с встроенной retry логикой
 * Удобно для создания повторно используемых функций с retry
 *
 * @param fn - Исходная функция
 * @param options - Опции retry
 * @returns Новая функция с retry логикой
 *
 * @example
 * const fetchProfileWithRetry = createRetryable(
 *   (id: string) => api.fetchProfile(id),
 *   { maxAttempts: 3, delay: 1000 }
 * );
 *
 * // Использование
 * const profile = await fetchProfileWithRetry('123');
 */
export function createRetryable<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: RetryOptions = {}
): (...args: TArgs) => Promise<TResult> {
  return (...args: TArgs) => withRetry(() => fn(...args), options);
}

/**
 * Предустановленные конфигурации retry для разных сценариев
 */
export const RetryPresets = {
  /** Быстрый retry для простых операций */
  FAST: {
    maxAttempts: 2,
    delay: 500,
    backoff: 1.5,
    maxDelay: 2000,
  } as RetryOptions,

  /** Стандартный retry для большинства API запросов */
  STANDARD: {
    maxAttempts: 3,
    delay: 1000,
    backoff: 2,
    maxDelay: 10000,
  } as RetryOptions,

  /** Агрессивный retry для критичных операций */
  AGGRESSIVE: {
    maxAttempts: 5,
    delay: 2000,
    backoff: 2,
    maxDelay: 30000,
  } as RetryOptions,

  /** Для загрузки файлов (большие задержки) */
  FILE_UPLOAD: {
    maxAttempts: 3,
    delay: 3000,
    backoff: 2,
    maxDelay: 60000,
  } as RetryOptions,
};
