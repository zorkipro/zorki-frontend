/**
 * SPACING SYSTEM - Система отступов
 *
 * Все отступы, padding, margin, gap в одном месте
 * Базируется на системе 4px
 */

export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
  40: "10rem", // 160px
  48: "12rem", // 192px
  56: "14rem", // 224px
  64: "16rem", // 256px
} as const;

/**
 * Семантические отступы
 * Используйте эти константы для конкретных целей
 */
export const semanticSpacing = {
  // Внутренние отступы компонентов
  componentPadding: {
    xs: spacing[2], // 8px
    sm: spacing[3], // 12px
    md: spacing[4], // 16px
    lg: spacing[6], // 24px
    xl: spacing[8], // 32px
  },

  // Отступы между элементами
  gap: {
    xs: spacing[1], // 4px
    sm: spacing[2], // 8px
    md: spacing[4], // 16px
    lg: spacing[6], // 24px
    xl: spacing[8], // 32px
  },

  // Отступы для секций
  sectionSpacing: {
    xs: spacing[8], // 32px
    sm: spacing[12], // 48px
    md: spacing[16], // 64px
    lg: spacing[24], // 96px
    xl: spacing[32], // 128px
  },

  // Отступы для контейнеров
  containerPadding: {
    mobile: spacing[4], // 16px
    tablet: spacing[6], // 24px
    desktop: spacing[8], // 32px
  },
} as const;

/**
 * Размеры компонентов
 */
export const sizes = {
  // Высота элементов
  height: {
    xs: "1.5rem", // 24px
    sm: "2rem", // 32px
    md: "2.5rem", // 40px
    lg: "3rem", // 48px
    xl: "3.5rem", // 56px
  },

  // Ширина элементов
  width: {
    xs: "4rem", // 64px
    sm: "8rem", // 128px
    md: "16rem", // 256px
    lg: "24rem", // 384px
    xl: "32rem", // 512px
    "2xl": "42rem", // 672px
    full: "100%",
  },

  // Иконки
  icon: {
    xs: "0.75rem", // 12px
    sm: "1rem", // 16px
    md: "1.5rem", // 24px
    lg: "2rem", // 32px
    xl: "3rem", // 48px
  },

  // Аватары
  avatar: {
    xs: "1.5rem", // 24px
    sm: "2rem", // 32px
    md: "2.5rem", // 40px
    lg: "4rem", // 64px
    xl: "6rem", // 96px
  },
} as const;

/**
 * Border radius
 */
export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  DEFAULT: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

// Типы для TypeScript
export type Spacing = typeof spacing;
export type SemanticSpacing = typeof semanticSpacing;
export type Sizes = typeof sizes;
export type BorderRadius = typeof borderRadius;
