/**
 * LoadingSpinner - Индикатор загрузки
 *
 * Универсальный спиннер для различных состояний загрузки
 * Заменяет 3 разных реализации spinner
 */

import React from "react";

export interface LoadingSpinnerProps {
  /** Размер спиннера */
  size?: "sm" | "md" | "lg";
  /** Текст под спиннером */
  text?: string;
  /** Полноэкранный режим */
  fullScreen?: boolean;
  /** Дополнительные CSS классы */
  className?: string;
}

const sizeClasses = {
  sm: {
    container: "w-4 h-4",
    spinner: "w-3 h-3 border",
  },
  md: {
    container: "w-8 h-8",
    spinner: "w-5 h-5 border-2",
  },
  lg: {
    container: "w-12 h-12",
    spinner: "w-8 h-8 border-2",
  },
};

/**
 * Спиннер загрузки
 *
 * @example
 * ```tsx
 * <LoadingSpinner size="md" text="Загрузка..." />
 *
 * <LoadingSpinner fullScreen text="Загрузка страницы..." />
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text,
  fullScreen = false,
  className = "",
}) => {
  const sizes = sizeClasses[size];

  const spinner = (
    <div className="text-center">
      <div
        className={`${sizes.container} bg-black rounded-full flex items-center justify-center mx-auto ${text ? "mb-4" : ""}`}
      >
        <div
          className={`${sizes.spinner} border-white border-t-transparent rounded-full animate-spin`}
        />
      </div>
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`min-h-screen bg-gradient-subtle flex items-center justify-center ${className}`}
      >
        {spinner}
      </div>
    );
  }

  return <div className={className}>{spinner}</div>;
};
