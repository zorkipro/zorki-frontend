/**
 * COLOR SYSTEM - Система цветов
 *
 * Все цвета проекта собраны в одном месте
 * Используйте эти константы вместо хардкода цветов
 */

export const colors = {
  // Primary - Основной цвет бренда
  primary: {
    50: "hsl(0, 0%, 98%)",
    100: "hsl(0, 0%, 96%)",
    200: "hsl(0, 0%, 90%)",
    300: "hsl(0, 0%, 83%)",
    400: "hsl(0, 0%, 64%)",
    500: "hsl(0, 0%, 45%)",
    600: "hsl(0, 0%, 32%)",
    700: "hsl(0, 0%, 25%)",
    800: "hsl(0, 0%, 15%)",
    900: "hsl(0, 0%, 9%)",
    950: "hsl(0, 0%, 4%)",
  },

  // Success - Успех
  success: {
    light: "hsl(142, 76%, 36%)",
    DEFAULT: "hsl(142, 71%, 45%)",
    dark: "hsl(142, 76%, 36%)",
  },

  // Error - Ошибка
  error: {
    light: "hsl(0, 84%, 60%)",
    DEFAULT: "hsl(0, 72%, 51%)",
    dark: "hsl(0, 70%, 35%)",
  },

  // Warning - Предупреждение
  warning: {
    light: "hsl(48, 96%, 53%)",
    DEFAULT: "hsl(43, 96%, 56%)",
    dark: "hsl(32, 95%, 44%)",
  },

  // Info - Информация
  info: {
    light: "hsl(199, 89%, 48%)",
    DEFAULT: "hsl(200, 98%, 39%)",
    dark: "hsl(201, 96%, 32%)",
  },

  // Neutral - Нейтральные (серые)
  neutral: {
    0: "hsl(0, 0%, 100%)",
    50: "hsl(0, 0%, 98%)",
    100: "hsl(0, 0%, 96%)",
    200: "hsl(0, 0%, 90%)",
    300: "hsl(0, 0%, 83%)",
    400: "hsl(0, 0%, 64%)",
    500: "hsl(0, 0%, 45%)",
    600: "hsl(0, 0%, 32%)",
    700: "hsl(0, 0%, 25%)",
    800: "hsl(0, 0%, 15%)",
    900: "hsl(0, 0%, 9%)",
    950: "hsl(0, 0%, 4%)",
    1000: "hsl(0, 0%, 0%)",
  },
} as const;

/**
 * Семантические цвета
 * Используйте эти названия для конкретных целей
 */
export const semanticColors = {
  // Фоны
  background: {
    primary: colors.neutral[0],
    secondary: colors.neutral[50],
    tertiary: colors.neutral[100],
  },

  // Текст
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    tertiary: colors.neutral[500],
    inverse: colors.neutral[0],
    disabled: colors.neutral[400],
  },

  // Границы
  border: {
    DEFAULT: colors.neutral[200],
    strong: colors.neutral[300],
    subtle: colors.neutral[100],
  },

  // Интерактивные элементы
  interactive: {
    default: colors.primary[900],
    hover: colors.primary[800],
    active: colors.primary[950],
    disabled: colors.neutral[300],
  },
} as const;

/**
 * Цвета для конкретных компонентов
 */
export const componentColors = {
  button: {
    primary: {
      bg: colors.primary[900],
      hover: colors.primary[800],
      active: colors.primary[950],
      text: colors.neutral[0],
    },
    secondary: {
      bg: colors.neutral[100],
      hover: colors.neutral[200],
      active: colors.neutral[300],
      text: colors.neutral[900],
    },
    outline: {
      border: colors.neutral[300],
      hover: colors.neutral[50],
      active: colors.neutral[100],
      text: colors.neutral[900],
    },
    ghost: {
      hover: colors.neutral[100],
      active: colors.neutral[200],
      text: colors.neutral[700],
    },
    danger: {
      bg: colors.error.DEFAULT,
      hover: colors.error.dark,
      text: colors.neutral[0],
    },
  },

  input: {
    bg: colors.neutral[0],
    border: colors.neutral[300],
    borderFocus: colors.primary[900],
    placeholder: colors.neutral[400],
    text: colors.neutral[900],
    disabled: colors.neutral[100],
  },

  card: {
    bg: colors.neutral[0],
    border: colors.neutral[200],
    shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  },
} as const;

// Типы для TypeScript
export type ColorScale = typeof colors;
export type SemanticColors = typeof semanticColors;
export type ComponentColors = typeof componentColors;
