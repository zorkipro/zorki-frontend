/**
 * Универсальный хук для обработки ошибок
 *
 * Предоставляет единый интерфейс для обработки ошибок во всем приложении:
 * - Централизованное логирование
 * - Отображение уведомлений пользователю
 * - Обработка специфичных типов ошибок (валидация, авторизация)
 * - Интеграция с retry логикой
 *
 * Следует принципу DRY - устраняет дублирование try/catch блоков.
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ErrorHandler, type ErrorHandlerOptions } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';
import { ROUTES } from '@/config/routes';

export interface UseErrorHandlerReturn {
  /**
   * Обрабатывает ошибку и показывает уведомление
   * @param error - Ошибка для обработки
   * @param options - Опции обработки
   */
  handleError: (error: unknown, options?: ErrorHandlerOptions) => void;

  /**
   * Обрабатывает ошибку без показа уведомлений
   * @param error - Ошибка для обработки
   */
  handleErrorSilently: (error: unknown) => void;

  /**
   * Обрабатывает ошибку валидации
   * @param error - Ошибка валидации
   * @param options - Опции обработки
   */
  handleValidationError: (error: unknown, options?: ErrorHandlerOptions) => void;

  /**
   * Обрабатывает ошибку авторизации
   * @param error - Ошибка авторизации
   */
  handleAuthError: (error: unknown) => void;

  /**
   * Обертка для асинхронной функции с автоматической обработкой ошибок
   * @param fn - Асинхронная функция
   * @param options - Опции обработки ошибок
   * @returns Результат выполнения функции или null при ошибке
   */
  withErrorHandling: <T>(fn: () => Promise<T>, options?: ErrorHandlerOptions) => Promise<T | null>;

  /**
   * Обертка для синхронной функции с автоматической обработкой ошибок
   * @param fn - Синхронная функция
   * @param options - Опции обработки ошибок
   * @returns Результат выполнения функции или null при ошибке
   */
  withErrorHandlingSync: <T>(fn: () => T, options?: ErrorHandlerOptions) => T | null;
}

/**
 * Универсальный хук для обработки ошибок
 *
 * @param defaultOptions - Опции по умолчанию для всех обработчиков ошибок
 * @returns Набор функций для обработки ошибок
 *
 * @example
 * const { handleError, withErrorHandling } = useErrorHandler();
 *
 * // Простая обработка ошибки
 * try {
 *   await someAction();
 * } catch (error) {
 *   handleError(error);
 * }
 *
 * // Автоматическая обработка
 * const result = await withErrorHandling(async () => {
 *   return await someAction();
 * });
 */
export const useErrorHandler = (
  defaultOptions?: Partial<ErrorHandlerOptions>
): UseErrorHandlerReturn => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Создаем экземпляр ErrorHandler с настройками
  const errorHandler = ErrorHandler.getInstance({
    showNotification: true,
    logError: true,
    showToast: (message, type = 'error') => {
      toast({
        title: type === 'error' ? 'Ошибка' : type === 'warning' ? 'Предупреждение' : 'Информация',
        description: message,
        variant: type === 'error' ? 'destructive' : 'default',
      });
    },
    navigate,
    ...defaultOptions,
  });

  /**
   * Обрабатывает ошибку и показывает уведомление
   */
  const handleError = useCallback(
    (error: unknown, options?: ErrorHandlerOptions) => {
      logger.error('Handling error', error, {
        component: 'useErrorHandler',
        options,
      });

      errorHandler.handleError(error, options);
    },
    [errorHandler]
  );

  /**
   * Обрабатывает ошибку без показа уведомлений
   */
  const handleErrorSilently = useCallback(
    (error: unknown) => {
      errorHandler.handleErrorSilently(error);
    },
    [errorHandler]
  );

  /**
   * Обрабатывает ошибку валидации
   */
  const handleValidationError = useCallback(
    (error: unknown, options?: ErrorHandlerOptions) => {
      errorHandler.handleValidationError(error, options);
    },
    [errorHandler]
  );

  /**
   * Обрабатывает ошибку авторизации
   */
  const handleAuthError = useCallback(
    (error: unknown) => {
      errorHandler.handleAuthError(error, {
        navigate: () => navigate(ROUTES.AUTH.LOGIN),
      });
    },
    [errorHandler, navigate]
  );

  /**
   * Обертка для асинхронной функции с автоматической обработкой ошибок
   */
  const withErrorHandling = useCallback(
    async <T>(fn: () => Promise<T>, options?: ErrorHandlerOptions): Promise<T | null> => {
      try {
        return await fn();
      } catch (error) {
        handleError(error, options);
        return null;
      }
    },
    [handleError]
  );

  /**
   * Обертка для синхронной функции с автоматической обработкой ошибок
   */
  const withErrorHandlingSync = useCallback(
    <T>(fn: () => T, options?: ErrorHandlerOptions): T | null => {
      try {
        return fn();
      } catch (error) {
        handleError(error, options);
        return null;
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleErrorSilently,
    handleValidationError,
    handleAuthError,
    withErrorHandling,
    withErrorHandlingSync,
  };
};

/**
 * Хук для обработки ошибок с автоматическим retry
 *
 * @example
 * const { executeWithRetry } = useErrorHandlerWithRetry();
 *
 * const data = await executeWithRetry(
 *   () => fetchData(),
 *   { maxAttempts: 3, delay: 1000 }
 * );
 */
export const useErrorHandlerWithRetry = () => {
  const { handleError, handleErrorSilently } = useErrorHandler();

  const executeWithRetry = useCallback(
    async <T>(
      fn: () => Promise<T>,
      options?: {
        maxAttempts?: number;
        delay?: number;
        showErrors?: boolean;
      }
    ): Promise<T | null> => {
      const { maxAttempts = 3, delay = 1000, showErrors = true } = options || {};

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await fn();
        } catch (error) {
          if (attempt === maxAttempts) {
            // Последняя попытка - показываем ошибку
            if (showErrors) {
              handleError(error);
              logger.error(`Failed after ${maxAttempts} attempts`, error, {
                component: 'useErrorHandlerWithRetry',
                maxAttempts,
              });
            } else {
              handleErrorSilently(error);
            }
            return null;
          }

          // Ждем перед следующей попыткой
          await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        }
      }

      return null;
    },
    [handleError, handleErrorSilently]
  );

  return { executeWithRetry };
};
