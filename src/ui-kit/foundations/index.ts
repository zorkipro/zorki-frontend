/**
 * FOUNDATIONS - Основы дизайн-системы
 *
 * Базовые элементы дизайн-системы: цвета, типография, отступы, тени
 */

// Re-export все из отдельных файлов
export { colors, semanticColors, componentColors } from "./colors";
export type { ColorScale, SemanticColors, ComponentColors } from "./colors";

export { typography, typographyStyles, typographyClasses } from "./typography";
export type {
  Typography,
  TypographyStyles,
  TypographyClasses,
} from "./typography";

export { spacing, semanticSpacing, sizes, borderRadius } from "./spacing";
export type { Spacing, SemanticSpacing, Sizes, BorderRadius } from "./spacing";

export { shadows, semanticShadows } from "./shadows";
export type { Shadows, SemanticShadows } from "./shadows";

export { breakpoints, mediaQueries, semanticBreakpoints } from "./breakpoints";
export type { Breakpoints, MediaQueries } from "./breakpoints";
