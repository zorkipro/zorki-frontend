/**
 * DividerWithText - Разделитель с текстом
 *
 * Горизонтальный разделитель с текстом по центру
 * Обычно используется в формах авторизации (например, "или")
 */

import React from "react";
import { Separator } from "@/components/ui/separator";

export interface DividerWithTextProps {
  /** Текст в центре разделителя */
  text: string;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Разделитель с текстом
 *
 * @example
 * ```tsx
 * <DividerWithText text="или" />
 * ```
 */
export const DividerWithText: React.FC<DividerWithTextProps> = ({
  text,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <Separator />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-card px-2 text-muted-foreground text-sm">
          {text}
        </span>
      </div>
    </div>
  );
};
