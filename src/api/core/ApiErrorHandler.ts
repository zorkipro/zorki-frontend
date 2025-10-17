/**
 * ApiErrorHandler - обработка ошибок API
 * Отвечает за создание и обработку API ошибок
 */

import { ErrorHandler } from '@/utils/errorHandler';
import { tokenManager } from './TokenManager';
import type { BadRequestExceptionDto } from './types';

/**
 * Кастомный класс ошибки API
 */
export class APIError extends Error {
  /** HTTP статус код */
  statusCode: number;
  /** Массив ошибок валидации полей или null */
  errorField: BadRequestExceptionDto['errorField'];

  constructor(data: BadRequestExceptionDto) {
    super(data.message);
    this.name = 'APIError';
    this.statusCode = data.statusCode;
    this.errorField = data.errorField;

    // Сохраняем правильный stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }

  /**
   * Проверяет является ли ошибка ошибкой валидации (400)
   */
  isValidationError(): boolean {
    return this.statusCode === 400 && this.errorField !== null;
  }

  /**
   * Проверяет является ли ошибка ошибкой аутентификации (401)
   */
  isAuthError(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Проверяет является ли ошибка ошибкой доступа (403)
   */
  isForbiddenError(): boolean {
    return this.statusCode === 403;
  }

  /**
   * Проверяет является ли ошибка ошибкой сервера (5xx)
   */
  isServerError(): boolean {
    return this.statusCode >= 500 && this.statusCode < 600;
  }

  /**
   * Получить ошибки валидации в виде Record<field, message>
   */
  getValidationErrors(): Record<string, string> {
    if (!this.errorField) return {};

    return this.errorField.reduce(
      (acc, error) => {
        acc[error.field] = error.message;
        return acc;
      },
      {} as Record<string, string>
    );
  }
}

/**
 * Класс для обработки API ошибок
 */
export class ApiErrorHandler {
  private static instance: ApiErrorHandler;
  private errorHandler: ErrorHandler;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  /**
   * Получить singleton instance
   */
  static getInstance(): ApiErrorHandler {
    if (!ApiErrorHandler.instance) {
      ApiErrorHandler.instance = new ApiErrorHandler();
    }
    return ApiErrorHandler.instance;
  }

  /**
   * Обработать ошибку API
   *
   * @param error - ошибка
   * @param endpoint - endpoint для логирования
   * @returns APIError
   */
  handleError(error: unknown, endpoint: string): APIError {
    // Если уже APIError - возвращаем как есть
    if (error instanceof APIError) {
      return error;
    }

    // Обрабатываем через универсальный обработчик ошибок
    const processedError = this.errorHandler.handleErrorSilently(error);

    // Создаем APIError из обычной ошибки
    if (error instanceof Error) {
      return new APIError({
        message: processedError.message,
        statusCode: 500,
        errorField: null,
      });
    }

    // Для неизвестных ошибок
    return new APIError({
      message: processedError.message || 'Unknown error occurred',
      statusCode: 500,
      errorField: null,
    });
  }

  /**
   * Обработать ошибку аутентификации (401)
   *
   * @param errorData - данные ошибки
   * @param redirectPath - путь для редиректа (по умолчанию '/login')
   */
  handleAuthError(errorData: BadRequestExceptionDto, redirectPath = '/login'): void {
    // Обрабатываем через универсальный обработчик
    this.errorHandler.handleAuthError(errorData, {
      showNotification: false,
      logError: true,
      redirectOnError: true,
      navigate: (path: string) => {
        // Очищаем все токены при 401
        tokenManager.clearAllTokens();
        window.location.href = path || redirectPath;
      },
    });
  }

  /**
   * Проверяет нужно ли перенаправить пользователя при ошибке
   */
  shouldRedirect(statusCode: number): boolean {
    return statusCode === 401; // Только для unauthorized
  }
}

// Export singleton instance
export const apiErrorHandler = ApiErrorHandler.getInstance();
