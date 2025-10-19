// Универсальный обработчик ошибок с переводами на русский язык

import { APIError } from "@/api/client";
import { logger } from "@/utils/logger";
import {
  translateError,
  getMainErrorMessage,
  getValidationErrors,
  isValidationError,
} from "@/utils/errorTranslations";

// Error Handler Types

export interface ErrorHandlerOptions {
  /** Показать уведомление пользователю */
  showNotification?: boolean;
  /** Логировать ошибку в консоль */
  logError?: boolean;
  /** Перенаправить на страницу ошибки */
  redirectOnError?: boolean;
  /** Функция для показа уведомлений */
  showToast?: (message: string, type?: "error" | "warning" | "info") => void;
  /** Функция для перенаправления */
  navigate?: (path: string) => void;
}

export interface ProcessedError {
  /** Основное сообщение об ошибке на русском языке */
  message: string;
  /** Ошибки валидации полей */
  fieldErrors: Record<string, string>;
  /** HTTP статус код */
  statusCode?: number;
  /** Является ли ошибка ошибкой валидации */
  isValidationError: boolean;
  /** Оригинальная ошибка */
  originalError: unknown;
}

// Error Handler Class

export class ErrorHandler {
  private static instance: ErrorHandler;
  private defaultOptions: ErrorHandlerOptions;

  constructor(options: ErrorHandlerOptions = {}) {
    this.defaultOptions = {
      showNotification: true,
      logError: true,
      redirectOnError: false,
      ...options,
    };
  }

  static getInstance(options?: ErrorHandlerOptions): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler(options);
    }
    return ErrorHandler.instance;
  }

  /**
   * Обрабатывает ошибку и возвращает структурированную информацию
   */
  processError(
    error: unknown,
    options: ErrorHandlerOptions = {},
  ): ProcessedError {
    const mergedOptions = { ...this.defaultOptions, ...options };

    // Логируем ошибку если нужно
    if (mergedOptions.logError) {
      logger.error("Error processed", error);
    }

    // Получаем основное сообщение об ошибке
    const message = getMainErrorMessage(error);

    // Получаем ошибки валидации полей
    const fieldErrors = getValidationErrors(error);

    // Определяем статус код
    let statusCode: number | undefined;
    if (error instanceof APIError) {
      statusCode = error.statusCode;
    } else if (error && typeof error === "object") {
      const errorObj = error as Record<string, unknown>;
      if (typeof errorObj.statusCode === "number") {
        statusCode = errorObj.statusCode;
      } else if (typeof errorObj.status === "number") {
        statusCode = errorObj.status;
      }
    }

    const processedError: ProcessedError = {
      message,
      fieldErrors,
      statusCode,
      isValidationError: isValidationError(error),
      originalError: error,
    };

    // Показываем уведомление если нужно
    if (mergedOptions.showNotification && mergedOptions.showToast) {
      mergedOptions.showToast(message, "error");
    }

    // Перенаправляем если нужно
    if (mergedOptions.redirectOnError && mergedOptions.navigate) {
      this.handleRedirect(statusCode, mergedOptions.navigate);
    }

    return processedError;
  }

  /**
   * Обрабатывает ошибку и показывает уведомление
   */
  handleError(
    error: unknown,
    options: ErrorHandlerOptions = {},
  ): ProcessedError {
    return this.processError(error, options);
  }

  /**
   * Обрабатывает ошибку без показа уведомлений (только логирование)
   */
  handleErrorSilently(error: unknown): ProcessedError {
    return this.processError(error, {
      showNotification: false,
      logError: true,
    });
  }

  /**
   * Обрабатывает ошибку валидации
   */
  handleValidationError(
    error: unknown,
    options: ErrorHandlerOptions = {},
  ): ProcessedError {
    const processedError = this.processError(error, options);

    // Для ошибок валидации показываем более детальное сообщение
    if (
      processedError.isValidationError &&
      Object.keys(processedError.fieldErrors).length > 0
    ) {
      const fieldNames = Object.keys(processedError.fieldErrors);
      const detailedMessage = `Ошибки в полях: ${fieldNames.join(", ")}`;

      if (options.showToast) {
        options.showToast(detailedMessage, "warning");
      }
    }

    return processedError;
  }

  /**
   * Обрабатывает ошибки авторизации
   */
  handleAuthError(
    error: unknown,
    options: ErrorHandlerOptions = {},
  ): ProcessedError {
    const processedError = this.processError(error, options);

    // Специальная обработка для ошибок авторизации
    if (processedError.statusCode === 401) {
      // Очищаем токены
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("adminToken");

      // Перенаправляем на страницу входа
      if (options.navigate) {
        options.navigate("/login");
      } else {
        window.location.href = "/login";
      }
    } else if (processedError.statusCode === 403) {
      // Показываем специальное сообщение для ошибок доступа
      const accessDeniedMessage =
        "У вас нет прав для выполнения этого действия";
      if (options.showToast) {
        options.showToast(accessDeniedMessage, "warning");
      }
    }

    return processedError;
  }

  /**
   * Определяет нужно ли перенаправлять пользователя
   */
  private handleRedirect(
    statusCode: number | undefined,
    navigate: (path: string) => void,
  ): void {
    if (!statusCode) return;

    switch (statusCode) {
      case 401:
        navigate("/login");
        break;
      case 403:
        navigate("/unauthorized");
        break;
      case 404:
        navigate("/not-found");
        break;
      case 500:
        navigate("/server-error");
        break;
      default:
        // Не перенаправляем для других ошибок
        break;
    }
  }

  /**
   * Обновляет настройки по умолчанию
   */
  updateDefaultOptions(options: Partial<ErrorHandlerOptions>): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }
}

// React Hook for Error Handling

import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export interface UseErrorHandlerOptions extends ErrorHandlerOptions {
  /** Показывать уведомления по умолчанию */
  showNotifications?: boolean;
}

/**
 * Hook for using error handler in React components
 */
export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const navigate = useNavigate();

  const errorHandler = useMemo(() => {
    return ErrorHandler.getInstance({
      navigate,
      ...options,
    });
  }, [navigate]); // Убираем options из зависимостей чтобы избежать перерендеров

  const handleError = useCallback(
    (error: unknown, customOptions?: ErrorHandlerOptions) => {
      return errorHandler.handleError(error, customOptions);
    },
    [errorHandler],
  );

  const handleErrorSilently = useCallback(
    (error: unknown) => {
      return errorHandler.handleErrorSilently(error);
    },
    [errorHandler],
  );

  const handleValidationError = useCallback(
    (error: unknown, customOptions?: ErrorHandlerOptions) => {
      return errorHandler.handleValidationError(error, customOptions);
    },
    [errorHandler],
  );

  const handleAuthError = useCallback(
    (error: unknown, customOptions?: ErrorHandlerOptions) => {
      return errorHandler.handleAuthError(error, customOptions);
    },
    [errorHandler],
  );

  return {
    handleError,
    handleErrorSilently,
    handleValidationError,
    handleAuthError,
    errorHandler,
  };
}

// Utility Functions

/**
 * Быстрая функция для обработки ошибок без создания экземпляра класса
 */
export function quickHandleError(error: unknown): ProcessedError {
  const handler = ErrorHandler.getInstance();
  return handler.handleErrorSilently(error);
}

/**
 * Получает только сообщение об ошибке на русском языке
 */
export function getErrorMessage(error: unknown): string {
  return getMainErrorMessage(error);
}

/**
 * Получает ошибки валидации полей
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  return getValidationErrors(error);
}

/**
 * Проверяет является ли ошибка ошибкой валидации
 */
export function isFieldValidationError(error: unknown): boolean {
  return isValidationError(error);
}
