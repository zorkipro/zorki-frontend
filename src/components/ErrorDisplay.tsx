// ============================================
// Enhanced Error Display Components
// ============================================
// Улучшенные компоненты для отображения ошибок на русском языке

import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { Button } from "@/ui-kit";
import {
  ProcessedError,
  getErrorMessage,
  getFieldErrors,
} from "@/utils/errorHandler";
import { logger } from "@/utils/logger";

// ============================================
// Error Alert Component
// ============================================

export interface ErrorAlertProps {
  /** Ошибка для отображения */
  error?: unknown;
  /** Обработанная ошибка */
  processedError?: ProcessedError;
  /** Заголовок (опционально) */
  title?: string;
  /** Вариант отображения */
  variant?: "inline" | "alert" | "toast";
  /** Тип ошибки */
  type?: "error" | "warning" | "info";
  /** Дополнительные CSS классы */
  className?: string;
  /** Показать детали ошибки */
  showDetails?: boolean;
  /** Функция для закрытия */
  onDismiss?: () => void;
  /** Показать кнопку повтора */
  showRetry?: boolean;
  /** Функция повтора */
  onRetry?: () => void;
}

/**
 * Улучшенный компонент для отображения ошибок
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  processedError,
  title,
  variant = "alert",
  type = "error",
  className = "",
  showDetails = false,
  onDismiss,
  showRetry = false,
  onRetry,
}) => {
  // Получаем обработанную ошибку
  const errorData = processedError || {
    message: getErrorMessage(error),
    fieldErrors: getFieldErrors(error),
    isValidationError: false,
    originalError: error,
  };

  if (!errorData.message && !errorData.fieldErrors) {
    return null;
  }

  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-red-50 border-red-200 text-red-800";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "warning":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-red-600";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (variant === "inline") {
    return (
      <div
        className={`p-3 text-sm ${getTypeStyles()} border rounded-md ${className}`}
      >
        <div className="flex items-start">
          {getIcon()}
          <div className="ml-2 flex-1">
            {title && <div className="font-medium mb-1">{title}</div>}
            <div>{errorData.message}</div>
            {errorData.isValidationError &&
              Object.keys(errorData.fieldErrors).length > 0 && (
                <div className="mt-2">
                  <div className="text-xs font-medium mb-1">
                    Ошибки в полях:
                  </div>
                  <ul className="text-xs list-disc list-inside">
                    {Object.entries(errorData.fieldErrors).map(
                      ([field, message]) => (
                        <li key={field}>
                          <span className="font-medium">{field}:</span>{" "}
                          {message}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="ml-2 p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "toast") {
    return (
      <div
        className={`fixed top-4 right-4 z-50 max-w-md w-full mx-4 ${getTypeStyles()} border rounded-lg shadow-lg transition-all duration-300`}
      >
        <div className="flex items-start p-4">
          <div
            className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${getIconColor()}`}
          >
            {getIcon()}
          </div>
          <div className="flex-1">
            {title && <h3 className="font-medium text-sm mb-1">{title}</h3>}
            <p className="text-sm">{errorData.message}</p>
            {errorData.isValidationError &&
              Object.keys(errorData.fieldErrors).length > 0 && (
                <div className="mt-2">
                  <div className="text-xs font-medium mb-1">
                    Ошибки в полях:
                  </div>
                  <ul className="text-xs list-disc list-inside">
                    {Object.entries(errorData.fieldErrors).map(
                      ([field, message]) => (
                        <li key={field}>
                          <span className="font-medium">{field}:</span>{" "}
                          {message}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="ml-2 p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default alert variant
  return (
    <Alert
      variant={type === "error" ? "destructive" : "default"}
      className={className}
    >
      {getIcon()}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>
        {errorData.message}
        {errorData.isValidationError &&
          Object.keys(errorData.fieldErrors).length > 0 && (
            <div className="mt-2">
              <div className="text-sm font-medium mb-1">Ошибки в полях:</div>
              <ul className="text-sm list-disc list-inside">
                {Object.entries(errorData.fieldErrors).map(
                  ([field, message]) => (
                    <li key={field}>
                      <span className="font-medium">{field}:</span> {message}
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}
        {showDetails && errorData.originalError && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs">
              Подробности ошибки
            </summary>
            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify(errorData.originalError, null, 2)}
            </pre>
          </details>
        )}
      </AlertDescription>
      {(onDismiss || (showRetry && onRetry)) && (
        <div className="flex gap-2 mt-3">
          {showRetry && onRetry && (
            <Button size="sm" onClick={onRetry}>
              Повторить
            </Button>
          )}
          {onDismiss && (
            <Button size="sm" variant="outline" onClick={onDismiss}>
              Закрыть
            </Button>
          )}
        </div>
      )}
    </Alert>
  );
};

// ============================================
// Field Error Component
// ============================================

export interface FieldErrorProps {
  /** Ошибка поля */
  error?: string | null;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Компонент для отображения ошибки конкретного поля
 */
export const FieldError: React.FC<FieldErrorProps> = ({
  error,
  className = "",
}) => {
  if (!error) return null;

  return (
    <div className={`text-sm text-destructive mt-1 ${className}`}>{error}</div>
  );
};

// ============================================
// Error Summary Component
// ============================================

export interface ErrorSummaryProps {
  /** Ошибки для отображения */
  errors: Record<string, string>;
  /** Заголовок */
  title?: string;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Компонент для отображения сводки ошибок
 */
export const ErrorSummary: React.FC<ErrorSummaryProps> = ({
  errors,
  title = "Ошибки валидации",
  className = "",
}) => {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <div
      className={`p-4 bg-red-50 border border-red-200 rounded-md ${className}`}
    >
      <div className="flex items-center mb-2">
        <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
        <h3 className="text-sm font-medium text-red-800">{title}</h3>
      </div>
      <ul className="text-sm text-red-700 list-disc list-inside">
        {Object.entries(errors).map(([field, message]) => (
          <li key={field}>
            <span className="font-medium">{field}:</span> {message}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================
// Error Boundary Component
// ============================================

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error?: Error }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("Error caught by ErrorBoundary", error, {
      component: "ErrorBoundary",
      componentStack: errorInfo.componentStack,
    });
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorAlert
          error={this.state.error}
          title="Произошла ошибка"
          variant="alert"
          showDetails={true}
          showRetry={true}
          onRetry={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}
