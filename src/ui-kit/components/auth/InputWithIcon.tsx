/**
 * InputWithIcon - Input с иконкой
 *
 * Универсальный компонент для полей ввода с иконками
 * Заменяет дублирующийся паттерн Input + Icon
 */

import React from "react";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

export interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Иконка (из lucide-react) */
  icon: LucideIcon;
  /** Позиция иконки */
  iconPosition?: "left" | "right";
  /** Дополнительная иконка справа (например, для показа пароля) */
  rightElement?: React.ReactNode;
}

/**
 * Input с иконкой
 *
 * @example
 * ```tsx
 * <InputWithIcon
 *   icon={Mail}
 *   type="email"
 *   placeholder="your@email.com"
 * />
 * ```
 */
export const InputWithIcon = React.forwardRef<
  HTMLInputElement,
  InputWithIconProps
>(
  (
    {
      icon: Icon,
      iconPosition = "left",
      rightElement,
      className = "",
      ...props
    },
    ref,
  ) => {
    const iconClasses =
      iconPosition === "left"
        ? "absolute left-3 top-3 h-4 w-4 text-muted-foreground"
        : "absolute right-3 top-3 h-4 w-4 text-muted-foreground";

    const inputPadding =
      iconPosition === "left"
        ? rightElement
          ? "pl-10 pr-10"
          : "pl-10"
        : rightElement
          ? "pr-10 pl-10"
          : "pr-10";

    return (
      <div className="relative">
        <Icon className={iconClasses} />
        <Input
          ref={ref}
          className={`${inputPadding} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-3">{rightElement}</div>
        )}
      </div>
    );
  },
);

InputWithIcon.displayName = "InputWithIcon";
