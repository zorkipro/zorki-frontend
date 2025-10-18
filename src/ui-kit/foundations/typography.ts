/**
 * TYPOGRAPHY SYSTEM - Типографическая система
 *
 * Все размеры текста, шрифты, line-heights в одном месте
 */

export const typography = {
  // Шрифты
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },

  // Размеры шрифта
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
    "7xl": "4.5rem", // 72px
  },

  // Высота строки
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  // Толщина шрифта
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },

  // Межбуквенное расстояние
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

/**
 * Готовые стили для типографики
 * Используйте className или style
 */
export const typographyStyles = {
  // Заголовки
  h1: {
    fontSize: typography.fontSize["5xl"],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h2: {
    fontSize: typography.fontSize["4xl"],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
  },
  h3: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.snug,
  },
  h4: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.snug,
  },
  h5: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
  },
  h6: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
  },

  // Текст
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
  },
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },

  // Специальные
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
  },
  code: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
  },
} as const;

/**
 * CSS классы для типографики
 */
export const typographyClasses = {
  h1: "text-5xl font-bold leading-tight tracking-tight",
  h2: "text-4xl font-bold leading-tight",
  h3: "text-3xl font-semibold leading-snug",
  h4: "text-2xl font-semibold leading-snug",
  h5: "text-xl font-medium leading-normal",
  h6: "text-lg font-medium leading-normal",

  bodyLarge: "text-lg font-normal leading-relaxed",
  body: "text-base font-normal leading-normal",
  bodySmall: "text-sm font-normal leading-normal",
  caption: "text-xs font-normal leading-normal",

  label: "text-sm font-medium leading-normal",
  code: "font-mono text-sm",
} as const;

// Типы для TypeScript
export type Typography = typeof typography;
export type TypographyStyles = typeof typographyStyles;
export type TypographyClasses = keyof typeof typographyClasses;
