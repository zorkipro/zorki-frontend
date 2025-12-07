import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // Для лучшей работы на мобильных, определяем правильные атрибуты
    const mobileOptimizations = type === "tel" || props.inputMode === "numeric" 
      ? {
          inputMode: "numeric" as const,
          pattern: "[0-9]*",
          // Предотвращаем автокоррекцию и автозаполнение для цифровых полей
          autoComplete: "off",
          autoCorrect: "off",
          spellCheck: false,
        } 
      : {};

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // Улучшенный UX для touch-устройств
          "touch-manipulation",
          // Размер шрифта для предотвращения зума на iOS
          "text-[16px]",
          className,
        )}
        ref={ref}
        {...mobileOptimizations}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
