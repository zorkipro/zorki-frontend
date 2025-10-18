/**
 * ErrorAlert - Сообщение об ошибке
 *
 * Универсальный компонент для отображения ошибок
 * Заменяет дублирующийся код в формах
 */

import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";

export interface ErrorAlertProps {
  /** Текст ошибки */
  error?: string | any | null;
  /** Заголовок (опционально) */
  title?: string;
  /** Вариант отображения */
  variant?: "inline" | "alert";
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Сообщение об ошибке
 *
 * @example
 * ```tsx
 * <ErrorAlert error={error} />
 *
 * <ErrorAlert
 *   error={error}
 *   title="Ошибка авторизации"
 *   variant="alert"
 * />
 * ```
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  title,
  variant = "inline",
  className = "",
}) => {
  if (!error) return null;

  if (variant === "inline") {
    return (
      <div
        className={`p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md ${className}`}
      >
        {getErrorMessage(error)}
      </div>
    );
  }

  return (
    <Alert variant="destructive" className={className}>
      {title && <AlertCircle className="h-4 w-4" />}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{getErrorMessage(error)}</AlertDescription>
    </Alert>
  );
};
