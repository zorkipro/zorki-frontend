// ============================================
// Error Notification Component
// ============================================
// Компонент для отображения уведомлений об ошибках авторизации

import React, { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/ui-kit";
import { getErrorMessage } from "@/utils/errorHandler";

interface ErrorNotificationProps {
  error: string | unknown | null;
  onDismiss: () => void;
  type?: "error" | "warning" | "info";
}

/**
 * Компонент для отображения уведомлений об ошибках
 * Используется для показа ошибок 401/403 и других проблем авторизации
 */
const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onDismiss,
  type = "error",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      // Автоматически скрываем уведомление через 5 секунд
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Ждем завершения анимации
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [error, onDismiss]);

  if (!error || !isVisible) {
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

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full mx-4 ${getTypeStyles()} border rounded-lg shadow-lg transition-all duration-300 transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      <div className="flex items-start p-4">
        <AlertCircle
          className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${getIconColor()}`}
        />
        <div className="flex-1">
          <h3 className="font-medium text-sm">
            {type === "error"
              ? "Ошибка авторизации"
              : type === "warning"
                ? "Предупреждение"
                : "Информация"}
          </h3>
          <p className="text-sm mt-1">{getErrorMessage(error)}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="ml-2 p-1 h-auto"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ErrorNotification;
